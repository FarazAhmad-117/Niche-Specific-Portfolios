/**
 * The `all` mark: a 2×2 index of tiles, one lit in a lighter grey. "Every site, one place" in its
 * smallest form. One definition feeds the SVG favicon, the apple-touch-icon and the top bar.
 */
export const INK = '#17161a';
export const PAPER = '#f5f4f1';
export const MUTED = '#8d8c94'; /* the one lighter tile: monochrome, no niche colour */

/** Tiles on a 32×32 grid: [x, y, lit]. Exported so the bar can draw it in currentColor. */
export const TILES = [
  { x: 7, y: 7, lit: false },
  { x: 17, y: 7, lit: true },
  { x: 7, y: 17, lit: false },
  { x: 17, y: 17, lit: false },
] as const;
export const TILE = 8;
export const TILE_R = 2;

const MARK = TILES.map(
  (t) =>
    `<rect x="${t.x}" y="${t.y}" width="${TILE}" height="${TILE}" rx="${TILE_R}" fill="${t.lit ? MUTED : PAPER}"/>`,
).join('');

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 26): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
