/**
 * Build-time Open Graph image for the funnels home: satori renders an element tree to SVG,
 * resvg rasterises it to a 1200×630 PNG. Runs only at build.
 *
 * Honesty rule: social networks cache OG images, so this never prints a number we do not
 * have. The thread shows the shape of a sequence, not a result.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PERSON_NAME } from '../../data/funnels/site';
import { CASES, type CaseSlug, type FunnelCase } from '../../data/funnels/cases';

const W = 1200;
const H = 630;
const M = 80;

const C = {
  cream: '#f7f2ea',
  cream2: '#efe7da',
  line: '#e2d7c5',
  ink: '#1c1916',
  ink2: '#4a443d',
  rose: '#ff3d7f',
  roseText: '#c2185b',
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
    { name: 'Cabinet Grotesk', data: load('CabinetGrotesk-Extrabold.ttf'), weight: 800, style: 'normal' },
    { name: 'Satoshi', data: load('Satoshi-Medium.woff'), weight: 500, style: 'normal' },
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

const pill = (text: string, rose = false): El =>
  h(
    {
      alignSelf: 'center',
      padding: '8px 18px',
      borderRadius: 999,
      background: rose ? C.rose : C.cream2,
      ...mono(17, C.ink),
    },
    text,
  );

const bubble = (text: string, out: boolean): El =>
  h(
    {
      alignSelf: out ? 'flex-end' : 'flex-start',
      maxWidth: 330,
      padding: '14px 18px',
      borderRadius: 22,
      borderBottomRightRadius: out ? 6 : 22,
      borderBottomLeftRadius: out ? 22 : 6,
      background: out ? C.ink : '#fdfaf5',
      border: out ? 'none' : `1px solid ${C.line}`,
      color: out ? C.cream : C.ink,
      fontFamily: 'Satoshi',
      fontSize: 21,
      lineHeight: 1.35,
    },
    text,
  );

function homeTree(): El {
  return h({ width: W, height: H, background: C.cream, position: 'relative' }, [
    h(mono(22, C.ink2, { position: 'absolute', left: M, top: M - 6 }), 'funnels.farazahmad.dev'),
    h(
      {
        position: 'absolute',
        left: M,
        top: 150,
        width: 640,
        flexDirection: 'column',
        fontFamily: 'Cabinet Grotesk',
        fontWeight: 800,
        fontSize: 92,
        lineHeight: 0.92,
        letterSpacing: '-0.035em',
        color: C.ink,
      },
      [h({}, 'Follow-up that'), h({}, 'never forgets'), h({ color: C.roseText }, 'a lead.')],
    ),
    h(
      {
        position: 'absolute',
        right: M,
        top: 110,
        width: 380,
        flexDirection: 'column',
        gap: 14,
      },
      [
        pill('New lead · google / cpc'),
        bubble('Hi Sam, thanks for asking. Here are my open times.', true),
        bubble('Could we talk on Thursday?', false),
        pill('Reply detected · sequence paused'),
        pill('Booked · Thu 10:30', true),
      ],
    ),
    h({ position: 'absolute', left: M, bottom: M - 10, alignItems: 'baseline', gap: 20 }, [
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
      h(mono(22, C.ink2), 'Marketing automation'),
    ]),
  ]);
}

/** A case: its name, its one-line angle, and its real flow as a column of pills. */
function caseTree(c: FunnelCase): El {
  const steps = c.flow.slice(0, 5);
  return h({ width: W, height: H, background: C.cream, position: 'relative' }, [
    h(mono(22, C.ink2, { position: 'absolute', left: M, top: M - 6, letterSpacing: '0.06em' }), 'CASE STUDY'),
    h(mono(22, C.ink2, { position: 'absolute', right: M, top: M - 6 }), 'funnels.farazahmad.dev'),
    h({ position: 'absolute', left: M, top: 150, width: 620, flexDirection: 'column', gap: 26 }, [
      h(
        {
          fontFamily: 'Cabinet Grotesk',
          fontWeight: 800,
          fontSize: c.name.length > 20 ? 64 : 92,
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          color: C.ink,
        },
        c.name,
      ),
      h({ fontFamily: 'Satoshi', fontSize: 32, lineHeight: 1.3, color: C.ink2 }, c.title),
    ]),
    h(
      { position: 'absolute', right: M, top: 130, width: 340, flexDirection: 'column', gap: 12, alignItems: 'flex-start' },
      steps.map((s, i) =>
        h(
          {
            padding: '10px 20px',
            marginLeft: i % 2 ? 40 : 0,
            borderRadius: 999,
            background: i === steps.length - 1 ? C.rose : '#fdfaf5',
            border: i === steps.length - 1 ? 'none' : `1px solid ${C.line}`,
            fontFamily: 'Satoshi',
            fontSize: 22,
            color: C.ink,
          },
          s,
        ),
      ),
    ),
    h({ position: 'absolute', left: M, bottom: M - 10, alignItems: 'baseline', gap: 20 }, [
      h({ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: '-0.02em' }, PERSON_NAME),
      h(mono(22, C.ink2), 'Marketing automation'),
    ]),
  ]);
}

export type OgTarget = 'home' | CaseSlug;
export const OG_TARGETS: readonly OgTarget[] = ['home', ...CASES.map((c) => c.id)];

export async function renderOg(target: OgTarget): Promise<Uint8Array> {
  const c = target === 'home' ? undefined : CASES.find((x) => x.id === target);
  if (target !== 'home' && !c) throw new Error(`[og] unknown funnels case: ${target}`);
  const svg = await satori((c ? caseTree(c) : homeTree()) as never, { width: W, height: H, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
