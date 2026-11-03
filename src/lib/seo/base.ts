/**
 * Small always-on behaviours for the seo niche: section reveals, highlighter sweeps, pausing
 * off-screen CSS loops, and settling direct #hash landings. Nav, theme, the hero lab and the
 * growth chart keep their own scripts with their components.
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

/**
 * [data-reveal] blocks, [data-reveal-stagger] lists and .mark[data-mark] highlighter strokes.
 * Only elements below the fold at init are armed, so nothing visible at load ever blinks out.
 */
function initReveals(): void {
  if (!hasIO || prefersReduced()) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger], .mark[data-mark]')];
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        if (el.classList.contains('mark')) {
          // Let the block it sits in land first, then draw the stroke.
          window.setTimeout(() => el.classList.add('is-on'), Number(el.dataset.markDelay ?? 220));
        } else {
          el.classList.add('is-revealed');
        }
        io.unobserve(el);
      });
    },
    // threshold 0: a ratio would never be met by a group taller than the viewport.
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );
  const fold = window.innerHeight;
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < fold * 0.9) return; // above the fold: never hidden
    if (el.hasAttribute('data-reveal-stagger')) {
      [...el.children].forEach((child, i) => {
        if (child instanceof HTMLElement) child.style.setProperty('--i', String(i));
      });
    }
    el.classList.add('is-armed');
    io.observe(el);
  });
  // Printing or "find in page" must never meet hidden content.
  window.addEventListener('beforeprint', () =>
    els.forEach((el) => el.classList.add(el.classList.contains('mark') ? 'is-on' : 'is-revealed')),
  );
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
    console.error('[seo] init failed', err);
  }
}
