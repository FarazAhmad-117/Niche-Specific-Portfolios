import { getNiche, nicheOrigin, type NicheSlug } from '../niches';

/**
 * Builders for the per-niche robots.txt and sitemap.xml endpoints.
 * Each niche's endpoint file is a two-liner that calls these.
 */

/** Turn import.meta.glob keys ('./index.astro', './work/index.astro') into URL paths. */
export function pagePaths(globKeys: string[]): string[] {
  return globKeys
    .map((key) => key.replace(/^\.\//, '').replace(/\.astro$/, ''))
    .filter((p) => !p.includes('['))
    .map((p) => p.replace(/(^|\/)index$/, ''))
    .map((p) => (p === '' ? '/' : `/${p}/`))
    .sort();
}

/**
 * `extraPaths` covers dynamic routes (`[slug].astro`), which the glob can't
 * enumerate; pass their resolved paths ('/work/lead-drift/').
 */
export function sitemapResponse(
  slug: NicheSlug,
  globKeys: string[],
  extraPaths: readonly string[] = [],
): Response {
  const origin = nicheOrigin(slug);
  const paths = [...new Set([...pagePaths(globKeys), ...extraPaths])].sort();
  const urls = paths
    .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

/** While the niche's noindex switch is on: Disallow everything, no Sitemap line. */
export function robotsResponse(slug: NicheSlug): Response {
  const body = getNiche(slug).noindex
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${nicheOrigin(slug)}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
