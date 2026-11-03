/**
 * ★ Signature: the Rules engine (brief §4 item 4). An EXAMPLE account over 14 days, labelled
 * "Example account · illustrative" on the page. Nothing here is a client's data or a result:
 * CPA is shown relative to the account's own target (1 = on target) and spend relative to its
 * daily cap (1 = the cap), so there is no money and no real-looking figure anywhere.
 *
 * The player walks six steps: the account with no rules, then four rules arriving one by one,
 * each visibly acting on the chart (a pause flattens the CPA line, a cap clips a bar, an alert
 * flags a day and the line recovers), then the change log.
 *
 * Geometry is computed here at build time for two layouts, so the chart renders without JS
 * and never measures the DOM:
 *   wide    desktop/tablet: CPA panel over a spend-bar panel, every label
 *   narrow  phones: the same two panels, taller and simpler, fewer labels
 * Every step's CPA line and waste area have the SAME path commands, so the browser can glide
 * between them (CSS `d`), and falls back to swapping the attribute where it can't.
 */

export const DAYS = 14;

/** Measured CPA ÷ target, per day, with nobody watching. */
const CPA_RAW = [0.86, 0.92, 0.88, 1.12, 1.28, 1.42, 1.5, 1.46, 1.36, 2.1, 2.25, 1.32, 1.2, 1.1] as const;
/**
 * Daily spend ÷ daily cap, with nobody watching. Day 8 runs past the cap (the cap rule's case);
 * day 12 jumps above the 7-day average + 50% (0.55 × 1.5 ≈ 0.83) but stays under the cap (1),
 * which is exactly what the anomaly rule exists for. Only day 8 is ever over the cap.
 */
const SPEND_RAW = [0.52, 0.56, 0.54, 0.57, 0.58, 0.56, 0.55, 1.5, 0.55, 0.53, 0.52, 0.92, 0.56, 0.54] as const;
/** The account's own 7-day average spend (÷ cap): the anomaly rule's baseline. */
export const SPEND_AVG = 0.55;

export type RuleKind = 'action' | 'alert';

export interface Rule {
  readonly id: 'cpa' | 'cap' | 'track' | 'spike';
  readonly name: string;
  /** Rule syntax, rendered as IF / FOR / THEN chips. `for` is optional. */
  readonly if: string;
  readonly for?: string;
  readonly then: string;
  readonly kind: RuleKind;
  /** 0-based day the rule fires on. */
  readonly day: number;
  /** What it did, for the card and the change log. */
  readonly did: string;
  /** Short tag on the chart. */
  readonly tag: string;
  /** Days this rule overrides once it is running (CPA and/or spend). */
  readonly cpa?: Readonly<Record<number, number>>;
  readonly spend?: Readonly<Record<number, number>>;
  /** One or two plain sentences for the step. */
  readonly text: string;
}

export const RULES: readonly Rule[] = [
  {
    id: 'cpa',
    name: 'CPA guard',
    if: 'CPA > target',
    for: '2 days',
    then: 'pause ad set',
    kind: 'action',
    day: 4,
    did: 'Paused ad set B',
    tag: 'Paused',
    cpa: { 5: 0.96, 6: 0.9, 7: 0.93, 8: 0.89 },
    text: 'Ad set B drifts over target on day 4. On the second day over, the guard pauses it, and the account’s CPA settles back under the line instead of climbing for a week.',
  },
  {
    id: 'cap',
    name: 'Budget cap',
    if: 'spend ≥ daily cap',
    then: 'stop for the day',
    kind: 'action',
    day: 7,
    did: 'Held campaign A at its cap',
    tag: 'Capped',
    spend: { 7: 1 },
    text: 'On day 8 a campaign runs far past its daily cap. With the cap rule it stops at the line; the hatched part of the bar is spend that never happened.',
  },
  {
    id: 'track',
    name: 'Tracking check',
    if: 'clicks, 0 conversions',
    for: '6 hours',
    then: 'alert on Slack',
    kind: 'alert',
    day: 9,
    did: 'Alerted: conversions stopped',
    tag: 'Alert',
    cpa: { 9: 1.18, 10: 0.9 },
    text: 'Conversions stop arriving on day 10, so the measured CPA shoots up and bidding flies blind. The check alerts within hours, tracking is fixed the same day, and day 11 reads normally.',
  },
  {
    id: 'spike',
    name: 'Spend anomaly',
    if: 'spend > 7-day avg + 50%',
    then: 'alert and hold',
    kind: 'alert',
    day: 11,
    did: 'Alerted: spend spike held',
    tag: 'Alert',
    spend: { 11: 0.6 },
    cpa: { 11: 1, 12: 0.9, 13: 0.88 },
    text: 'A budget edit on day 12 sends spend well over its usual level but still under the cap, so the cap can’t see it. The anomaly rule can: it alerts and holds, and the edit is reverted.',
  },
];

export interface Step {
  readonly title: string;
  readonly text: string;
  /** How many rules are running in this step (0..RULES.length). */
  readonly rules: number;
  /** Index of the rule arriving in this step, if any. */
  readonly arriving?: number;
  readonly log?: boolean;
}

export const STEPS: readonly Step[] = [
  {
    title: 'No rules running',
    text: 'Two weeks of an example account with nobody watching between reports. Everything shaded red is spend above target: it is only found when someone reads the report.',
    rules: 0,
  },
  ...RULES.map((r, i) => ({ title: r.name, text: r.text, rules: i + 1, arriving: i })),
  {
    title: 'Every action logged',
    text: 'Four rules, four actions, each logged with the rule that took it. Read, reverse or switch off any of them.',
    rules: RULES.length,
    log: true,
  },
];

/** State of the account with the first `k` rules running. */
export function stateAt(k: number): { cpa: number[]; spend: number[] } {
  const cpa: number[] = [...CPA_RAW];
  const spend: number[] = [...SPEND_RAW];
  RULES.slice(0, k).forEach((r) => {
    Object.entries(r.cpa ?? {}).forEach(([d, v]) => (cpa[Number(d)] = v));
    Object.entries(r.spend ?? {}).forEach(([d, v]) => (spend[Number(d)] = v));
  });
  return { cpa, spend };
}

/** Days with CPA over target, per step: the counter in the chart header. */
export const daysOver = (k: number): number => stateAt(k).cpa.filter((v) => v > 1.001).length;

// ---------------------------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------------------------

export type Layout = 'wide' | 'narrow';

interface Frame {
  readonly w: number;
  readonly h: number;
  /** Plot x range. */
  readonly x0: number;
  readonly x1: number;
  /** CPA panel y range (top, bottom). */
  readonly cTop: number;
  readonly cBot: number;
  /** Spend panel y range. */
  readonly sTop: number;
  readonly sBot: number;
  readonly cpaMax: number;
  readonly spendMax: number;
  readonly barW: number;
}

const FRAMES: Record<Layout, Frame> = {
  /* Compact: CPA plot 148 units tall (was 240), spend plot 64 (was 92). */
  wide: { w: 720, h: 284, x0: 74, x1: 700, cTop: 20, cBot: 168, sTop: 198, sBot: 262, cpaMax: 2.4, spendMax: 1.6, barW: 22 },
  /* Phones: drawn ~320px wide, so 12.5 viewBox units of text render at ~11px or more. */
  narrow: { w: 340, h: 246, x0: 34, x1: 334, cTop: 20, cBot: 134, sTop: 162, sBot: 226, cpaMax: 2.4, spendMax: 1.6, barW: 11 },
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export interface Chart {
  readonly layout: Layout;
  readonly w: number;
  readonly h: number;
  readonly f: Frame;
  /** x of each day's centre. */
  readonly xs: readonly number[];
  readonly yCpa: (v: number) => number;
  readonly ySpend: (v: number) => number;
  /** Per step k (0..STEPS-1): the CPA line and the closed area under it (clipped above target). */
  readonly lines: readonly string[];
  readonly areas: readonly string[];
  /** The raw (no-rules) line, drawn as a faint ghost once rules are running. */
  readonly ghost: string;
  readonly ticks: readonly { v: number; y: number; label: string }[];
  readonly bars: readonly {
    readonly day: number;
    readonly x: number;
    /** Kept spend (top y and height) and the excess the rule held back (if any). */
    readonly keptY: number;
    readonly keptH: number;
    readonly exY: number;
    readonly exH: number;
    /** Index of the rule that holds back the excess. */
    readonly rule: number;
  }[];
  readonly marks: readonly {
    readonly rule: number;
    readonly kind: RuleKind;
    readonly x: number;
    readonly y: number;
    readonly tag: string;
    /** For spend rules, the bar's top: the mark sits there. */
    readonly onBar: boolean;
    /** For spend rules, the middle of the held-back part: its tag sits beside it. */
    readonly exMid: number;
  }[];
}

export function chart(layout: Layout): Chart {
  const f = FRAMES[layout];
  const step = (f.x1 - f.x0) / DAYS;
  const xs = Array.from({ length: DAYS }, (_, d) => r1(f.x0 + step * (d + 0.5)));
  const yCpa = (v: number) => r1(f.cBot - (Math.min(v, f.cpaMax) / f.cpaMax) * (f.cBot - f.cTop));
  const ySpend = (v: number) => r1(f.sBot - (Math.min(v, f.spendMax) / f.spendMax) * (f.sBot - f.sTop));
  const yT = yCpa(1);

  const line = (cpa: readonly number[]) => cpa.map((v, d) => `${d ? 'L' : 'M'}${xs[d]} ${yCpa(v)}`).join(' ');
  const area = (cpa: readonly number[]) =>
    `M${xs[0]} ${yT} ${cpa.map((v, d) => `L${xs[d]} ${yCpa(v)}`).join(' ')} L${xs[DAYS - 1]} ${yT} Z`;

  const states = STEPS.map((s) => stateAt(s.rules));
  const raw = stateAt(0);
  const full = stateAt(RULES.length);

  const bars = Array.from({ length: DAYS }, (_, d) => {
    const kept = full.spend[d]!;
    const rawV = raw.spend[d]!;
    const ex = Math.max(0, rawV - kept);
    const rule = RULES.findIndex((r) => r.spend && d in r.spend);
    return {
      day: d,
      x: r1(xs[d]! - f.barW / 2),
      keptY: ySpend(kept),
      keptH: r1(f.sBot - ySpend(kept)),
      exY: ySpend(rawV),
      exH: r1(ySpend(kept) - ySpend(rawV)),
      rule: ex > 0 ? rule : -1,
    };
  });

  const marks = RULES.map((r, i) => {
    const onBar = Boolean(r.spend && r.day in r.spend);
    const fullAt = stateAt(i + 1);
    return {
      rule: i,
      kind: r.kind,
      x: xs[r.day]!,
      y: onBar ? ySpend(fullAt.spend[r.day]!) : yCpa(r.kind === 'alert' ? raw.cpa[r.day]! : fullAt.cpa[r.day]!),
      tag: r.tag,
      onBar,
      exMid: onBar ? r1((ySpend(raw.spend[r.day]!) + ySpend(fullAt.spend[r.day]!)) / 2) : 0,
    };
  });

  const tickVals = layout === 'wide' ? [0.5, 1, 1.5, 2] : [1, 2];
  const ticks = tickVals.map((v) => ({
    v,
    y: yCpa(v),
    label: v === 1 ? (layout === 'wide' ? 'Target' : '1×') : `${v}×`,
  }));

  return {
    layout,
    w: f.w,
    h: f.h,
    f,
    xs,
    yCpa,
    ySpend,
    lines: states.map((s) => line(s.cpa)),
    areas: states.map((s) => area(s.cpa)),
    ghost: line(raw.cpa),
    ticks,
    bars,
    marks,
  };
}
