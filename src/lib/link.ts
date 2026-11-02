import type { NicheSlug } from '../niches';

/**
 * Link helper.
 *
 * Every niche is built under /<slug>/ but served from the root of
 * <slug>.farazahmad.dev, so internal links differ per environment:
 *
 *   dev         link('/about')  ->  /<slug>/about/
 *   production  link('/about')  ->  /about/
 *
 * Usage (once per page/layout/component, bound to the niche):
 *   const link = createLink('ai');
 *   <a href={link('/about')}>About</a>
 *
 * Paths are normalised to the site-wide trailingSlash: 'always' rule (files
 * with an extension, #hash-only, query and external URLs are left alone).
 */
export type LinkFn = (path?: string) => string;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function normalise(path: string): string {
  const match = /^([^?#]*)(.*)$/.exec(path);
  let pathname = match?.[1] ?? '';
  const suffix = match?.[2] ?? '';

  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  const last = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (!pathname.endsWith('/') && !last.includes('.')) pathname += '/';
  return pathname + suffix;
}

export function createLink(slug: NicheSlug): LinkFn {
  return (path = '/') => {
    // Pure anchors, mailto:, tel:, https://... pass through untouched.
    if (path.startsWith('#') || EXTERNAL.test(path)) return path;
    const clean = normalise(path);
    return import.meta.env.DEV ? `/${slug}${clean}` : clean;
  };
}
