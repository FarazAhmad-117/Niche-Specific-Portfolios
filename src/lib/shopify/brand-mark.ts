/**
 * The shopify mark: a clay swing tag, punched and strung, hanging at an angle on an ink tile.
 * The price tag of the "Storefront" concept in its smallest form. One definition feeds the SVG
 * favicon, the apple-touch-icon, the OG images and the nav, so they never disagree.
 * Deliberately not Shopify's bag or green: nothing here should read as Shopify's own brand.
 */
export const INK = '#1f1712';
export const PAPER = '#f6f1e9';
export const CLAY = '#d9532b';

/** On a 32×32 grid, before the group rotation. Exported so the nav can draw it in CSS colours. */
export const TAG_D = 'M12 10.5H24.5Q26.5 10.5 26.5 12.5V19.5Q26.5 21.5 24.5 21.5H12L6.5 16Z';
export const HOLE = { cx: 11.6, cy: 16, r: 1.9 } as const;
export const STRING_D = 'M11.6 16C8.6 13.2 6.4 9.6 4.2 5.6';
export const ROTATE = 'rotate(-32 16 16)';

const MARK = `<g transform="${ROTATE}"><path d="${STRING_D}" fill="none" stroke="${PAPER}" stroke-width="1.6" stroke-linecap="round"/><path d="${TAG_D}" fill="${CLAY}"/><circle cx="${HOLE.cx}" cy="${HOLE.cy}" r="${HOLE.r}" fill="${INK}"/><path d="M16.5 18.2H22.5" stroke="${PAPER}" stroke-width="1.5" stroke-linecap="round"/></g>`;

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 26): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};

/** The mark on its own (no tile), for the OG images. */
export const markSvg = (size = 64): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}"><rect width="32" height="32" rx="8" fill="${INK}"/>${MARK}</svg>`;
