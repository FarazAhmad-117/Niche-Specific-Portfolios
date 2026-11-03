/**
 * The webflow-niche mark: one element on an artboard, selected. An ink tile, a paper block
 * (the element) and a violet selection frame with four square handles, the "Canvas" concept
 * in its smallest form. Not Webflow's logo, colours or shapes.
 *
 * One definition feeds the SVG favicon, the apple-touch-icon and the nav, so they never
 * disagree.
 */
export const INK = '#110e1a';
export const PAPER = '#ffffff';
export const VIOLET = '#9b85ff';

/** On a 32×32 grid. */
export const ELEMENT = { x: 11, y: 11, w: 10, h: 10, r: 1.5 } as const;
export const FRAME = { x: 7.5, y: 7.5, w: 17, h: 17 } as const;
const H = 4.4; // handle size
export const HANDLES = [
  { x: FRAME.x - H / 2, y: FRAME.y - H / 2 },
  { x: FRAME.x + FRAME.w - H / 2, y: FRAME.y - H / 2 },
  { x: FRAME.x - H / 2, y: FRAME.y + FRAME.h - H / 2 },
  { x: FRAME.x + FRAME.w - H / 2, y: FRAME.y + FRAME.h - H / 2 },
].map((p) => ({ ...p, size: H }));

const MARK = [
  `<rect x="${ELEMENT.x}" y="${ELEMENT.y}" width="${ELEMENT.w}" height="${ELEMENT.h}" rx="${ELEMENT.r}" fill="${PAPER}"/>`,
  `<rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.w}" height="${FRAME.h}" fill="none" stroke="${VIOLET}" stroke-width="1.6"/>`,
  ...HANDLES.map((h) => `<rect x="${h.x}" y="${h.y}" width="${h.size}" height="${h.size}" fill="${INK}" stroke="${VIOLET}" stroke-width="1.4"/>`),
].join('');

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 22): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
