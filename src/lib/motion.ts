/**
 * Shared smooth-scroll + scroll-animation init (Lenis + GSAP ScrollTrigger).
 *
 * Opt in per niche by rendering <Motion /> (src/components/shared/Motion.astro)
 * in that niche's layout, or by calling initMotion() from your own script.
 * Niches that never opt in never download Lenis or GSAP.
 *
 * - Lenis is driven by GSAP's ticker (no second rAF loop) and feeds
 *   ScrollTrigger.update, so both stay in sync.
 * - Does nothing while `prefers-reduced-motion: reduce` matches, and tears
 *   itself down if the user turns that setting on later.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface Motion {
  lenis: Lenis;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  destroy: () => void;
}

const REDUCED = '(prefers-reduced-motion: reduce)';
let current: Motion | null = null;
let watching = false;

function start(): Motion {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000); // gsap seconds -> ms
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    gsap,
    ScrollTrigger,
    destroy() {
      gsap.ticker.remove(tick);
      lenis.destroy();
      current = null;
    },
  };
}

/** Idempotent. Returns null on the server or when reduced motion is requested. */
export function initMotion(): Motion | null {
  if (typeof window === 'undefined') return null;

  const mql = window.matchMedia(REDUCED);

  if (!watching) {
    watching = true;
    mql.addEventListener('change', (e) => {
      if (e.matches) current?.destroy();
      else initMotion();
    });
  }

  if (mql.matches) return null;
  current ??= start();
  return current;
}

/** The running instance, if any (null when reduced motion or not opted in). */
export const getMotion = (): Motion | null => current;
