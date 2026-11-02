/**
 * The site mark (spec §8.2): two nodes joined by a wire with a 45° step; the
 * right node is the "live" lime one. One definition feeds the SVG favicon and
 * the apple-touch-icon so they can never disagree.
 */
const INK = '#111110';
const BONE = '#f2f1ec';
const LIME = '#D4FF3A';

/** Mark on a 32×32 grid. */
const MARK = `<path d="M8 20H12L20 12H24" fill="none" stroke="${BONE}" stroke-width="2" stroke-linejoin="round"/><circle cx="8" cy="20" r="3" fill="${BONE}"/><circle cx="24" cy="12" r="3" fill="${LIME}"/>`;

/** Favicon: ink rounded square, mark fills the grid. */
export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="${INK}"/>${MARK}</svg>`;

/** Touch icon: full-bleed ink (iOS applies its own mask) with 24px padding at 180px. */
export const touchIconSvg = (size = 180, padding = 24): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
