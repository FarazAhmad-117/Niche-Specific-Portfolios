/**
 * Per-page meta. Lengths are asserted at build: title <= 60, description <= 155, so a copy
 * edit that overruns fails the build instead of shipping a truncated snippet.
 */
export const HOME_SEO = {
  title: 'Shopify Developer: Speed, Themes, Sync | Faraz Ahmad',
  description:
    'A faster Shopify store with fewer apps: speed and app audits, theme builds, custom features and marketplace sync. Shopify Plus in scope.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] shopify ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] shopify ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
