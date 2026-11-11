/**
 * Build-time Open Graph images for the shopify niche: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. The home image shows an EXAMPLE launch checklist (labelled), a case shows its steps, never a
 * result.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/shopify/site';
import { fitSignatureRow } from '../shared/og-fit';
import { ALL_CASES, type CaseSlug, type ShopifyCase } from '../../data/shopify/cases';
import { HERO_RECEIPT, VERDICT_LABEL } from '../../data/shopify/content';
import { markSvg } from './brand-mark';
import { nicheHost } from '../../niches';

const W = 1200;
const H = 630;
const M = 80;

const C = {
  paper: '#f1f1f1',
  paper2: '#ebebeb',
  card: '#ffffff',
  line: '#e3e3e3',
  dots: '#e3e3e3',
  ink: '#1a1a1a',
  ink2: '#4a4a4a',
  clay: '#b4441f',
  clayText: '#a83a17',
  onClay: '#fff8f2',
  warnBg: '#fff1c2',
  warn: '#7d5a00',
  claySoft: '#fbe4da',
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
    { name: 'General Sans', data: load('GeneralSans-Semibold.woff'), weight: 600, style: 'normal' },
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

const VERDICT_STYLE = {
  done: { background: C.claySoft, color: C.clayText },
  passed: { background: C.claySoft, color: C.clayText },
  submitted: { background: C.paper2, color: C.ink2 },
  connected: { background: C.ink, color: C.card },
} as const;

/** An admin panel: a title row, then rows separated by hairlines with a right-hand value. */
function receipt(title: string, rows: readonly { label: string; right: El | string }[], width: number, rowH = 54): El {
  return h(
    {
      flexDirection: 'column',
      width,
      boxSizing: 'border-box',
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 14,
      boxShadow: '0 10px 30px -12px rgba(26,26,26,0.18)',
    },
    [
      h({ justifyContent: 'space-between', alignItems: 'center', padding: '20px 26px', borderBottom: `1px solid ${C.line}` }, [
        h({ fontFamily: 'General Sans', fontWeight: 600, fontSize: 22, color: C.ink }, title),
        h({ width: 12, height: 12, borderRadius: 6, background: '#d9532b' }),
      ]),
      ...rows.map((r, i) =>
        h(
          {
            height: rowH,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '0 26px',
            borderBottom: i < rows.length - 1 ? `1px solid ${C.line}` : 'none',
          },
          [
            h({ fontFamily: 'General Sans', fontSize: 21, color: C.ink, flexShrink: 0 }, r.label),
            typeof r.right === 'string' ? h(mono(17, C.ink2, { flexShrink: 0 }), r.right) : r.right,
          ],
        ),
      ),
    ],
  );
}

const verdictTag = (v: keyof typeof VERDICT_STYLE): El =>
  h(
    {
      flexShrink: 0,
      padding: '4px 14px',
      borderRadius: 8,
      background: VERDICT_STYLE[v].background,
      color: VERDICT_STYLE[v].color,
      fontFamily: 'General Sans',
      fontWeight: 600,
      fontSize: 17,
    },
    VERDICT_LABEL[v],
  );
const topBar = (left: string, leftColor: string = C.ink2): El =>
  h({ position: 'absolute', left: M, right: M, top: M - 26, justifyContent: 'space-between', alignItems: 'center' }, [
    h({ alignItems: 'center', gap: 16 }, [img(markSvg(44), 44, 44), h(mono(20, leftColor, { letterSpacing: '0.06em' }), left)]),
    h(mono(20, C.ink2), nicheHost('shopify')),
  ]);

const FOOTER_TAGLINE = 'Shopify developer';
/** Room from the name's left edge to the right margin. A long name drops the tagline first (see ../shared/og-fit). */
const FOOTER_BUDGET = W - 2 * M;
const footer = (): El => {
  const fit = fitSignatureRow({ name: PERSON_NAME, namePx: 40, tagline: FOOTER_TAGLINE, taglinePx: 22, gap: 20, budget: FOOTER_BUDGET });
  return h({ position: 'absolute', left: M, bottom: M - 20, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: fit.namePx, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    ...(fit.showTagline ? [h(mono(22, C.ink2), FOOTER_TAGLINE)] : []),
  ]);
};

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    topBar('LAUNCH · SEARCH · SALES'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 150,
        width: 600,
        flexDirection: 'column',
        fontFamily: 'General Sans',
        fontWeight: 600,
        fontSize: 80,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        color: C.ink,
      },
      [h({}, 'A Shopify'), h({}, 'store, live'), h({}, 'in weeks,'), h({ color: C.clayText }, 'built to sell.')],
    ),
    h({ position: 'absolute', right: M - 10, top: 128 }, [
      receipt(
        'Launch · example store',
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
    topBar(c.example ? 'EXAMPLE · ILLUSTRATIVE' : c.confidential ? 'CLIENT BUILD · CASE STUDY' : 'CASE STUDY', c.example ? C.ink2 : C.clayText),
    h({ position: 'absolute', left: M, top: 160, width: 560, flexDirection: 'column', gap: 26 }, [
      h(
        {
          fontFamily: 'General Sans',
          fontWeight: 600,
          fontSize: c.name.length > 22 ? 58 : 72,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          color: C.ink,
        },
        c.name,
      ),
      h({ fontFamily: 'General Sans', fontSize: 28, lineHeight: 1.3, color: C.ink2 }, c.title),
    ]),
    h({ position: 'absolute', right: M - 10, top: 128 }, [receipt(c.example ? 'The method' : 'The flow', rows, 460, rows.length > 5 ? 50 : 58)]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...ALL_CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : ALL_CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown shopify case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
