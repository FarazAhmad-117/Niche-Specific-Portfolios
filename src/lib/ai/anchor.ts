/**
 * Anchor landing helpers. The landing offset lives in CSS (html scroll-padding-top +
 * each section's scroll-margin-top, see base.css and Section.astro); these read it back so
 * script-driven scrolls land on exactly the pixel a native #hash jump would.
 * src/lib/motion.ts carries its own copy of anchorY so the lazy chunk stays self-contained.
 */

const px = (v: string): number => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/** Scroll position at which `el` sits where the browser's own #hash jump would put it. */
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

/** The element a "#id" hash points at, or null. */
export function hashTarget(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* keep raw */
  }
  return document.getElementById(id);
}
