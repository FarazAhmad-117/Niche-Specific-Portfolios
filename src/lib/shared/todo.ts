/**
 * Missing-input helper for any niche. A value the owner has not provided yet must render as a
 * visible dashed `TODO · <label>` chip (src/components/shared/Todo.astro), never as invented
 * copy. Node-loadable: no imports.
 *
 *   const linkedin = orTodo(PERSON.linkedin, 'add LinkedIn URL');
 *   {isTodoValue(linkedin) ? <Todo label={linkedin.todo} /> : <a href={linkedin.value}>…</a>}
 */

export type OrTodo<T> = { readonly value: T } | { readonly todo: string };

/** `{ value }` when the value is present (not undefined/null/blank string), else `{ todo: label }`. */
export function orTodo<T>(value: T | null | undefined, label: string): OrTodo<T> {
  if (value === undefined || value === null) return { todo: label };
  if (typeof value === 'string' && value.trim() === '') return { todo: label };
  return { value };
}

export const isTodoValue = <T>(v: OrTodo<T>): v is { readonly todo: string } => 'todo' in v;
