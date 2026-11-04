/**
 * Per-page meta. Lengths are asserted at build: title <= 60, description <= 155, so a copy
 * edit that overruns fails the build instead of shipping a truncated snippet.
 */
import { PERSON_NAME } from './site';
import { withNameSuffix } from '../../lib/shared/seo-title';

export const HOME_SEO = {
  title: withNameSuffix('WordPress Developer: Rescue, Rebuild, Care', PERSON_NAME),
  description:
    'WordPress that’s fast, secure and yours to edit: site health audits, rescues and fixes, custom block-theme rebuilds, speed work and care plans.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] wp ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] wp ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
