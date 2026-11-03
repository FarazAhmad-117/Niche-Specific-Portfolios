/**
 * Data behind the signature growth chart.
 *
 * Today it is an ILLUSTRATION: a deterministic, shape-only curve of a typical engagement, with
 * no axis values and no counts. The section says so on the chart and in its caption.
 *
 * To plug in real Search Console data later, set GROWTH_DATA to { kind: 'real', ... } with the
 * exported daily or weekly series. The chart then drops the "Illustration" label, prints the
 * date range and the source, and shows the real peak values on its two axes.
 */

export type GrowthData =
  | { readonly kind: 'illustrative' }
  | {
      readonly kind: 'real';
      /** e.g. "Search Console · anonymized client site" */
      readonly source: string;
      /** Human-readable range, e.g. "Jan 2026 – Oct 2026". */
      readonly range: string;
      readonly clicks: readonly number[];
      readonly impressions: readonly number[];
    };

export const GROWTH_DATA: GrowthData = { kind: 'illustrative' };

export interface Series {
  readonly real: boolean;
  /** Both series normalised to 0..1 (each on its own scale, like Search Console's two axes). */
  readonly clicks: readonly number[];
  readonly impressions: readonly number[];
  readonly peak?: { readonly clicks: number; readonly impressions: number };
  readonly source?: string;
  readonly range?: string;
}

const smooth = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Ramp from a to b between x0 and x1 (smoothstep), flat outside. */
const ramp = (x: number, x0: number, x1: number, a: number, b: number): number =>
  a + (b - a) * smooth((x - x0) / (x1 - x0));

/** Deterministic wobble so the line reads like weekly data, not a vector swoosh. */
const wobble = (i: number, amp: number): number =>
  amp * (Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.63 + 1.3) * 0.3 + Math.sin(i * 3.1 + 0.4) * 0.15);

function illustrative(n = 72): Series {
  const clicks: number[] = [];
  const impressions: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    // Phase edges match GROWTH.phases x: 0.2 indexation, 0.44 programmatic, 0.66 engine, 0.84 grow.
    let imp = 0.3 - 0.03 * smooth(x / 0.2);
    if (x > 0.2) imp = ramp(x, 0.22, 0.34, 0.27, 0.44);
    if (x > 0.44) imp = ramp(x, 0.45, 0.6, 0.44, 0.66);
    if (x > 0.6) imp = ramp(x, 0.66, 0.84, 0.66, 0.82);
    if (x > 0.84) imp = ramp(x, 0.84, 1, 0.82, 0.92);
    let clk = 0.13 - 0.02 * smooth(x / 0.2);
    if (x > 0.24) clk = ramp(x, 0.26, 0.42, 0.11, 0.2);
    if (x > 0.44) clk = ramp(x, 0.48, 0.66, 0.2, 0.38);
    if (x > 0.66) clk = ramp(x, 0.66, 0.86, 0.38, 0.6);
    if (x > 0.86) clk = ramp(x, 0.86, 1, 0.6, 0.74);
    impressions.push(Math.min(0.98, Math.max(0.02, imp + wobble(i, 0.025))));
    clicks.push(Math.min(0.98, Math.max(0.02, clk + wobble(i + 11, 0.018))));
  }
  return { real: false, clicks, impressions };
}

function normalise(values: readonly number[]): { values: number[]; peak: number } {
  const peak = Math.max(1, ...values);
  return { values: values.map((v) => (v / peak) * 0.92), peak };
}

export function growthSeries(data: GrowthData = GROWTH_DATA): Series {
  if (data.kind === 'illustrative') return illustrative();
  const c = normalise(data.clicks);
  const i = normalise(data.impressions);
  return {
    real: true,
    clicks: c.values,
    impressions: i.values,
    peak: { clicks: c.peak, impressions: i.peak },
    source: data.source,
    range: data.range,
  };
}

/** Smooth SVG path through the points (Catmull-Rom converted to cubic Béziers). */
export function linePath(values: readonly number[], w: number, h: number): string {
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - v * h] as const);
  if (pts.length < 2) return '';
  const f = (n: number) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const t = 0.18;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${f(c1[0]!)} ${f(c1[1]!)} ${f(c2[0]!)} ${f(c2[1]!)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Closed area under the line, for the impressions fill. */
export const areaPath = (values: readonly number[], w: number, h: number): string =>
  `${linePath(values, w, h)}L${w} ${h}L0 ${h}Z`;
