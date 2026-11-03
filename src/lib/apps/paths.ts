/**
 * Internal paths for the apps niche. On the home page section links stay bare (#work), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('apps');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

/** At build time the path is /apps/... while link('/') is '/' in production, so strip the slug first. */
export function isHome(url: URL): boolean {
  return url.pathname.replace(/^\/apps(?=\/|$)/, '').replace(/\/?$/, '/') === '/';
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
