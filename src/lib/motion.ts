/**
 * Shared smooth-scroll + scroll-animation runtime (Lenis + GSAP ScrollTrigger).
 *
 * This module is the heavy chunk (about 52 KB gz). Do not import it statically:
 * <Motion /> (src/components/shared/Motion.astro) loads it lazily behind a
 * media-query gate, and sections register their animations through
 * src/lib/motion-registry.ts (onMotion), which has no GSAP dependency.
 *
 * - Lenis is driven by GSAP's ticker (no second rAF loop) and feeds
 *   ScrollTrigger.update, so both stay in sync.
 * - initMotion(query) watches `query`: when it stops matching (reduced motion
 *   turned on, window resized below the gate) everything is torn down, and
 *   when it matches again motion restarts and registered setups re-run.
 * - destroy() reverts every registered setup (ScrollTriggers, pin spacers,
 *   inline styles) before killing Lenis.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { activateMotion, deactivateMotion } from './motion-registry';

export interface Motion {
  lenis: Lenis;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** Smooth-scroll to where a native #hash jump would land (scroll-padding + scroll-margin), then focus it. */
  scrollToTarget: (target: Element, opts?: { focus?: boolean; duration?: number }) => void;
  /** Pause/resume smooth scrolling (e.g. while a menu is open). */
  stop: () => void;
  start: () => void;
  destroy: () => void;
}

/** Default gate kept for direct initMotion() callers: any device, motion allowed. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

let current: Motion | null = null;
let watched: MediaQueryList | null = null;

/**
 * Where the browser itself would put `el` for a #hash jump: html scroll-padding-top plus the
 * element's scroll-margin-top. Lenis and native jumps then land on the same pixel, and the
 * CSS stays the single source of truth for the landing offset.
 */
function anchorY(el: Element): number {
  const px = (v: string) => {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  let pad = 0;
  let margin = 0;
  try {
    pad = px(getComputedStyle(document.documentElement).scrollPaddingTop);
    margin = px(getComputedStyle(el).scrollMarginTop);
  } catch {
    /* defaults */
  }
  const y = el.getBoundingClientRect().top + window.scrollY - pad - margin;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(y, max));
}

/** Expo-out: covers most of the distance quickly, then settles softly. */
const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function focusTarget(el: Element): void {
  if (!(el instanceof HTMLElement)) return;
  const focusable = el.matches('a[href], button, input, select, textarea, [tabindex]');
  if (!focusable) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function start(): Motion {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  });
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000); // gsap seconds -> ms
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const scrollToTarget: Motion['scrollToTarget'] = (target, opts = {}) => {
    const y = anchorY(target);
    // Short hops feel instant, long ones never drag: 0.6s to 1.3s by distance.
    const { focus = true, duration = Math.min(1.3, 0.6 + Math.abs(y - window.scrollY) / 4000) } = opts;
    lenis.scrollTo(y, {
      duration,
      easing: easeOutExpo,
      onComplete: () => {
        if (focus) focusTarget(target);
      },
    });
  };

  // Same-page anchors: Lenis scroll + correct focus + history entry (§7.10).
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!(a instanceof HTMLAnchorElement) || a.target === '_blank' || a.hasAttribute('download')) return;
    let url: URL;
    try {
      url = new URL(a.href, location.href);
    } catch {
      return;
    }
    if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return;
    let id = url.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep raw */
    }
    const target = document.getElementById(id);
    if (!target) {
      // "#top" with no such element means the top of the page (HTML spec).
      if (id.toLowerCase() !== 'top') return;
      e.preventDefault();
      lenis.scrollTo(0, { duration: Math.min(1.3, 0.6 + window.scrollY / 4000), easing: easeOutExpo });
      return;
    }
    e.preventDefault();
    scrollToTarget(target);
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
  };
  document.addEventListener('click', onClick);

  // Font swaps change heights; pin positions depend on them.
  let alive = true;
  document.fonts?.ready.then(() => {
    if (alive) ScrollTrigger.refresh();
  });
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) ScrollTrigger.refresh();
  };
  window.addEventListener('pageshow', onPageShow);

  const motion: Motion = {
    lenis,
    gsap,
    ScrollTrigger,
    scrollToTarget,
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    destroy() {
      if (current !== motion) return;
      alive = false;
      current = null;
      deactivateMotion(); // reverts registered setups: ScrollTriggers, pins, inline styles
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onPageShow);
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
  current = motion;
  activateMotion(motion);
  return motion;
}

const onGateChange = (e: MediaQueryListEvent) => {
  if (e.matches) current ??= start();
  else current?.destroy();
};

/**
 * Idempotent. Starts motion while `query` matches and keeps watching it.
 * Returns null on the server or while the query does not match.
 */
export function initMotion(query: string = MOTION_OK): Motion | null {
  if (typeof window === 'undefined') return null;
  let mql: MediaQueryList;
  try {
    mql = window.matchMedia(query);
  } catch {
    return null;
  }
  if (watched?.media !== mql.media) {
    watched?.removeEventListener('change', onGateChange);
    watched = mql;
    mql.addEventListener('change', onGateChange);
  }
  if (!mql.matches) {
    current?.destroy();
    return null;
  }
  current ??= start();
  return current;
}

/** Tear everything down and stop watching. */
export function destroyMotion(): void {
  watched?.removeEventListener('change', onGateChange);
  watched = null;
  current?.destroy();
}

/** The running instance, if any. */
export const getMotion = (): Motion | null => current;
