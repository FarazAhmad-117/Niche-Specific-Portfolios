/**
 * Content values that are not (yet) owner-verified facts.
 *
 * A Field is one of:
 *  - string        real, owner-approved text or a fact from the owner's own sites
 *  - TodoField     missing; renders as a visible `TODO · …` chip
 *  - SampleField   an illustrative value shown so layouts read as finished while the real
 *                  number is pending. It is NOT a measured result. It renders as normal text,
 *                  pages that show one carry an "illustrative figures" note, it never reaches
 *                  meta tags / OG images / JSON-LD (textOf() drops it), and the build refuses
 *                  to run with the niche indexable while any remain (assertLaunchReady).
 */
export interface TodoField {
  readonly todo: true;
  /** Stable id, dotted path: `case.lead-drift.result.leads`. */
  readonly id: string;
  /** What the owner needs to provide, shown in the chip. */
  readonly label: string;
}

export interface SampleField {
  readonly sample: true;
  readonly id: string;
  /** The illustrative text shown on the page. */
  readonly value: string;
}

export type Field = string | TodoField | SampleField;

export const todo = (id: string, label: string): TodoField => ({ todo: true, id, label });
export const sample = (id: string, value: string): SampleField => ({ sample: true, id, value });

export const isTodo = (value: Field | null | undefined): value is TodoField =>
  typeof value === 'object' && value !== null && 'todo' in value;

export const isSample = (value: Field | null | undefined): value is SampleField =>
  typeof value === 'object' && value !== null && 'sample' in value;

/** Text safe for machine-readable output: only real strings, never a placeholder or sample. */
export const textOf = (value: Field | null | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;

/** Text for on-page display: real text or a sample's value (a TODO has none). */
export const displayText = (value: Field | null | undefined): string | undefined =>
  typeof value === 'string' ? value : isSample(value) ? value.value : undefined;

/** True if any field in the (deeply nested) data is a SampleField. */
export function hasSample(data: unknown): boolean {
  return countSamples(data) > 0;
}

export function countSamples(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (isSample(data as Field)) return 1;
  let n = 0;
  for (const v of Array.isArray(data) ? data : Object.values(data)) n += countSamples(v);
  return n;
}

/** Throws when the niche is indexable while illustrative figures remain. */
export function assertLaunchReady(opts: { noindex: boolean; data: unknown; label: string }): void {
  const n = countSamples(opts.data);
  if (!opts.noindex && n > 0) {
    throw new Error(
      `[launch guard] ${opts.label}: ${n} illustrative (sample) value(s) remain but the niche is not noindex. ` +
        'Replace every sample(...) with a real, measured value (or todo(...)) before launching.',
    );
  }
}
