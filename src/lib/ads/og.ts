/**
 * Build-time Open Graph images for the ads niche: satori renders an element tree to SVG, resvg
 * rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a result. The home card
 * shows rule syntax (what the automation does), a case card shows its flow, and the chart is a
 * shape with no axis values.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { nicheHost } from '../../niches';
import { PERSON_NAME } from '../../data/ads/site';
import { CASES, type AdsCase, type CaseSlug } from '../../data/ads/cases';
import { RULES } from '../../data/ads/rules';
import { fitSignatureRow } from '../shared/og-fit';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  bg: '#141414',
  panel: '#1f1f1e',
  line: '#33332f',
  text: '#efefe9',
  text2: '#b0b0aa',
  amber: '#ffb020',
  amberText: '#ffbf47',
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
    { name: 'Clash Grotesk', data: load('ClashGrotesk-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'Inter Tight', data: load('InterTight-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: load('JetBrainsMono-Regular.woff'), weight: 400, style: 'normal' },
  ];
  return fontCache;
}

/** The OG fonts are latin subsets: replace the few symbols they may not carry. */
const plain = (s: string): string =>
  s.replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/×/g, 'x').replace(/−/g, '-').replace(/ → /g, ' to ').replace(/’/g, "'");

const mono = (size: number, color: string, extra: Style = {}): Style => ({
  fontFamily: 'JetBrains Mono',
  fontSize: size,
  color,
  ...extra,
});

/** A shape-only spend curve meeting a dashed threshold and flattening: no values, no axis. */
function curveSvg(width: number, height: number): string {
  const t = height * 0.32;
  const pts = [
    [0, height * 0.92],
    [width * 0.16, height * 0.78],
    [width * 0.3, height * 0.83],
    [width * 0.46, height * 0.55],
    [width * 0.6, t],
    [width, t],
  ];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x!.toFixed(1)} ${y!.toFixed(1)}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="M0 ${t}H${width}" stroke="${C.text2}" stroke-opacity="0.6" stroke-width="2" stroke-dasharray="8 8"/><path d="${d}" fill="none" stroke="${C.amber}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${width * 0.6}" cy="${t}" r="9" fill="${C.amber}" stroke="${C.bg}" stroke-width="4"/></svg>`;
}

const chip = (text: string, fill = false): El =>
  h(
    {
      padding: '4px 10px',
      borderRadius: 4,
      background: fill ? C.amber : '#2c2c2a',
      color: fill ? C.bg : C.text,
      fontFamily: 'JetBrains Mono',
      fontSize: 17,
    },
    plain(text),
  );
const kw = (text: string): El => h(mono(15, C.amberText, { letterSpacing: '0.08em', marginRight: 2 }), text);

function ruleRow(r: { if: string; for?: string; then: string }, n: number): El {
  return h({ alignItems: 'center', flexWrap: 'wrap', gap: 8, minHeight: 58, padding: '9px 0', borderTop: `1px solid ${C.line}` }, [
    h(mono(15, C.text2, { width: 30 }), String(n).padStart(2, '0')),
    kw('IF'),
    chip(r.if),
    ...(r.for ? [kw('FOR'), chip(r.for)] : []),
    kw('THEN'),
    chip(r.then, true),
  ]);
}

function panel(title: string, body: El[], width: number): El {
  return h(
    {
      flexDirection: 'column',
      width,
      padding: '20px 24px 8px',
      borderRadius: 16,
      background: C.panel,
      border: `1px solid ${C.line}`,
    },
    [h(mono(16, C.text2, { letterSpacing: '0.08em', marginBottom: 12 }), title), ...body],
  );
}

const FOOTER_TAGLINE = 'Paid ads automation';
/** Room from the name's left edge to the right margin. A long name drops the tagline first (see ../shared/og-fit). */
const FOOTER_BUDGET = W - 2 * M;
const footer = (): El => {
  const fit = fitSignatureRow({ name: PERSON_NAME, namePx: 40, tagline: FOOTER_TAGLINE, taglinePx: 21, gap: 20, budget: FOOTER_BUDGET });
  return h({ position: 'absolute', left: M, bottom: M - 18, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: fit.namePx, color: C.text, letterSpacing: '-0.02em' }, PERSON_NAME),
    ...(fit.showTagline ? [h(mono(21, C.text2), FOOTER_TAGLINE)] : []),
  ]);
};

function homeTree(): El {
  return h({ width: W, height: H, background: C.bg, position: 'relative' }, [
    h(mono(21, C.text2, { position: 'absolute', left: M, top: M - 18 }), nicheHost('ads')),
    img(curveSvg(470, 120), 470, 120, { position: 'absolute', left: M, top: 380 }),
    h(
      {
        position: 'absolute',
        left: M,
        top: 128,
        width: 560,
        flexDirection: 'column',
        fontFamily: 'Clash Grotesk',
        fontWeight: 600,
        fontSize: 82,
        lineHeight: 0.98,
        letterSpacing: '-0.035em',
        color: C.text,
      },
      [h({}, 'Ads that watch'), h({ color: C.amberText }, 'their own budget.')],
    ),
    h({ position: 'absolute', right: M - 10, top: 118 }, [
      panel('EXAMPLE RULES', RULES.map((r, i) => ruleRow(r, i + 1)), 470),
    ]),
    footer(),
  ]);
}

/** A case: its name, its one-line angle, and its flow (or its rules). */
function caseTree(c: AdsCase): El {
  const body: El[] = c.example
    ? c.built.slice(0, 4).map((b, i) => (b.rule ? ruleRow(b.rule, i + 1) : h({}, '')))
    : c.flow.map((s, i) =>
        h({ alignItems: 'center', gap: 14, height: 54, borderTop: `1px solid ${C.line}` }, [
          h(mono(15, C.text2, { width: 30 }), String(i + 1).padStart(2, '0')),
          h({ width: 10, height: 10, borderRadius: 5, background: s.todo ? C.text2 : C.amber }),
          h({ fontFamily: 'Inter Tight', fontSize: 20, color: s.todo ? C.text2 : C.text }, plain(s.todo ? `${s.label} (next)` : s.label)),
        ]),
      );
  return h({ width: W, height: H, background: C.bg, position: 'relative' }, [
    h(
      mono(20, c.example ? C.text2 : C.amberText, { position: 'absolute', left: M, top: M - 18, letterSpacing: '0.08em' }),
      c.example ? 'EXAMPLE TEARDOWN · ILLUSTRATIVE' : 'CASE STUDY',
    ),
    h(mono(20, C.text2, { position: 'absolute', right: M, top: M - 18 }), nicheHost('ads')),
    h({ position: 'absolute', left: M, top: 140, width: 560, flexDirection: 'column', gap: 24 }, [
      h(
        {
          fontFamily: 'Clash Grotesk',
          fontWeight: 600,
          fontSize: c.name.length > 30 ? 54 : 62,
          lineHeight: 1,
          letterSpacing: '-0.035em',
          color: C.text,
        },
        plain(c.name),
      ),
      h({ fontFamily: 'Inter Tight', fontSize: 27, lineHeight: 1.3, color: C.text2 }, plain(c.title)),
    ]),
    h({ position: 'absolute', right: M - 10, top: 112 }, [panel(c.example ? 'THE RULES' : 'THE LEAD RECORD, IN ORDER', body, 470)]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown ads case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
