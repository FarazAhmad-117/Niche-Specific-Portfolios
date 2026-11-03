/**
 * Internal paths for the ads niche. On the home page section links stay bare (#rules), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('ads');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

/**
 * Astro.url.pathname is the BUILD path (/ads/, /ads/work/x/) in dev and in production, while
 * link('/') is /ads/ in dev but / in production. Compare without the niche prefix.
 */
export function isHome(url: URL): boolean {
  return url.pathname.replace(/^\/ads(?=\/|$)/, '').replace(/\/?$/, '/') === '/';
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
