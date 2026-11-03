/**
 * The apps mark: an "F" cut from 4-unit drafting strokes, with a crop-mark corner at the
 * bottom right. The F holds the top-left of an implied drawing frame and the corner closes
 * it, so the mark is a monogram and a sheet at once.
 *
 * Built on a 32-unit grid with every edge on an even unit, so at 16px each stroke is exactly
 * 2px and the corner 1px, with no half-pixel blur; at 32px it is pixel-exact. Optical
 * balance: the F's bars end short of centre (x 22 / 20) so its open right side carries the
 * same weight as the stem, and the corner (x 18–24, y 18–24) sits in the F's empty
 * bottom-right quadrant.
 *
 * One definition feeds the nav, the SVG favicon (which follows the OS colour scheme), the
 * apple-touch-icon and the OG images, so they never disagree.
 */
export const INK_BLUE = '#1e3fb8';
export const PAPER = '#f3f1ea';
export const INK = '#141821';
/** The corner on ink blue (light) and on graphite (dark). */
export const TICK_ON_BLUE = '#a7baff';
export const GRAPHITE = '#1b1e23';
export const GRAPHITE_EDGE = '#3a3e46';
export const CHALK = '#eef0f2';
export const TICK_ON_GRAPHITE = '#8ea8ff';

/** The F: top bar, stem and middle bar as one filled outline. */
export const GLYPH_D = 'M8 8h14v4H12v4h8v4h-8v4H8z';
/** The crop-mark corner. */
export const TICK_D = 'M18 22h4v-4h2v6h-6z';

const inner = (glyph: string, tick: string) => `<path d="${GLYPH_D}" fill="${glyph}"/><path d="${TICK_D}" fill="${tick}"/>`;

/** Inline SVG for satori (OG images) and anywhere a standalone mark is needed. */
export const markSvg = (size = 32): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}"><rect width="32" height="32" rx="7" fill="${INK_BLUE}"/>${inner('#ffffff', TICK_ON_BLUE)}</svg>`;

/** Favicon: ink blue tile; under a dark OS scheme a graphite tile with a hairline edge. */
export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><style>.t{fill:${INK_BLUE}}.e{fill:none;stroke:none}.g{fill:#fff}.k{fill:${TICK_ON_BLUE}}@media (prefers-color-scheme:dark){.t{fill:${GRAPHITE}}.e{stroke:${GRAPHITE_EDGE}}.g{fill:${CHALK}}.k{fill:${TICK_ON_GRAPHITE}}}</style><rect class="t" width="32" height="32" rx="7"/><rect class="e" x=".5" y=".5" width="31" height="31" rx="6.5"/><path class="g" d="${GLYPH_D}"/><path class="k" d="${TICK_D}"/></svg>`;

/** Full-bleed ink blue (iOS applies its own mask). The 32-grid mark is scaled about its centre. */
export const touchIconSvg = (size = 180, padding = 4): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK_BLUE}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${inner('#ffffff', TICK_ON_BLUE)}</g></svg>`;
};
