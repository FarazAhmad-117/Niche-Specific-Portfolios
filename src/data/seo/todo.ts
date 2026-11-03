/**
 * Values the owner still has to supply. The seo niche uses no illustrative "sample" numbers at
 * all: a value is either a verified fact (string) or a visible placeholder (TodoField).
 *
 *  - string     real, owner-approved text or a fact from decisions.md / the owner's repo
 *  - TodoField  missing; renders as a dashed `TODO · …` chip (components/seo/Todo.astro)
 *
 * textOf() drops placeholders, so they can never reach meta tags, OG images or JSON-LD.
 * Every id is listed in docs/todo/seo.md.
 */
export interface TodoField {
  readonly todo: true;
  /** Stable id, dotted path: `case.ai-seo-automator.pages`. */
  readonly id: string;
  /** What the owner needs to provide, shown in the chip. */
  readonly label: string;
}

export type Field = string | TodoField;

export const todo = (id: string, label: string): TodoField => ({ todo: true, id, label });

export const isTodo = (value: Field | null | undefined): value is TodoField =>
  typeof value === 'object' && value !== null && 'todo' in value;

/** Text safe for machine-readable output: only real strings, never a placeholder. */
export const textOf = (value: Field | null | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;
