/**
 * The seo mark: a search result in three lines, the middle one marked in signal yellow.
 * One definition feeds the SVG favicon, the apple-touch-icon and the nav, so they never disagree.
 */
export const INK = '#121316';
export const PAPER = '#f5f5f0';
export const YELLOW = '#ffd60a';

/** Shapes on a 32×32 grid. `line` = paper lines (title, snippet), `mark` = the highlighter bar. */
export const MARK_SHAPES = {
  lines: [
    { x: 7, y: 8, w: 13, h: 3 },
    { x: 7, y: 21.5, w: 10, h: 3 },
  ],
  mark: { x: 6, y: 13.5, w: 20, h: 5.5 },
} as const;

const rect = (r: { x: number; y: number; w: number; h: number }, fill: string, rx = 1.5) =>
  `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${rx}" fill="${fill}"/>`;

const MARK = [
  ...MARK_SHAPES.lines.map((l) => rect(l, PAPER)),
  rect(MARK_SHAPES.mark, YELLOW, 1.2),
].join('');

export const faviconSvg = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="${INK}"/>${MARK}</svg>`;

/** Full-bleed ink (iOS applies its own mask) with padding. */
export const touchIconSvg = (size = 180, padding = 28): string => {
  const scale = (size - padding * 2) / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${INK}"/><g transform="translate(${padding} ${padding}) scale(${scale})">${MARK}</g></svg>`;
};
