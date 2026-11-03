/**
 * Build-time Open Graph images for the shopify niche: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. The home image shows an EXAMPLE app audit (labelled), a case shows its steps, never a
 * result.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/shopify/site';
import { CASES, type CaseSlug, type ShopifyCase } from '../../data/shopify/cases';
import { HERO_RECEIPT, VERDICT_LABEL } from '../../data/shopify/content';
import { markSvg } from './brand-mark';

const W = 1200;
const H = 630;
const M = 80;

const C = {
  paper: '#f6f1e9',
  paper2: '#ece4d6',
  card: '#fcfaf6',
  line: '#e0d5c4',
  dots: '#988470',
  ink: '#1f1712',
  ink2: '#4f4239',
  clay: '#b4441f',
  clayText: '#a83a17',
  onClay: '#fff8f2',
  warnBg: '#f4e2bf',
  warn: '#85500c',
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
    { name: 'Gambetta', data: load('Gambetta-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'General Sans', data: load('GeneralSans-Medium.woff'), weight: 500, style: 'normal' },
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

/** A torn receipt edge: a row of triangles in the receipt colour. Shapes only. */
function tornEdge(width: number): string {
  const zz = 14;
  const n = Math.ceil(width / zz);
  const pts = Array.from({ length: n }, (_, i) => `${i * zz},0 ${i * zz + zz / 2},8 ${(i + 1) * zz},0`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="8" viewBox="0 0 ${width} 8"><polygon points="0,0 ${pts} ${width},0" fill="${C.card}"/></svg>`;
}

const VERDICT_STYLE = {
  keep: { background: C.paper2, color: C.ink2 },
  replace: { background: C.clay, color: C.onClay },
  remove: { background: C.ink, color: C.paper },
  defer: { background: C.warnBg, color: C.warn },
} as const;

/** A receipt: a title row, then rows with a dotted leader and a right-hand value. */
function receipt(title: string, rows: readonly { label: string; right: El | string }[], width: number, rowH = 54): El {
  return h({ flexDirection: 'column', width }, [
    h(
      {
        flexDirection: 'column',
        width,
        boxSizing: 'border-box',
        padding: '24px 28px 14px',
        background: C.card,
        borderRadius: '16px 16px 0 0',
      },
      [
        h({ justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `2px dashed ${C.line}` }, [
          h(mono(17, C.ink2, { letterSpacing: '0.08em' }), title),
          h({ width: 12, height: 12, borderRadius: 6, background: '#d9532b' }),
        ]),
        ...rows.map((r) =>
          h({ height: rowH, alignItems: 'center', gap: 12 }, [
            h({ fontFamily: 'General Sans', fontSize: 22, color: C.ink, flexShrink: 0 }, r.label),
            h({ flex: 1, height: 2, marginTop: 10, borderBottom: `3px dotted ${C.dots}` }),
            typeof r.right === 'string' ? h(mono(17, C.ink2, { flexShrink: 0 }), r.right) : r.right,
          ]),
        ),
      ],
    ),
    img(tornEdge(width), width, 8),
  ]);
}

const verdictTag = (v: keyof typeof VERDICT_STYLE): El =>
  h(
    mono(15, VERDICT_STYLE[v].color, {
      flexShrink: 0,
      padding: '4px 12px',
      borderRadius: 4,
      background: VERDICT_STYLE[v].background,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }),
    VERDICT_LABEL[v],
  );

const topBar = (left: string, leftColor: string = C.ink2): El =>
  h({ position: 'absolute', left: M, right: M, top: M - 26, justifyContent: 'space-between', alignItems: 'center' }, [
    h({ alignItems: 'center', gap: 16 }, [img(markSvg(44), 44, 44), h(mono(20, leftColor, { letterSpacing: '0.06em' }), left)]),
    h(mono(20, C.ink2), 'shopify.farazahmad.dev'),
  ]);

const footer = (): El =>
  h({ position: 'absolute', left: M, bottom: M - 20, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    h(mono(22, C.ink2), 'Shopify developer'),
  ]);

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    topBar('SPEED · THEMES · SYNC'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 150,
        width: 600,
        flexDirection: 'column',
        fontFamily: 'Gambetta',
        fontWeight: 600,
        fontSize: 80,
        lineHeight: 1,
        letterSpacing: '-0.025em',
        color: C.ink,
      },
      [h({}, 'A faster'), h({}, 'Shopify store'), h({}, 'with'), h({ color: C.clayText }, 'fewer apps.')],
    ),
    h({ position: 'absolute', right: M - 10, top: 128 }, [
      receipt(
        'EXAMPLE APP AUDIT',
        HERO_RECEIPT.map((r) => ({ label: r.app, right: verdictTag(r.verdict) })),
        450,
        52,
      ),
    ]),
    footer(),
  ]);
}

/** A case: its name, its one-line angle, and its flow as a receipt of steps. */
function caseTree(c: ShopifyCase): El {
  const rows = c.flow.map((s, i) => ({ label: s, right: String(i + 1).padStart(2, '0') }));
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    topBar(c.example ? 'EXAMPLE TEARDOWN · ILLUSTRATIVE' : 'CASE STUDY', c.example ? C.ink2 : C.clayText),
    h({ position: 'absolute', left: M, top: 160, width: 560, flexDirection: 'column', gap: 26 }, [
      h(
        {
          fontFamily: 'Gambetta',
          fontWeight: 600,
          fontSize: c.name.length > 22 ? 58 : 72,
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          color: C.ink,
        },
        c.name,
      ),
      h({ fontFamily: 'General Sans', fontSize: 28, lineHeight: 1.3, color: C.ink2 }, c.title),
    ]),
    h({ position: 'absolute', right: M - 10, top: 128 }, [receipt(c.example ? 'THE METHOD' : 'THE FLOW', rows, 460, rows.length > 5 ? 50 : 58)]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown shopify case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
