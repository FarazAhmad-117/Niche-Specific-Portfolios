/**
 * Internal paths for the cloud niche. On the home page section links stay bare (#work), so
 * Lenis handles them in place; on any other page they point back to the home section.
 */
import { createLink } from '../link';

export const link = createLink('cloud');

export const caseHref = (slug: string): string => link(`/work/${slug}`);

/** At build time the path is /cloud/... while link('/') is '/' in production, so strip the slug first. */
export function isHome(url: URL): boolean {
  return url.pathname.replace(/^\/cloud(?=\/|$)/, '').replace(/\/?$/, '/') === '/';
}

export function sectionHref(url: URL, id: string): string {
  return isHome(url) ? `#${id}` : `${link('/')}#${id}`;
}
