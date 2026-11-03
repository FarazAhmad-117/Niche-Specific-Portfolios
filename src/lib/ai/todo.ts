/**
 * Build-time registry of open placeholders (spec §4.8). Every <Todo> registers
 * its id; each new id is reported once with console.warn during dev/build, and
 * getTodos() returns the full list (e.g. for a dev-only /__todo/ page).
 */

export interface TodoEntry {
  id: string;
  label: string;
  /** Pages (pathnames) that render this TODO. */
  pages: string[];
}

const registry = new Map<string, TodoEntry>();

export function registerTodo(id: string, label: string, page?: string): void {
  const existing = registry.get(id);
  if (existing) {
    if (page && !existing.pages.includes(page)) existing.pages.push(page);
    return;
  }
  registry.set(id, { id, label, pages: page ? [page] : [] });
  console.warn(`[todo] ${id}: ${label}${page ? `  (${page})` : ''}`);
}

export function getTodos(): TodoEntry[] {
  return [...registry.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/** Stable id from a label when the caller gives none: "add measured number" -> "add-measured-number". */
export function todoIdFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
