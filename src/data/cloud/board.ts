/**
 * ★ Status board (brief §4 item 4): an example service going from an incident to a steady state.
 *
 * EVERY number here is ILLUSTRATIVE. It is the shape of a typical engagement, not a client
 * result, and the section says so on screen. These values never reach meta, OG or JSON-LD.
 * Small module on purpose: the board's client script imports it.
 */
export type Tone = 'bad' | 'warn' | 'ok';

export interface BoardMetric {
  readonly id: 'latency' | 'errors' | 'deploys' | 'cost';
  readonly label: string;
  readonly unit: string;
  /** Lower is better for all four except deploys. */
  readonly better: 'lower' | 'higher';
}

export const BOARD_METRICS: readonly BoardMetric[] = [
  { id: 'latency', label: 'p95 latency', unit: 'ms', better: 'lower' },
  { id: 'errors', label: 'Error rate', unit: '%', better: 'lower' },
  { id: 'deploys', label: 'Deploys', unit: '/ week', better: 'higher' },
  { id: 'cost', label: 'Monthly cost', unit: 'USD', better: 'lower' },
];

export interface BoardStep {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly status: { readonly label: string; readonly tone: Tone };
  readonly values: Readonly<Record<BoardMetric['id'], number>>;
  readonly tones: Readonly<Record<BoardMetric['id'], Tone>>;
  /** 12-point history for each sparkline, oldest first (same units as the value). */
  readonly series: Readonly<Record<BoardMetric['id'], readonly number[]>>;
  readonly log: string;
}

export const BOARD_STEPS: readonly BoardStep[] = [
  {
    id: 'incident',
    title: 'Incident',
    text: 'Checkout is slow and one request in twelve fails. The only alert was a customer email.',
    status: { label: 'Major outage', tone: 'bad' },
    values: { latency: 2400, errors: 8.2, deploys: 1, cost: 4800 },
    tones: { latency: 'bad', errors: 'bad', deploys: 'warn', cost: 'warn' },
    series: {
      latency: [420, 450, 480, 610, 700, 980, 1250, 1500, 1900, 2100, 2300, 2400],
      errors: [0.4, 0.5, 0.6, 0.9, 1.4, 2.2, 3.1, 4.4, 5.9, 6.8, 7.6, 8.2],
      deploys: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
      cost: [3900, 4000, 4100, 4150, 4300, 4350, 4450, 4500, 4600, 4650, 4750, 4800],
    },
    log: '14:02 alert · customer email: “checkout keeps timing out”',
  },
  {
    id: 'diagnose',
    title: 'Diagnose',
    text: 'One oversized server at full CPU, a job nobody owns hammering the database, and no dashboard showing either.',
    status: { label: 'Investigating', tone: 'warn' },
    values: { latency: 2100, errors: 6.4, deploys: 1, cost: 4800 },
    tones: { latency: 'bad', errors: 'bad', deploys: 'warn', cost: 'warn' },
    series: {
      latency: [480, 610, 700, 980, 1250, 1500, 1900, 2100, 2300, 2400, 2250, 2100],
      errors: [0.6, 0.9, 1.4, 2.2, 3.1, 4.4, 5.9, 6.8, 7.6, 8.2, 7.1, 6.4],
      deploys: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
      cost: [4100, 4150, 4300, 4350, 4450, 4500, 4600, 4650, 4750, 4800, 4800, 4800],
    },
    log: '14:20 cause · runaway report job, db cpu 97%, no index on orders',
  },
  {
    id: 'pipeline',
    title: 'Fix the pipeline',
    text: 'The hot fix goes in through a pipeline, not over SSH: tests on every change and a preview to check it before it ships.',
    status: { label: 'Mitigating', tone: 'warn' },
    values: { latency: 820, errors: 1.9, deploys: 6, cost: 4300 },
    tones: { latency: 'warn', errors: 'warn', deploys: 'ok', cost: 'warn' },
    series: {
      latency: [1500, 1900, 2100, 2300, 2400, 2250, 2100, 1700, 1300, 1050, 900, 820],
      errors: [4.4, 5.9, 6.8, 7.6, 8.2, 7.1, 6.4, 4.8, 3.3, 2.6, 2.2, 1.9],
      deploys: [1, 0, 1, 1, 1, 2, 3, 4, 5, 5, 6, 6],
      cost: [4500, 4600, 4650, 4750, 4800, 4800, 4800, 4700, 4600, 4450, 4350, 4300],
    },
    log: 'ci · tests 214 passed · preview ready · index added',
  },
  {
    id: 'deploy',
    title: 'Rollback-safe deploy',
    text: 'Changes ship to a slice of traffic first, and step back on their own if errors rise. Rolling back is one command, and we tried it.',
    status: { label: 'Monitoring', tone: 'ok' },
    values: { latency: 310, errors: 0.4, deploys: 12, cost: 3600 },
    tones: { latency: 'ok', errors: 'ok', deploys: 'ok', cost: 'warn' },
    series: {
      latency: [2100, 1700, 1300, 1050, 900, 820, 700, 560, 450, 380, 340, 310],
      errors: [6.4, 4.8, 3.3, 2.6, 2.2, 1.9, 1.4, 1.0, 0.8, 0.6, 0.5, 0.4],
      deploys: [3, 4, 5, 5, 6, 6, 8, 9, 10, 11, 12, 12],
      cost: [4800, 4700, 4600, 4450, 4350, 4300, 4200, 4050, 3900, 3800, 3700, 3600],
    },
    log: 'deploy · canary 10% → 100% · auto-rollback armed',
  },
  {
    id: 'steady',
    title: 'Steady state',
    text: 'Right-sized servers, alerts on what users feel, a tested restore, and a bill that matches what the app needs.',
    status: { label: 'All systems operational', tone: 'ok' },
    values: { latency: 180, errors: 0.1, deploys: 15, cost: 2900 },
    tones: { latency: 'ok', errors: 'ok', deploys: 'ok', cost: 'ok' },
    series: {
      latency: [820, 700, 560, 450, 380, 340, 310, 260, 220, 200, 190, 180],
      errors: [1.9, 1.4, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.12, 0.1],
      deploys: [6, 8, 9, 10, 11, 12, 12, 13, 14, 14, 15, 15],
      cost: [4300, 4200, 4050, 3900, 3800, 3700, 3600, 3400, 3200, 3050, 2950, 2900],
    },
    log: 'status · all systems operational · restore test 03:00 passed',
  },
];

/** Display format shared by the server render and the client script. */
export function formatMetric(id: BoardMetric['id'], v: number): string {
  if (id === 'errors') return v.toFixed(1);
  if (id === 'cost') return `$${Math.round(v).toLocaleString('en-US')}`;
  return Math.round(v).toLocaleString('en-US');
}

/** Sparkline path in a 120×36 box. Each metric is scaled to its own range across all steps. */
export const SPARK_W = 120;
export const SPARK_H = 36;
const ranges = Object.fromEntries(
  BOARD_METRICS.map((m) => {
    const all = BOARD_STEPS.flatMap((s) => s.series[m.id]);
    return [m.id, [Math.min(...all), Math.max(...all)] as const];
  }),
) as Record<BoardMetric['id'], readonly [number, number]>;

export function sparkPath(id: BoardMetric['id'], series: readonly number[]): string {
  const [min, max] = ranges[id];
  const span = max - min || 1;
  const n = series.length;
  return series
    .map((v, i) => {
      const x = (i * SPARK_W) / (n - 1);
      const y = SPARK_H - 3 - ((v - min) / span) * (SPARK_H - 6);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
