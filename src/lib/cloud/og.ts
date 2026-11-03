/**
 * Build-time Open Graph images for the cloud niche: satori renders an element tree to SVG, resvg
 * rasterises it to a 1200×630 PNG. Runs only at build (and on request in dev).
 *
 * Honesty rule: social networks cache OG images, so these never print a number, a TODO or a
 * status claim. The bars are shapes, stamped "Example"; case images show only verified nodes.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/cloud/site';
import { CASES, type CaseSlug, type CloudCase } from '../../data/cloud/cases';
import { isTodo } from '../../data/cloud/todo';

const W = 1200;
const H = 630;
const M = 72;

const C = {
  bg: '#0b1115',
  s1: '#10181d',
  s2: '#152027',
  line: '#22303a',
  line2: '#33464f',
  text: '#e7f0ee',
  text2: '#aebfbc',
  text3: '#8a9c9b',
  mint: '#4fe3ae',
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
    { name: 'Archivo', data: load('Archivo-ExtraBold.woff'), weight: 800, style: 'normal' },
    { name: 'Manrope', data: load('Manrope-Medium.woff'), weight: 500, style: 'normal' },
    { name: 'Clash Display', data: load('ClashDisplay-Semibold.ttf'), weight: 600, style: 'normal' },
    { name: 'Martian Mono', data: load('MartianMono-Regular.woff'), weight: 400, style: 'normal' },
  ];
  return fontCache;
}

const mono = (size: number, color: string, extra: Style = {}): Style => ({
  fontFamily: 'Martian Mono',
  fontSize: size,
  color,
  letterSpacing: '0.04em',
  ...extra,
});

/** A row of uptime bars. `dim` marks a few bars as quieter, purely for texture. */
function bars(count: number, dim: readonly number[] = []): El {
  return h(
    { gap: 4 },
    Array.from({ length: count }, (_, i) =>
      h({ width: 8, height: 30, borderRadius: 2, background: dim.includes(i) ? C.line2 : C.mint }),
    ),
  );
}

const stamp = (text: string): El =>
  h({ padding: '6px 12px', border: `1px solid ${C.line2}`, borderRadius: 4, ...mono(15, C.text2) }, text);

function frame(children: El[]): El {
  return h({ width: W, height: H, background: C.bg, position: 'relative' }, [
    // hairline grid of the ops room
    h({
      position: 'absolute',
      left: 0,
      top: 0,
      width: W,
      height: H,
      backgroundImage: `radial-gradient(circle, ${C.line} 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
    }),
    ...children,
    h({ position: 'absolute', left: M, bottom: M - 12, alignItems: 'baseline', gap: 20 }, [
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.text, letterSpacing: '-0.02em' }, PERSON_NAME),
      h(mono(19, C.text2), 'Cloud & DevOps'),
    ]),
  ]);
}

function homeTree(): El {
  const rows = ['web', 'api', 'worker', 'database'];
  return frame([
    h(mono(19, C.text2, { position: 'absolute', left: M, top: M - 6 }), 'cloud.farazahmad.dev'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 140,
        width: 600,
        flexDirection: 'column',
        fontFamily: 'Archivo',
        fontWeight: 800,
        fontSize: 76,
        lineHeight: 1.02,
        letterSpacing: '-0.03em',
        color: C.text,
      },
      [
        h({}, 'Infrastructure'),
        h({ gap: 20 }, [h({}, 'that'), h({ color: C.mint }, 'stays up')]),
        h({ gap: 20 }, [h({}, 'and'), h({ color: C.mint }, 'costs less.')]),
      ],
    ),
    h(
      {
        position: 'absolute',
        right: M,
        top: 120,
        width: 420,
        flexDirection: 'column',
        gap: 18,
        padding: 28,
        borderRadius: 14,
        background: C.s2,
        border: `1px solid ${C.line}`,
      },
      [
        h({ justifyContent: 'space-between', alignItems: 'center' }, [h(mono(17, C.text), 'status'), stamp('EXAMPLE')]),
        ...rows.map((r, k) =>
          h({ flexDirection: 'column', gap: 8 }, [h(mono(15, C.text3), r), bars(30, k === 1 ? [6] : k === 2 ? [19, 20] : [])]),
        ),
      ],
    ),
  ]);
}

function caseTree(c: CloudCase): El {
  const nodes = (c.arch[0]?.nodes ?? []).filter((n) => !isTodo(n.label)).slice(0, 4);
  return frame([
    h(mono(19, C.text2, { position: 'absolute', left: M, top: M - 6 }), 'CASE STUDY'),
    h(mono(19, C.text2, { position: 'absolute', right: M, top: M - 6 }), 'cloud.farazahmad.dev'),
    h({ position: 'absolute', left: M, top: 140, width: 640, flexDirection: 'column', gap: 24 }, [
      h(
        {
          fontFamily: 'Archivo',
          fontWeight: 800,
          fontSize: c.name.length > 18 ? 58 : 84,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: C.text,
        },
        c.name,
      ),
      h({ fontFamily: 'Manrope', fontSize: 30, lineHeight: 1.35, color: C.text2 }, c.og.line),
    ]),
    nodes.length
      ? h(
          { position: 'absolute', right: M, top: 130, width: 330, flexDirection: 'column', gap: 0 },
          nodes.flatMap((n, i) => {
            const box = h(
              {
                padding: '14px 20px',
                borderRadius: 10,
                background: i === nodes.length - 1 ? C.mint : C.s2,
                border: i === nodes.length - 1 ? 'none' : `1px solid ${C.line2}`,
                fontFamily: 'Manrope',
                fontSize: 22,
                color: i === nodes.length - 1 ? C.bg : C.text,
              },
              n.label as string,
            );
            return i === 0 ? [box] : [h({ width: 2, height: 22, marginLeft: 28, background: C.line2 }), box];
          }),
        )
      : h({ position: 'absolute', right: M, top: 200, flexDirection: 'column', gap: 12 }, [bars(22, [4]), bars(22, [15, 16])]),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.slug)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.slug === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown cloud case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
