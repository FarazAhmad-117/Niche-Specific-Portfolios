/**
 * Build-time Open Graph images for the webflow niche: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. The home card shows the headline and a selected element on a canvas; a case card
 * shows its name, its angle and its method or stack as navigator rows. The example case is
 * labelled "EXAMPLE BUILD · ILLUSTRATIVE" on the card itself.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/webflow/site';
import { CASES, type CaseSlug, type WebflowCase } from '../../data/webflow/cases';
import { HERO } from '../../data/webflow/content';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  paper: '#ffffff',
  canvas: '#ecebf2',
  dot: '#c9c6d4',
  panel: '#f4f3f8',
  line: '#e3e1ea',
  ink: '#110e1a',
  ink2: '#3f3a4f',
  ink3: '#5d586c',
  violet: '#6b4cff',
  violetText: '#5534f0',
  violetSoft: '#ece8ff',
  coral: '#ff6a45',
} as const;

type Style = Record<string, string | number>;
type Child = El | string;
interface El {
  type: string;
  props: { style: Style; children?: Child | Child[]; src?: string; width?: number; height?: number };
}
const h = (style: Style, children?: Child | Child[]): El => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});
const img = (svg: string, width: number, height: number, style: Style = {}): El => ({
  type: 'img',
  props: { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, width, height, style },
});

const fontDir = path.resolve(process.cwd(), 'src/assets/fonts/og');
const load = (file: string) => readFileSync(path.join(fontDir, file));
let fontCache: Parameters<typeof satori>[1]['fonts'] | undefined;
function fonts() {
  fontCache ??= [
    { name: 'Unbounded', data: load('Unbounded-Bold.woff'), weight: 700, style: 'normal' },
    { name: 'Switzer', data: load('Switzer-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: load('JetBrainsMono-Regular.woff'), weight: 400, style: 'normal' },
  ];
  return fontCache;
}

const mono = (size: number, color: string, extra: Style = {}): Style => ({
  fontFamily: 'JetBrains Mono',
  fontSize: size,
  color,
  ...extra,
});
// The OG fonts have no arrow glyph; satori would draw a missing-glyph box.
const plain = (s: string) => s.replace(/\s*→\s*/g, ' to ');

/** The dotted canvas, as one SVG (satori has no repeating backgrounds). */
function dotsSvg(width: number, height: number): string {
  const step = 22;
  let dots = '';
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) dots += `<circle cx="${x}" cy="${y}" r="1.4"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${C.canvas}"/><g fill="${C.dot}">${dots}</g></svg>`;
}

/** A selection frame with four square handles, drawn over a box of the given size. */
function selectionSvg(width: number, height: number): string {
  const s = 10;
  const corners = [
    [0, 0],
    [width - s, 0],
    [0, height - s],
    [width - s, height - s],
  ]
    .map(([x, y]) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.paper}" stroke="${C.violet}" stroke-width="2.5"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="${s / 2}" y="${s / 2}" width="${width - s}" height="${height - s}" fill="none" stroke="${C.violet}" stroke-width="2.5"/>${corners}</svg>`;
}

const chip = (text: string, accent = true): El =>
  h(
    {
      alignItems: 'center',
      gap: 10,
      padding: '5px 14px 5px 10px',
      borderRadius: 6,
      background: accent ? C.violetSoft : C.panel,
      ...mono(19, accent ? C.violetText : C.ink2),
    },
    [h({ width: 11, height: 11, borderRadius: 3, background: accent ? C.violet : C.ink3 }), text],
  );

const footer = (): El =>
  h({ position: 'absolute', left: M, bottom: M - 16, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    h(mono(21, C.ink2), 'Webflow developer'),
  ]);

/** The right-hand artboard: a mini page with its heading selected. Shapes and labels only. */
function artboard(): El {
  const bar = (w: number, c: string = C.line) => h({ width: w, height: 8, borderRadius: 4, background: c });
  return h({ position: 'absolute', right: 0, top: 0, width: 470, height: H }, [
    img(dotsSvg(470, H), 470, H, { position: 'absolute', left: 0, top: 0 }),
    h(
      {
        position: 'absolute',
        left: 56,
        top: 104,
        width: 360,
        flexDirection: 'column',
        gap: 16,
        padding: '22px 24px 26px',
        borderRadius: 14,
        background: C.paper,
        border: `1px solid ${C.line}`,
        boxShadow: '0 30px 60px -30px rgba(40,24,110,0.38)',
      },
      [
        h({ justifyContent: 'space-between', alignItems: 'center' }, [
          h({ width: 22, height: 22, borderRadius: 6, background: C.violet }),
          h({ gap: 8 }, [bar(34), bar(34), bar(34)]),
        ]),
        h({ position: 'relative', flexDirection: 'column', marginTop: 18, padding: '8px 10px' }, [
          h({ fontFamily: 'Unbounded', fontWeight: 700, fontSize: 27, lineHeight: 1.12, color: C.ink, letterSpacing: '-0.03em' }, 'Release notes, written for humans.'),
          img(selectionSvg(322, 86), 322, 86, { position: 'absolute', left: -2, top: -2 }),
          h(
            {
              position: 'absolute',
              left: 3,
              top: -28,
              padding: '2px 9px',
              borderRadius: 4,
              background: C.violet,
              ...mono(15, C.paper),
            },
            'heading-style-h1',
          ),
        ]),
        h({ flexDirection: 'column', gap: 8 }, [bar(280), bar(200)]),
        h({ padding: '7px 16px', borderRadius: 7, background: C.ink, color: C.paper, fontFamily: 'Switzer', fontSize: 17, width: 118 }, 'Start free'),
        h({ gap: 12, marginTop: 6 }, [
          h({ width: 96, height: 70, borderRadius: 8, background: C.violet }),
          h({ width: 96, height: 70, borderRadius: 8, background: C.ink }),
          h({ width: 96, height: 70, borderRadius: 8, background: C.violetSoft }),
        ]),
      ],
    ),
    h({ position: 'absolute', left: 56, top: 72, ...mono(16, C.ink3) }, 'Home · Desktop · 1280'),
    h({ position: 'absolute', left: 56, bottom: 58, ...mono(16, C.ink3) }, 'Illustrative mock'),
  ]);
}

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(mono(21, C.ink2, { position: 'absolute', left: M, top: M - 16 }), 'webflow.farazahmad.dev'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 150,
        width: 640,
        flexDirection: 'column',
        fontFamily: 'Unbounded',
        fontWeight: 700,
        fontSize: 60,
        lineHeight: 1.06,
        letterSpacing: '-0.035em',
        color: C.ink,
      },
      HERO.headline.map((line, i) => h(i === HERO.headline.length - 1 ? { color: C.violetText } : {}, line)),
    ),
    h({ position: 'absolute', left: M, top: 384, gap: 10 }, [chip('Figma to Webflow'), chip('CMS', false), chip('Motion', false)]),
    artboard(),
    footer(),
  ]);
}

/** A case: its label, name, angle, and its method/stack as navigator rows. */
function caseTree(c: WebflowCase): El {
  const rows = c.flow.map((s, i) =>
    h({ alignItems: 'center', gap: 14, height: 58, paddingLeft: 18, borderTop: i ? `1px solid ${C.line}` : 'none' }, [
      h(mono(16, C.ink3, { width: 30 }), String(i + 1).padStart(2, '0')),
      chip(plain(s), i === 0),
    ]),
  );
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(
      mono(21, c.example ? C.ink2 : C.violetText, { position: 'absolute', left: M, top: M - 16, letterSpacing: '0.05em' }),
      c.example ? 'EXAMPLE BUILD · ILLUSTRATIVE' : 'CASE STUDY · ASTRO, NOT WEBFLOW',
    ),
    h(mono(21, C.ink2, { position: 'absolute', right: M, top: M - 16 }), 'webflow.farazahmad.dev'),
    h({ position: 'absolute', left: M, top: 150, width: 560, flexDirection: 'column', gap: 26 }, [
      h(
        {
          fontFamily: 'Unbounded',
          fontWeight: 700,
          fontSize: c.name.length > 20 ? 46 : 54,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: C.ink,
        },
        plain(c.name),
      ),
      h({ fontFamily: 'Switzer', fontSize: 29, lineHeight: 1.3, color: C.ink2 }, c.title),
    ]),
    h({ position: 'absolute', right: 0, top: 0, width: 500, height: H }, [
      img(dotsSvg(500, H), 500, H, { position: 'absolute', left: 0, top: 0 }),
      h(
        {
          position: 'absolute',
          left: 60,
          top: 120,
          width: 380,
          flexDirection: 'column',
          padding: '16px 18px 10px',
          borderRadius: 14,
          background: C.paper,
          border: `2px solid ${C.violet}`,
          boxShadow: '0 30px 60px -30px rgba(40,24,110,0.38)',
        },
        [h(mono(16, C.ink3, { paddingBottom: 10, letterSpacing: '0.06em' }), c.example ? 'NAVIGATOR · METHOD' : 'NAVIGATOR · STACK'), ...rows],
      ),
    ]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown webflow case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
