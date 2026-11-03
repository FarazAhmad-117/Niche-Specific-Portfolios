/**
 * Per-page meta. Lengths are asserted at build: title <= 60, description <= 155, so a copy
 * edit that overruns fails the build instead of shipping a truncated snippet.
 * No numbers we have not measured, no ranking promises.
 */
export const HOME_SEO = {
  title: 'Technical SEO Engineer: Fixes in Code | Faraz Ahmad',
  description:
    'Technical SEO audits and fixes in your code, programmatic pages, a human-edited content engine and backlink audits. No bought links. Book a free call.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] seo ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] seo ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
