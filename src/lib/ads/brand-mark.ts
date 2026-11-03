/**
 * The ads mark: a spend line climbing to a dashed threshold and flattening along it, the
 * "guarded budget" in its smallest form. One definition feeds the SVG favicon, the
 * apple-touch-icon and the nav, so they never disagree.
 */
export const GRAPHITE = '#141414';
export const BONE = '#ededE7';
export const AMBER = '#ffb020';

/** On a 32×32 grid. Exported so the nav can draw them with theme colours. */
export const THRESHOLD_D = 'M6 11.5H26';
export const LINE_D = 'M6 24L11 19.5L15 21.5L20 11.5H26';
export const DOT = { cx: 20, cy: 11.5 } as const;

const MARK = `<path d="${THRESHOLD_D}" stroke="${BONE}" stroke-opacity="0.55" stroke-width="1.6" stroke-dasharray="2.2 2.2" stroke-linecap="round"/><path d="${LINE_D}" fill="none" stroke="${AMBER}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="2.6" fill="${AMBER}" stroke="${GRAPHITE}" stroke-width="1.4"/>`;

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="${GRAPHITE}"/>${MARK}</svg>`;

/** Full-bleed graphite (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 26): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${GRAPHITE}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
