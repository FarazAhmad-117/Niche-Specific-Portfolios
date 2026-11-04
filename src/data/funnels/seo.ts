/**
 * Per-page meta. Lengths are asserted at build: title <= 60, description <= 155, so a copy
 * edit that overruns fails the build instead of shipping a truncated snippet.
 */
import { PERSON_NAME } from './site';
import { withNameSuffix } from '../../lib/shared/seo-title';

export const HOME_SEO = {
  title: withNameSuffix('Marketing Automation Developer: GHL, n8n', PERSON_NAME),
  description:
    'Email, SMS and CRM follow-up that turns leads into booked calls. Built in GoHighLevel, n8n, Make or Zapier, with the source tracked on every lead.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] funnels ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] funnels ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
