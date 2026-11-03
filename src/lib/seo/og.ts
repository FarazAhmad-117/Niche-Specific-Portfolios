/**
 * Build-time Open Graph images for the seo niche: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so these never print a number we have not
 * measured. The home card shows an example search result (labelled), not a ranking or traffic.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/seo/site';
import { CASES, CASE_SLUGS, type CaseSlug } from '../../data/seo/cases';
import { MARK_SHAPES } from './brand-mark';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  paper: '#f5f5f0',
  paper2: '#ecece4',
  card: '#fbfbf8',
  line: '#dcdcd2',
  ink: '#121316',
  ink2: '#45474d',
  yellow: '#ffd60a',
  blue: '#1f45b8',
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
    { name: 'Schibsted Grotesk', data: load('SchibstedGrotesk-ExtraBold.woff'), weight: 800, style: 'normal' },
    { name: 'Instrument Sans', data: load('InstrumentSans-Medium.woff'), weight: 500, style: 'normal' },
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

/** The brand mark drawn with divs (satori has no <rect>). */
function mark(size: number): El {
  const s = size / 32;
  const bar = (r: { x: number; y: number; w: number; h: number }, bg: string): El =>
    h({ position: 'absolute', left: r.x * s, top: r.y * s, width: r.w * s, height: r.h * s, borderRadius: 1.5 * s, background: bg });
  return h({ position: 'relative', width: size, height: size, borderRadius: 7 * s, background: C.ink }, [
    ...MARK_SHAPES.lines.map((l) => bar(l, C.paper)),
    bar(MARK_SHAPES.mark, C.yellow),
  ]);
}

const signature = (tag: string): El =>
  h({ position: 'absolute', left: M, bottom: M - 14, alignItems: 'center', gap: 20 }, [
    mark(44),
    h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    h(mono(21, C.ink2), tag),
  ]);

function serpCard(): El {
  return h(
    {
      flexDirection: 'column',
      width: 440,
      padding: '26px 28px',
      borderRadius: 14,
      background: C.card,
      border: `1px solid ${C.line}`,
      gap: 10,
    },
    [
      h(mono(15, C.ink2, { letterSpacing: '0.08em' }), 'EXAMPLE RESULT'),
      h({ alignItems: 'center', gap: 12 }, [
        h({ width: 30, height: 30, borderRadius: 15, background: C.paper2, border: `1px solid ${C.line}` }),
        h({ flexDirection: 'column' }, [
          h({ fontFamily: 'Instrument Sans', fontSize: 18, color: C.ink }, 'Your Store'),
          h(mono(15, C.ink2), 'yourstore.com › trail › wide-fit'),
        ]),
      ]),
      h({ fontFamily: 'Instrument Sans', fontSize: 25, color: C.blue, lineHeight: 1.25 }, 'Trail running shoes for wide feet | Your Store'),
      h(
        { fontFamily: 'Instrument Sans', fontSize: 18, color: C.ink2, lineHeight: 1.45 },
        'Wide-fit trail shoes with a roomy toe box and grippy outsoles.',
      ),
      h({ gap: 8, marginTop: 4 }, [
        h({ padding: '4px 10px', borderRadius: 4, background: C.yellow, ...mono(15, C.ink) }, '<title>'),
        h({ padding: '4px 10px', borderRadius: 4, background: C.yellow, ...mono(15, C.ink) }, 'canonical'),
        h({ padding: '4px 10px', borderRadius: 4, background: C.yellow, ...mono(15, C.ink) }, 'JSON-LD'),
      ]),
    ],
  );
}

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(mono(22, C.ink2, { position: 'absolute', left: M, top: M - 8 }), 'seo.farazahmad.dev'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 130,
        width: 620,
        flexDirection: 'column',
        fontFamily: 'Schibsted Grotesk',
        fontWeight: 800,
        fontSize: 82,
        lineHeight: 0.98,
        letterSpacing: '-0.034em',
        color: C.ink,
      },
      [
        h({}, 'SEO'),
        h({ background: C.yellow, padding: '0 10px', marginLeft: -10, alignSelf: 'flex-start' }, 'built into'),
        h({ background: C.yellow, padding: '0 10px', marginLeft: -10, alignSelf: 'flex-start' }, 'your code,'),
        h({}, 'not bolted on.'),
      ],
    ),
    h({ position: 'absolute', right: M, top: 120 }, [serpCard()]),
    signature('Technical SEO'),
  ]);
}

function caseTree(slug: CaseSlug): El {
  const study = CASES.find((c) => c.slug === slug)!;
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    h(mono(22, C.ink2, { position: 'absolute', left: M, top: M - 8 }), `seo.farazahmad.dev › work › ${slug}`),
    h({ position: 'absolute', left: M, top: 150, flexDirection: 'column', width: W - M * 2, gap: 28 }, [
      h(
        { padding: '6px 14px', borderRadius: 4, background: C.yellow, alignSelf: 'flex-start', ...mono(20, C.ink, { letterSpacing: '0.08em' }) },
        study.og.eyebrow,
      ),
      h(
        {
          fontFamily: 'Schibsted Grotesk',
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 0.98,
          letterSpacing: '-0.034em',
          color: C.ink,
        },
        study.name,
      ),
      h({ fontFamily: 'Instrument Sans', fontSize: 32, lineHeight: 1.35, color: C.ink2, maxWidth: 940 }, study.og.line),
    ]),
    signature('Technical SEO'),
  ]);
}

export const OG_TARGETS = ['home', ...CASE_SLUGS] as const;
export type OgTarget = (typeof OG_TARGETS)[number];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const tree = target === 'home' ? homeTree() : caseTree(target);
  const svg = await satori(tree as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
