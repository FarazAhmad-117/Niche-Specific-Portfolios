/**
 * Build-time Open Graph images for the apps niche: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so these never print a number that is
 * not verified, and never a TODO. Home shows the shape of the method; a case shows its
 * name, its one-line angle and the main path of its (simplified) architecture.
 * Connectors are drawn as boxes, not arrow glyphs (the latin subsets have no arrows).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/apps/site';
import { markSvg } from './brand-mark';
import { CASES, type AppCase, type CaseSlug } from '../../data/apps/cases';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  paper: '#f3f1ea',
  paper2: '#fbfaf6',
  line: '#d8d3c4',
  grid: '#e6e2d6',
  ink: '#141821',
  ink2: '#3b4252',
  blue: '#1e3fb8',
  navy: '#15171b',
  navyLine: '#454a53',
  navyText: '#eef0f2',
  navyText2: '#c0c4cb',
  navyBlue: '#8ea8ff',
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

/** The brand mark (same SVG as the favicon), set beside the signature. */
const mark = (size: number): El => ({
  type: 'img',
  props: { src: `data:image/svg+xml;base64,${Buffer.from(markSvg(size)).toString('base64')}`, width: size, height: size, style: { alignSelf: 'center' } },
});

const fontDir = path.resolve(process.cwd(), 'src/assets/fonts/og');
const load = (file: string) => readFileSync(path.join(fontDir, file));
let fontCache: Parameters<typeof satori>[1]['fonts'] | undefined;
function fonts() {
  fontCache ??= [
    { name: 'Mona Sans', data: load('MonaSans-ExtraBold.woff'), weight: 800, style: 'normal' },
    { name: 'IBM Plex Sans', data: load('IBMPlexSans-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'IBM Plex Mono', data: load('IBMPlexMono-Regular.woff'), weight: 400, style: 'normal' },
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
  ];
  return fontCache;
}

const mono = (size: number, color: string, extra: Style = {}): Style => ({
  fontFamily: 'IBM Plex Mono',
  fontSize: size,
  color,
  letterSpacing: '0.04em',
  ...extra,
});

/** A blueprint grid: hairlines every 30px, darker every 150px. */
function grid(color: string, major: string): El[] {
  const out: El[] = [];
  for (let x = 0; x <= W; x += 30) {
    out.push(h({ position: 'absolute', left: x, top: 0, width: 1, height: H, background: x % 150 === 0 ? major : color }));
  }
  for (let y = 0; y <= H; y += 30) {
    out.push(h({ position: 'absolute', left: 0, top: y, width: W, height: 1, background: y % 150 === 0 ? major : color }));
  }
  return out;
}

/** Inner drawing border with a title block in the bottom-right corner. */
function frame(stroke: string, text: string, rows: [string, string][]): El[] {
  return [
    h({ position: 'absolute', left: 24, top: 24, width: W - 48, height: H - 48, border: `2px solid ${stroke}` }),
    h(
      {
        position: 'absolute',
        right: 24,
        bottom: 24,
        flexDirection: 'column',
        borderLeft: `2px solid ${stroke}`,
        borderTop: `2px solid ${stroke}`,
      },
      rows.map(([k, v], i) =>
        h(
          {
            width: 330,
            padding: '8px 14px',
            borderTop: i ? `1px solid ${stroke}` : 'none',
            justifyContent: 'space-between',
          },
          [h(mono(14, text, { textTransform: 'uppercase' }), k), h(mono(14, text), v)],
        ),
      ),
    ),
  ];
}

const node = (label: string, accent: boolean, dark: boolean): El =>
  h(
    {
      padding: '12px 18px',
      border: `2px solid ${accent ? (dark ? C.navyBlue : C.blue) : dark ? C.navyLine : C.ink}`,
      background: accent ? (dark ? C.navyBlue : C.blue) : dark ? '#1b1e23' : C.paper2,
      color: accent ? (dark ? C.navy : '#ffffff') : dark ? C.navyText : C.ink,
      fontFamily: 'IBM Plex Sans',
      fontSize: 22,
    },
    label,
  );
const wire = (dark: boolean): El => h({ width: 2, height: 22, marginLeft: 26, background: dark ? C.navyBlue : C.blue });

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    ...grid(C.grid, C.line),
    ...frame(C.ink, C.ink2, [
      ['Drawn by', PERSON_NAME],
      ['Sheet', 'App development'],
    ]),
    h(mono(18, C.ink2, { position: 'absolute', left: M, top: M - 8 }), 'APPS.FARAZAHMAD.DEV'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 140,
        width: 660,
        flexDirection: 'column',
        fontFamily: 'Mona Sans',
        fontWeight: 800,
        fontSize: 84,
        lineHeight: 0.98,
        letterSpacing: '-0.03em',
        color: C.ink,
      },
      [h({}, 'Products that'), h({}, 'ship — and keep'), h({ color: C.blue }, 'shipping.')],
    ),
    h({ position: 'absolute', right: 110, top: 96, flexDirection: 'column', alignItems: 'flex-start' }, [
      node('Sketch', false, false),
      wire(false),
      node('Schema', false, false),
      wire(false),
      node('Architecture', false, false),
      wire(false),
      node('Shipped', true, false),
    ]),
    h({ position: 'absolute', left: M, bottom: M - 6, alignItems: 'baseline', gap: 20 }, [
      mark(40),
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
      h(mono(20, C.ink2), 'MVPs · SaaS · APIs'),
    ]),
  ]);
}

/** A case: dark blueprint sheet, name, angle, and the first row of its architecture. */
function caseTree(c: AppCase): El {
  const main = c.diagram.nodes.filter((n) => n.row === c.diagram.nodes[0]?.row).slice(0, 4);
  const picked = c.ogPath?.map((id) => c.diagram.nodes.find((n) => n.id === id)).filter((n) => n !== undefined);
  const path = picked?.length ? picked : main.length >= 3 ? main : c.diagram.nodes.slice(0, 4);
  return h({ width: W, height: H, background: C.navy, position: 'relative' }, [
    ...grid('#1a1c20', '#22252a'),
    ...frame(C.navyLine, C.navyText2, [
      ['Case study', c.name],
      ['Drawn by', PERSON_NAME],
    ]),
    h(mono(18, C.navyText2, { position: 'absolute', left: M, top: M - 8 }), c.kicker.toUpperCase()),
    h({ position: 'absolute', left: M, top: 130, width: 640, flexDirection: 'column', gap: 24 }, [
      h(
        {
          fontFamily: 'Mona Sans',
          fontWeight: 800,
          fontSize: c.name.length > 13 ? 76 : 96,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: C.navyText,
        },
        c.name,
      ),
      h({ fontFamily: 'IBM Plex Sans', fontSize: 32, lineHeight: 1.3, color: C.navyText2 }, c.title),
    ]),
    h(
      { position: 'absolute', right: 110, top: 100, flexDirection: 'column', alignItems: 'flex-start' },
      path.flatMap((n, i) => (i ? [wire(true), node(n.label, i === path.length - 1, true)] : [node(n.label, false, true)])),
    ),
    h({ position: 'absolute', left: M, bottom: M - 6, alignItems: 'baseline', gap: 20 }, [
      mark(40),
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.navyText, letterSpacing: '-0.02em' }, PERSON_NAME),
      h(mono(20, C.navyText2), 'App development'),
    ]),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown apps case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
