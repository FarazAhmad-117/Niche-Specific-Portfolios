/**
 * The wp mark: a pilcrow (¶), the paragraph sign, drawn as shapes on an ink tile. It is the
 * oldest mark in publishing and the block editor's own "paragraph" glyph, so it says
 * "writing on the web" without borrowing anyone's logo. The bowl is ultramarine; the stems
 * are paper. One definition feeds the SVG favicon, the apple-touch-icon and the nav.
 */
export const INK = '#14141a';
export const PAPER = '#fafaf7';
export const ULTRA = '#3a3aff';
/** A lighter ultramarine for the bowl on the ink tile (decorative). */
export const ULTRA_ON_INK = '#7a7aff';

/** On a 32×32 grid. Exported so the nav can draw them in currentColor / var(--accent). */
export const BOWL_D = 'M15.6 7.2H13.9A5.15 5.15 0 0 0 13.9 17.5H15.6Z';
export const STEMS_D = 'M15.6 7.2H23V24.8H20.7V9.4H17.9V24.8H15.6Z';

const MARK = (bowl: string, stems: string) => `<path d="${BOWL_D}" fill="${bowl}"/><path d="${STEMS_D}" fill="${stems}"/>`;

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="${INK}"/>${MARK(ULTRA_ON_INK, PAPER)}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 30): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK(ULTRA_ON_INK, PAPER)}</g></svg>`;
};

/** The mark on paper (OG images): ink stems, ultramarine bowl, no tile. */
export const markOnPaperSvg = (size = 64): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 5 20 22" width="${size}" height="${(size * 22) / 20}">${MARK(ULTRA, INK)}</svg>`;
