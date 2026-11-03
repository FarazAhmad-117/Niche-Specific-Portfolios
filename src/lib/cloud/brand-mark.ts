/**
 * The cloud mark: four uptime bars on an ink plate, the last one mint ("all green").
 * One definition feeds the SVG favicon, the apple-touch-icon and the nav, so they never disagree.
 */
export const INK = '#0b1115';
export const BONE = '#e7f0ee';
export const MINT = '#4fe3ae';

/** Bars on a 32×32 grid: [x, y, w, h]. Exported so the nav can draw them in currentColor. */
export const BARS: readonly (readonly [number, number, number, number])[] = [
  [7, 9, 3.2, 14],
  [12.2, 9, 3.2, 14],
  [17.4, 9, 3.2, 14],
  [22.6, 9, 3.2, 14],
];

const rects = (fill: (i: number) => string) =>
  BARS.map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="${fill(i)}"/>`).join('');

const MARK = rects((i) => (i === BARS.length - 1 ? MINT : BONE));

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 30): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
