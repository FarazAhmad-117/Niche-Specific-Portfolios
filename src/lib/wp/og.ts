/**
 * Build-time Open Graph images for the wp niche: satori renders an element tree to SVG, resvg
 * rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. Home shows the headline and the proof-sheet marks (what I check, not a result); a case
 * shows its flow. The example teardown is labelled "Example teardown · illustrative".
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/wp/site';
import { CASES, type CaseSlug, type WpCase } from '../../data/wp/cases';
import { HERO_BLOCKS } from '../../data/wp/content';
import { markOnPaperSvg } from './brand-mark';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  paper: '#fafaf7',
  card: '#ffffff',
  line: '#dedcd3',
  ink: '#14141a',
  ink2: '#44434c',
  ultra: '#3a3aff',
  ultraText: '#2b2bd9',
  soft: '#e7e7ff',
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
    { name: 'Boska', data: load('Boska-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'Boska', data: load('Boska-MediumItalic.woff'), weight: 500, style: 'italic' },
    { name: 'Hanken Grotesk', data: load('HankenGrotesk-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: load('JetBrainsMono-Regular.woff'), weight: 400, style: 'normal' },
  ];
  return fontCache;
}

const mono = (size: number, color: string, extra: Style = {}): Style => ({
  fontFamily: 'JetBrains Mono',
  fontSize: size,
  color,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  ...extra,
});

/** The newspaper head rule: thick over thin, with the folio line under it. */
const masthead = (left: string, right: string): El =>
  h({ position: 'absolute', left: M, right: M, top: M - 24, flexDirection: 'column' }, [
    h({ height: 4, background: C.ink }),
    h({ height: 1, background: C.ink, marginTop: 4 }),
    h({ justifyContent: 'space-between', marginTop: 12 }, [h(mono(18, C.ink2), left), h(mono(18, C.ink2), right)]),
  ]);

const footer = (): El =>
  h({ position: 'absolute', left: M, right: M, bottom: M - 22, alignItems: 'center', justifyContent: 'space-between' }, [
    h({ alignItems: 'center', gap: 16 }, [
      img(markOnPaperSvg(34), 34, 37),
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 38, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
    ]),
    h(mono(18, C.ink2), 'WordPress developer'),
  ]);

/** A list down a ruled column: a number or mark on the left, the line beside it. */
function column(title: string, rows: readonly { mark: string; text: string }[], width: number, rowH = 56, italicMarks = false): El {
  return h(
    {
      flexDirection: 'column',
      width,
      padding: '20px 24px 10px',
      borderRadius: 12,
      background: C.card,
      border: `1px solid ${C.line}`,
      boxShadow: '0 30px 60px -30px rgba(20,20,50,0.35)',
    },
    [
      h(mono(15, C.ink2, { marginBottom: 6 }), title),
      ...rows.map((r) =>
        h({ height: rowH, alignItems: 'center', gap: 16, borderTop: `1px solid ${C.line}` }, [
          h(
            italicMarks
              ? { width: 120, flexShrink: 0, fontFamily: 'Boska', fontWeight: 500, fontStyle: 'italic', fontSize: 25, color: C.ultraText }
              : { width: 40, flexShrink: 0, fontFamily: 'JetBrains Mono', fontSize: 17, color: C.ultraText },
            r.mark,
          ),
          h({ flex: 1, fontFamily: 'Hanken Grotesk', fontSize: 20, lineHeight: 1.25, color: C.ink }, r.text),
        ]),
      ),
    ],
  );
}

function homeTree(): El {
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    masthead('wp.farazahmad.dev', 'WordPress · Faraz Ahmad'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 158,
        width: 600,
        flexDirection: 'column',
        fontFamily: 'Boska',
        fontWeight: 500,
        fontSize: 70,
        lineHeight: 1.06,
        letterSpacing: '-0.02em',
        color: C.ink,
      },
      [
        h({}, 'WordPress that’s'),
        h({}, 'fast, secure, and'),
        h({}, [h({ fontStyle: 'italic', color: C.ultraText, marginRight: 16 }, 'yours'), h({}, 'to edit.')]),
      ],
    ),
    h({ position: 'absolute', right: M, top: 132 }, [
      column(
        'Checked on every page',
        HERO_BLOCKS.map((b) => ({ mark: b.mark, text: b.block })),
        430,
        58,
        true,
      ),
    ]),
    footer(),
  ]);
}

/** A case: its kicker, name, one-line angle, and its flow down a ruled column. */
function caseTree(c: WpCase): El {
  const rows = c.flow.map((s, i) => ({ mark: String(i + 1).padStart(2, '0'), text: s }));
  return h({ width: W, height: H, background: C.paper, position: 'relative' }, [
    masthead(c.example ? 'Example teardown · illustrative' : 'Case study', 'wp.farazahmad.dev'),
    h({ position: 'absolute', left: M, top: 140, width: 600, flexDirection: 'column', gap: 22 }, [
      c.example
        ? h(
            {
              alignSelf: 'flex-start',
              padding: '3px 12px',
              border: `1.5px solid ${C.ink2}`,
              borderRadius: 3,
              ...mono(16, C.ink2),
            },
            'Example · not a client site',
          )
        : h({}, ''),
      h(
        {
          fontFamily: 'Boska',
          fontWeight: 500,
          fontSize: c.name.length > 24 ? 56 : 66,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          color: C.ink,
        },
        c.name,
      ),
      h({ fontFamily: 'Hanken Grotesk', fontSize: 26, lineHeight: 1.35, color: C.ink2 }, c.title),
    ]),
    h({ position: 'absolute', right: M, top: 132 }, [column(c.example ? 'The method' : 'How it runs', rows, 400, rows.length > 5 ? 50 : 56)]),
    footer(),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown wp case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
