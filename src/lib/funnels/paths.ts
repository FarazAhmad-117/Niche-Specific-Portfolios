/**
 * Internal paths for the funnels niche. On the home page section links stay bare (#work), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('funnels');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

export function isHome(url: URL): boolean {
  return url.pathname.replace(/\/?$/, '/') === link('/');
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
