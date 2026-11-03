/**
 * Tiny, GSAP-free registration API for scroll animations (spec §7.11.3).
 *
 * Sections import onMotion from HERE (never from ./motion), so GSAP/Lenis stay
 * in the lazy chunk that <Motion /> loads. Setups queue until motion starts,
 * run inside a gsap.context (so ScrollTriggers, pins and inline styles are
 * reverted on teardown), and run again if motion restarts later.
 *
 *   import { onMotion } from '../lib/motion-registry';
 *   onMotion(({ gsap, ScrollTrigger }) => {
 *     const mm = gsap.matchMedia();
 *     mm.add('(min-width: 1024px)', () => { ...; return () => {...} });
 *     return () => mm.revert();
 *   });
 */
import type { Motion } from './motion';

export type MotionSetup = (motion: Motion) => void | (() => void);

interface Registered {
  revert: () => void;
}

const setups = new Set<MotionSetup>();
const running = new Map<MotionSetup, Registered>();
let active: Motion | null = null;

function run(setup: MotionSetup, motion: Motion): void {
  let cleanup: void | (() => void);
  const ctx = motion.gsap.context(() => {
    try {
      cleanup = setup(motion);
    } catch (err) {
      console.error('[motion] setup failed', err);
    }
  });
  running.set(setup, {
    revert() {
      try {
        if (typeof cleanup === 'function') cleanup();
      } catch (err) {
        console.error('[motion] cleanup failed', err);
      }
      ctx.revert();
    },
  });
}

/** Register a setup. Runs now if motion is active, else when it starts. Returns an unregister fn. */
export function onMotion(setup: MotionSetup): () => void {
  setups.add(setup);
  if (active) run(setup, active);
  return () => {
    setups.delete(setup);
    running.get(setup)?.revert();
    running.delete(setup);
  };
}

/** The running motion instance, without importing GSAP. */
export const getActiveMotion = (): Motion | null => active;

/** @internal called by motion.ts */
export function activateMotion(motion: Motion): void {
  active = motion;
  setups.forEach((s) => run(s, motion));
  document.dispatchEvent(new CustomEvent('motion:ready'));
}

/** @internal called by motion.ts */
export function deactivateMotion(): void {
  running.forEach((r) => r.revert());
  running.clear();
  active = null;
  document.dispatchEvent(new CustomEvent('motion:destroy'));
}
