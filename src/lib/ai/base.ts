/**
 * Small always-on behaviours for the ai niche (spec §7.1 "base.js"):
 * section reveals (§7.3), pausing off-screen CSS loops (§7.2) and settling
 * direct #hash landings. Nav, menu, theme and sticky CTA live with their components.
 */
import { anchorY, hashTarget } from './anchor';

const hasIO = 'IntersectionObserver' in window;

function prefersReduced(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** [data-reveal] blocks and [data-reveal-stagger] lists. Only elements below the fold at init are armed. */
function initReveals(): void {
  if (!hasIO || prefersReduced()) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')];
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
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
}

/** Pause CSS animation loops ([data-pause-offscreen]) while off screen. */
function initPause(): void {
  if (!hasIO) return;
  const els = document.querySelectorAll<HTMLElement>('[data-pause-offscreen]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
  });
  els.forEach((el) => io.observe(el));
  document.addEventListener('visibilitychange', () => {
    els.forEach((el) => el.classList.toggle('is-hidden-tab', document.hidden));
  });
}

/**
 * Direct #hash loads: the browser jumps before web fonts swap in and before lazy content
 * above the target settles, and either moves the target off its mark. Keep re-landing while
 * the page's height changes during the first few seconds, until the visitor scrolls or types.
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
    console.error('[ai] init failed', err);
  }
}
