/**
 * Internal paths for the webflow niche. On the home page section links stay bare (#work), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('webflow');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

/**
 * Astro.url.pathname is the BUILD path (/webflow/, /webflow/work/x/) in dev and in production,
 * while link('/') is /webflow/ in dev but / in production. Compare without the niche prefix.
 */
export function isHome(url: URL): boolean {
  return url.pathname.replace(/^\/webflow(?=\/|$)/, '').replace(/\/?$/, '/') === '/';
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
