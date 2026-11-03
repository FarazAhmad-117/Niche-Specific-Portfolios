/**
 * The funnels mark: a lead (cream dot) travelling a soft S-curve to a booked call (rose dot).
 * One definition feeds the SVG favicon, the apple-touch-icon and the nav, so they never disagree.
 */
export const INK = '#1c1916';
export const CREAM = '#f7f2ea';
export const ROSE = '#ff3d7f';

/** Curve on a 32×32 grid. Exported so the nav can draw it in currentColor. */
export const CURVE_D = 'M7.5 22.5C14 22.5 13 9.5 20 9.5H24.5';

const MARK = `<path d="${CURVE_D}" fill="none" stroke="${CREAM}" stroke-width="2.4" stroke-linecap="round"/><circle cx="7.5" cy="22.5" r="3.2" fill="${CREAM}"/><circle cx="24.5" cy="9.5" r="3.6" fill="${ROSE}"/>`;

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="9" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 26): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
