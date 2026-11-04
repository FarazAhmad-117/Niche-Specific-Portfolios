/**
 * Site-wide constants for the `ghl` niche. Single source for booking, contact, tools and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('ghl');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const AI_SITE_URL = nicheOrigin('ai');
export const FUNNELS_SITE_URL = nicheOrigin('funnels');
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('ghl', content);
}

/**
 * What the work touches. GoHighLevel is the platform; the rest is the stack the owner
 * actually uses (decisions.md › ai › Stack, docs/research/ai-local.md). Never add one that is
 * not real. The GoHighLevel API and webhooks are the niche's platform and always show; the rest
 * only where the tool is also in src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor(
  ['GoHighLevel API', 'Webhooks', 'n8n', 'Make', 'Zapier', 'Node.js', 'Python', 'MongoDB'] as const,
  ['GoHighLevel API', 'Webhooks'],
);

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'switchboard', label: 'Switchboard' },
  { id: 'work', label: 'Case studies' },
  { id: 'services', label: 'Services' },
  { id: 'included', label: 'In every build' },
  { id: 'process', label: 'Process' },
  { id: 'compare', label: 'Compare' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'Switchboard', id: 'switchboard' },
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
