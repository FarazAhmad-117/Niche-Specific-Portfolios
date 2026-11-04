/**
 * Build-time Open Graph images for the ghl niche: satori renders an element tree to SVG, resvg
 * rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. The panel shows the real pipeline's steps (or a case's flow), not a result.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/ghl/site';
import { fitSignatureRow } from '../shared/og-fit';
import { ALL_CASES, type CaseSlug, type GhlCase } from '../../data/ghl/cases';
import { HERO_PORTS } from '../../data/ghl/content';
import { nicheHost } from '../../niches';

const W = 1200;
const H = 630;
const M = 80;

const C = {
  paper: '#f4f2ec',
  paper2: '#e9e6dd',
  card: '#fbfaf7',
  line: '#d9d4c8',
  ink: '#121211',
  ink2: '#45433e',
  teal: '#0b6e68',
  tealText: '#0a5f5a',
  tealLed: '#2cc9b5',
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
    { name: 'Saira Expanded', data: load('SairaExpanded-ExtraBold.ttf'), weight: 800, style: 'normal' },
    { name: 'Red Hat Text', data: load('RedHatText-Medium.woff'), weight: 500, style: 'normal' },
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

const DEFAULT_ROW_H = 62;

/**
 * A rack of ports: a teal bus down the left, one branch and jack per row. Drawn as one SVG
 * (shapes only, no text) behind the row labels.
 */
function busSvg(rows: number, width: number, ROW_H: number): string {
  const busX = 22;
  const top = ROW_H / 2;
  const bottom = top + (rows - 1) * ROW_H;
  const branches = Array.from({ length: rows }, (_, i) => {
    const y = top + i * ROW_H;
    return `<path d="M${busX} ${y}H${busX + 26}" stroke="${C.teal}" stroke-width="3" stroke-linecap="round"/><circle cx="${busX + 34}" cy="${y}" r="7" fill="${C.card}" stroke="${C.teal}" stroke-width="3"/><circle cx="${width - 26}" cy="${y}" r="5" fill="${C.tealLed}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${rows * ROW_H}" viewBox="0 0 ${width} ${rows * ROW_H}"><path d="M${busX} 0V${bottom}" stroke="${C.teal}" stroke-width="3" stroke-linecap="round"/>${branches}</svg>`;
}

/** labelW: the label column (wide for word labels, narrow for step numbers); rowH: row pitch. */
function panel(title: string, rows: readonly { label: string; value: string }[], width: number, labelW = 130, ROW_H = DEFAULT_ROW_H): El {
  return h(
    {
      flexDirection: 'column',
      width,
      padding: '22px 24px 18px',
      borderRadius: 18,
      background: C.card,
      border: `1px solid ${C.line}`,
      boxShadow: '0 26px 50px -26px rgba(30,40,38,0.4)',
    },
    [
      h({ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, [
        h(mono(17, C.ink2, { letterSpacing: '0.06em' }), title),
        h({ width: 12, height: 12, borderRadius: 6, background: C.tealLed }),
      ]),
      h({ position: 'relative', flexDirection: 'column', width: width - 48 }, [
        img(busSvg(rows.length, width - 48, ROW_H), width - 48, rows.length * ROW_H, { position: 'absolute', left: 0, top: 0 }),
        ...rows.map((r) =>
          h({ height: ROW_H, alignItems: 'center', paddingLeft: 78, gap: 14 }, [
            h(mono(16, C.ink2, { textTransform: 'uppercase', letterSpacing: '0.06em', width: labelW, flexShrink: 0 }), r.label),
            h({ flex: 1, paddingRight: 26, fontFamily: 'Red Hat Text', fontSize: 21, lineHeight: 1.2, color: C.ink, textAlign: 'left' }, r.value),
          ]),
        ),
      ]),
    ],
  );
}

const FOOTER_TAGLINE = 'GoHighLevel developer';
/** Room from the name's left edge to the right margin. A long name drops the tagline first (see ../shared/og-fit). */
const FOOTER_BUDGET = W - 2 * M;
const footer = (): El => {
  const fit = fitSignatureRow({ name: PERSON_NAME, namePx: 40, tagline: FOOTER_TAGLINE, taglinePx: 22, gap: 20, budget: FOOTER_BUDGET });
  return h({ position: 'absolute', left: M, bottom: M - 14, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: fit.namePx, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    ...(fit.showTagline ? [h(mono(22, C.ink2), FOOTER_TAGLINE)] : []),
  ]);
};

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(mono(22, C.ink2, { position: 'absolute', left: M, top: M - 14 }), nicheHost('ghl')),
    h(
      {
        position: 'absolute',
        left: M,
        top: 158,
        width: 640,
        flexDirection: 'column',
        fontFamily: 'Saira Expanded',
        fontWeight: 800,
        fontSize: 70,
        lineHeight: 1,
        letterSpacing: '-0.045em',
        color: C.ink,
      },
      [h({}, 'GoHighLevel,'), h({}, 'built by a'), h({ color: C.tealText }, 'developer.')],
    ),
    h({ position: 'absolute', right: M - 10, top: 92 }, [
      panel(
        'LEAD IN · WEBSITE FORM',
        HERO_PORTS.map((p) => ({ label: p.label, value: p.value })),
        470,
        116,
      ),
    ]),
    footer(),
  ]);
}

/** A case: its name, its one-line angle, and its flow as a rack of ports. */
function caseTree(c: GhlCase): El {
  // Every step: the pipeline is incomplete without its last port.
  const rows = c.flow.slice(0, 6).map((s, i) => ({ label: String(i + 1).padStart(2, '0'), value: s }));
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(
      mono(22, c.example ? C.ink2 : C.tealText, { position: 'absolute', left: M, top: M - 14, letterSpacing: '0.06em' }),
      c.example ? 'EXAMPLE TEARDOWN · ILLUSTRATIVE' : c.confidential ? 'CASE STUDY · CONFIDENTIAL CLIENT' : 'CASE STUDY',
    ),
    h(mono(22, C.ink2, { position: 'absolute', right: M, top: M - 14 }), nicheHost('ghl')),
    // The panel starts near x=640 (its padding sits outside its width), so long generated names get a narrower column.
    h({ position: 'absolute', left: M, top: 150, width: c.generated ? 520 : 600, flexDirection: 'column', gap: 26 }, [
      h(
        {
          fontFamily: 'Saira Expanded',
          fontWeight: 800,
          fontSize: c.generated ? (c.name.length > 26 ? 40 : 46) : c.name.length > 22 ? 50 : 58,
          lineHeight: 1.02,
          letterSpacing: '-0.045em',
          color: C.ink,
        },
        // The OG fonts have no arrow glyph; satori would draw a missing-glyph box.
        c.name.replace(' → ', ' to '),
      ),
      h({ fontFamily: 'Red Hat Text', fontSize: c.generated ? 26 : 30, lineHeight: 1.3, color: C.ink2 }, c.title),
    ]),
    h({ position: 'absolute', right: M - 10, top: 112 }, [panel(c.example ? 'METHOD' : c.generated ? 'THE FLOW' : 'THE PIPELINE', rows, 440, 34, rows.length > 5 ? 54 : 62)]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...ALL_CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : ALL_CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown ghl case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
