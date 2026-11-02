/**
 * Build-time Open Graph images (spec §8.1): satori renders an element tree to
 * SVG, resvg rasterises it to a 1200×630 PNG. Runs only at build; nothing here
 * ships to the browser.
 *
 * Honesty rule: an OG image is cached by social networks, so it never prints a
 * placeholder, a number we do not have, or a "live" lime marker on a case we
 * have not confirmed is live.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CASES, type CaseStudy } from '../../data/ai/cases';
import { PERSON_NAME } from '../../data/ai/site';
import { fanOutOf } from '../../data/ai/content';
import { textOf } from '../../data/ai/todo';

const W = 1200;
const H = 630;
const MARGIN = 80;
const COLS = 12;
const CROSS_INSET = 44;

const C = {
  ink: '#111110',
  hair: '#2c2c2a',
  line: '#787670',
  text: '#f2f1ec',
  text2: '#b8b6ad',
  text3: '#8f8d85',
  lime: '#D4FF3A',
} as const;

type Style = Record<string, string | number>;
type Child = El | string;
interface El {
  type: string;
  props: { style: Style; children?: Child | Child[] };
}
const h = (style: Style, children?: Child | Child[]): El => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

const fontDir = path.resolve(process.cwd(), 'src/assets/fonts/og');
const load = (file: string) => readFileSync(path.join(fontDir, file));

let fontCache: Parameters<typeof satori>[1]['fonts'] | undefined;
function fonts() {
  fontCache ??= [
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'Geist', data: load('Geist-Regular.woff'), weight: 400, style: 'normal' },
    { name: 'Geist', data: load('Geist-SemiBold.woff'), weight: 600, style: 'normal' },
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

/** Hairline grid with registration crosshairs at four intersections. */
function frameGrid(): El[] {
  const step = (W - MARGIN * 2) / COLS;
  const lines = Array.from({ length: COLS + 1 }, (_, i) =>
    h({ position: 'absolute', left: Math.round(MARGIN + i * step), top: 0, width: 1, height: H, background: C.hair }),
  );
  const cross = (x: number, y: number): El[] => [
    h({ position: 'absolute', left: x - 8, top: y, width: 17, height: 1, background: C.line }),
    h({ position: 'absolute', left: x, top: y - 8, width: 1, height: 17, background: C.line }),
  ];
  return [
    ...lines,
    // Outside the 80px text safe zone, so a crosshair never touches a glyph.
    ...cross(MARGIN, CROSS_INSET),
    ...cross(W - MARGIN, CROSS_INSET),
    ...cross(MARGIN, H - CROSS_INSET),
    ...cross(W - MARGIN, H - CROSS_INSET),
  ];
}

const signature = (): El =>
  h({ position: 'absolute', left: MARGIN, bottom: MARGIN, alignItems: 'baseline', gap: 20 }, [
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.text, letterSpacing: '-0.02em' }, PERSON_NAME),
    h(mono(22, C.text2), 'Book a scoping call'),
  ]);

/** Vertical five-step schematic. Lime marks only the last node and one packet. */
function homeSchematic(): El {
  const steps = ['trigger', 'enrich', 'classify', 'route', 'notify'];
  const parts: El[] = [];
  steps.forEach((label, i) => {
    const last = i === steps.length - 1;
    parts.push(
      h(
        {
          width: 280,
          height: 44,
          border: `1px solid ${C.line}`,
          background: C.ink,
          alignItems: 'center',
          paddingLeft: 16,
          gap: 12,
        },
        [
          ...(last ? [h({ width: 10, height: 10, borderRadius: 5, background: C.lime })] : []),
          h(mono(18, C.text), label),
          ...(last ? [h(mono(18, C.text2, { marginLeft: 'auto', paddingRight: 16 }), 'running')] : []),
        ],
      ),
    );
    if (!last) {
      const isLastEdge = i === steps.length - 2;
      parts.push(
        h({ width: 1, height: 38, background: C.line, alignSelf: 'center', position: 'relative' }, [
          ...(isLastEdge ? [h({ position: 'absolute', left: -4, top: 15, width: 9, height: 9, background: C.lime })] : []),
        ]),
      );
    }
  });
  return h({ position: 'absolute', right: MARGIN, top: 140, flexDirection: 'column' }, parts);
}

/**
 * The case's real flow as a vertical schematic, labelled from verified node text only
 * (textOf drops samples and TODOs). Trailing fan-out nodes sit side by side. No numbering.
 * Lime appears only on a confirmed-live case: the last node's dot.
 */
function caseSchematic(c: CaseStudy): El {
  const labels = c.diagram.nodes.map((n) => textOf(n.label)).filter((t): t is string => Boolean(t));
  const fan = Math.min(fanOutOf(c), labels.length - 1);
  const chain = fan > 1 ? labels.slice(0, labels.length - fan) : labels;
  const branch = fan > 1 ? labels.slice(labels.length - fan) : [];
  const rows = chain.length + (branch.length ? 1 : 0);
  const nodeH = rows > 5 ? 40 : 44;
  const wire = rows > 5 ? 16 : 22;
  const width = 300;
  const node = (label: string, w: number, live: boolean): El =>
    h(
      {
        width: w,
        height: nodeH,
        boxSizing: 'border-box',
        border: `1px solid ${live ? C.lime : C.line}`,
        background: C.ink,
        alignItems: 'center',
        paddingLeft: 14,
        paddingRight: 12,
        gap: 10,
      },
      [
        ...(live ? [h({ width: 9, height: 9, borderRadius: 5, background: C.lime })] : []),
        h(mono(label.length > 20 ? 15 : 17, C.text), label),
      ],
    );
  const link = (): El => h({ width: 1, height: wire, background: C.line, alignSelf: 'center' });
  const parts: El[] = [];
  chain.forEach((label, i) => {
    if (i > 0) parts.push(link());
    parts.push(node(label, width, c.inProduction && !branch.length && i === chain.length - 1));
  });
  if (branch.length) {
    parts.push(link());
    const w = Math.floor((width - 12 * (branch.length - 1)) / branch.length);
    parts.push(h({ gap: 12 }, branch.map((label) => node(label, w, false))));
  }
  return h({ position: 'absolute', right: MARGIN, top: 140, flexDirection: 'column' }, parts);
}

function homeTree(): El {
  return h({ width: W, height: H, background: C.ink, position: 'relative' }, [
    ...frameGrid(),
    h(mono(22, C.text3, { position: 'absolute', left: MARGIN, top: MARGIN - 4 }), 'ai.farazahmad.dev'),
    h(
      {
        position: 'absolute',
        left: MARGIN,
        top: 140,
        width: 693,
        fontFamily: 'Clash Display',
        fontWeight: 600,
        fontSize: 84,
        lineHeight: 0.98,
        letterSpacing: '-0.03em',
        color: C.text,
      },
      'AI automations that survive production.',
    ),
    homeSchematic(),
    signature(),
  ]);
}

function caseTree(c: CaseStudy): El {
  return h({ width: W, height: H, background: C.ink, position: 'relative' }, [
    ...frameGrid(),
    h(mono(22, C.text3, { position: 'absolute', left: MARGIN, top: MARGIN - 4, letterSpacing: '0.06em' }), c.og.eyebrow),
    h(mono(22, C.text3, { position: 'absolute', right: MARGIN, top: MARGIN - 4 }), 'ai.farazahmad.dev'),
    h({ position: 'absolute', left: MARGIN, top: 140, width: 660, flexDirection: 'column', gap: 28 }, [
      h(
        {
          fontFamily: 'Clash Display',
          fontWeight: 600,
          fontSize: 96,
          lineHeight: 0.98,
          letterSpacing: '-0.03em',
          color: C.text,
        },
        c.name,
      ),
      h({ fontFamily: 'Geist', fontWeight: 400, fontSize: 32, lineHeight: 1.3, color: C.text2 }, c.og.line),
    ]),
    caseSchematic(c),
    signature(),
  ]);
}

export type OgTarget = 'home' | (typeof CASES)[number]['slug'];

export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.slug)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const tree = target === 'home' ? homeTree() : caseTree(requireCase(target));
  const svg = await satori(tree as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}

function requireCase(slug: string): CaseStudy {
  const c = CASES.find((x) => x.slug === slug);
  if (!c) throw new Error(`[og] unknown case: ${slug}`);
  return c;
}
