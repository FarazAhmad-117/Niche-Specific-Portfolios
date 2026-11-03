/**
 * Small always-on behaviours for the wp niche: section reveals, column rules that draw in,
 * pausing off-screen CSS loops, and settling direct #hash landings. Nav, theme, hero and the
 * before/after player keep their scripts with their components.
 */

const hasIO = 'IntersectionObserver' in window;

export function prefersReduced(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

const px = (v: string): number => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/** Scroll position at which `el` sits where a native #hash jump would put it. */
export function anchorY(el: Element): number {
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

function hashTarget(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* keep raw */
  }
  return document.getElementById(id);
}

const isBackForward = (): boolean => {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return nav?.type === 'back_forward';
  } catch {
    return false;
  }
};

/**
 * [data-reveal] blocks, [data-reveal-stagger] lists and [data-draw] section heads (their rules
 * draw in). Only elements below the fold at init are armed, and never on back/forward, where a
 * page transition may morph into a card at that moment.
 */
function initReveals(): void {
  if (!hasIO || prefersReduced() || isBackForward()) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger], [data-draw]')].filter(
    // A named element must never be invisible when a transition snapshots it.
    (el) => !el.style.viewTransitionName,
  );
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      });
    },
    // threshold 0: a ratio would never be met by a group taller than the viewport.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  );
  const fold = window.innerHeight;
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < fold) return; // above the fold: never hidden
    if (el.hasAttribute('data-reveal-stagger')) {
      [...el.children].forEach((child, i) => {
        if (child instanceof HTMLElement) child.style.setProperty('--i', String(i));
      });
    }
    el.classList.add('is-armed');
    io.observe(el);
  });
  window.addEventListener('beforeprint', () => els.forEach((el) => el.classList.add('is-revealed')));
}

/** Pause CSS animation loops ([data-pause-offscreen]) while off screen or in a hidden tab. */
function initPause(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-pause-offscreen]');
  if (!els.length) return;
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
    });
    els.forEach((el) => io.observe(el));
  }
  const sync = () => els.forEach((el) => el.classList.toggle('is-hidden-tab', document.hidden));
  document.addEventListener('visibilitychange', sync);
  sync();
}

/**
 * Direct #hash loads: the browser jumps before fonts swap and before content above the
 * target settles. Keep re-landing while the page height changes, until the visitor acts.
 */
function initHashLanding(): void {
  const target = hashTarget(location.hash);
  if (!target) return;
  let done = false;
  const INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  let ro: ResizeObserver | null = null;
  const stop = () => {
    done = true;
    INPUT.forEach((t) => window.removeEventListener(t, stop));
    ro?.disconnect();
  };
  INPUT.forEach((t) => window.addEventListener(t, stop, { passive: true }));
  const land = () => {
    if (done) return;
    const y = anchorY(target);
    if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: 'instant' });
  };
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => requestAnimationFrame(land));
    ro.observe(document.body);
  }
  document.fonts?.ready.then(() => requestAnimationFrame(land)).catch(() => {});
  if (document.readyState === 'complete') land();
  else window.addEventListener('load', () => requestAnimationFrame(land), { once: true });
  window.setTimeout(stop, 4000);
}

for (const init of [initReveals, initPause, initHashLanding]) {
  try {
    init();
  } catch (err) {
    console.error('[wp] init failed', err);
  }
}
