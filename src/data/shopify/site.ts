/**
 * Site-wide constants for the `shopify` niche. Single source for booking, contact, tools and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { getProject } from '../../person/case-helpers';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('shopify');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
/** The Yard Terminal project's public link (registry). Undefined when the person has no such project or link. */
export const YARD_TERMINAL_URL: string | undefined = getProject('yard-terminal')?.link?.href;
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('shopify', content);
}

/**
 * What the work touches ("Works with" in About). Shopify is the platform; Shopify Admin API and
 * Webhooks are the integration surface; the rest is the current owner's real stack
 * (docs/research/ai-local.md). Liquid / Online Store 2.0 follow from the decided theme offer:
 * listed in docs/todo/shopify.md for the owner to confirm. This is the owner's own tool list,
 * not derived from any project: a new person keeps only the tools they really work with.
 * The Shopify Admin API and webhooks are the niche's platform and always show; the rest only where
 * the tool is also in src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor(
  ['Liquid', 'Online Store 2.0', 'Shopify Admin API', 'Webhooks', 'Node.js', 'Next.js', 'MongoDB'] as const,
  ['Shopify Admin API', 'Webhooks'],
);

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'teardown', label: 'Store teardown' },
  { id: 'sync', label: 'Sync map' },
  { id: 'work', label: 'Case studies' },
  { id: 'services', label: 'Services' },
  { id: 'included', label: 'In every build' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'Teardown', id: 'teardown' },
  { label: 'Sync', id: 'sync' },
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
