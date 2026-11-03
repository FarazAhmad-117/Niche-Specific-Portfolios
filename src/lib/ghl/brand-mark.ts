/**
 * The ghl mark: two patch jacks joined by one orthogonal teal cable, the "every wire labelled"
 * switchboard in its smallest form. One definition feeds the SVG favicon, the
 * apple-touch-icon and the nav, so they never disagree.
 */
export const INK = '#121211';
export const PAPER = '#f4f2ec';
export const TEAL = '#2cc9b5';

/** Cable on a 32×32 grid, jack to jack. Exported so the nav can draw it in currentColor. */
export const CABLE_D = 'M9 10.5H13.5Q16 10.5 16 13V19Q16 21.5 18.5 21.5H23';
export const JACKS = [
  { cx: 9, cy: 10.5 },
  { cx: 23, cy: 21.5 },
] as const;

const jack = (cx: number, cy: number) =>
  `<circle cx="${cx}" cy="${cy}" r="4" fill="${PAPER}"/><circle cx="${cx}" cy="${cy}" r="1.7" fill="${INK}"/>`;

const MARK = `<path d="${CABLE_D}" fill="none" stroke="${TEAL}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${JACKS.map((j) => jack(j.cx, j.cy)).join('')}`;

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 26): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
