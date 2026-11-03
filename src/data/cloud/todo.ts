/**
 * One shape for "a value the owner has not supplied yet". A `Field` is either a verified string
 * or a TODO, which renders as a dashed chip and is never written into meta, OG or JSON-LD.
 * Every TODO here is listed in docs/todo/cloud.md.
 */
export interface Todo {
  readonly todo: string;
}
export type Field = string | Todo;

export const todo = (label: string): Todo => ({ todo: label });
export const isTodo = (f: Field): f is Todo => typeof f !== 'string';

/** Plain text for places that cannot show a chip (aria labels, alt text). */
export const fieldText = (f: Field): string => (isTodo(f) ? `To be confirmed (${f.todo})` : f);

/** The build refuses to go indexable while any baseline TODO remains in the given data. */
export function assertLaunchReady(opts: { noindex: boolean; data: unknown; label: string }): void {
  if (opts.noindex) return;
  const json = JSON.stringify(opts.data);
  // Structured TODOs ({ todo }) and TODO chips written as plain strings ("TODO · ...").
  const found = (json.match(/"todo":/g)?.length ?? 0) + (json.match(/TODO/g)?.length ?? 0);
  if (found > 0) {
    throw new Error(`[cloud] ${opts.label}: ${found} TODO value(s) remain while noindex is off. See docs/todo/cloud.md.`);
  }
}
