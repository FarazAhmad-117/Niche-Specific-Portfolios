/**
 * Internal paths for the shopify niche. On the home page section links stay bare (#work), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('shopify');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

/**
 * The build renders every page under /shopify/ while production links have no prefix, so
 * compare the path with the niche prefix removed (not against link('/')).
 */
export function isHome(url: URL): boolean {
  return url.pathname.replace(/^\/shopify(?=\/|$)/, '').replace(/\/?$/, '/') === '/';
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
