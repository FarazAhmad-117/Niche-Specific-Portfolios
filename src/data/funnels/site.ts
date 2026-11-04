/**
 * Site-wide constants for the `funnels` niche. Single source for booking, contact, tools
 * and section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('funnels');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const AI_SITE_URL = nicheOrigin('ai');
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('funnels', content);
}

/**
 * decisions.md › funnels › "Tools you support". Never add one that is not real. Feeds About
 * "Builds in" and JSON-LD knowsAbout, only where the tool is also in src/person/config.ts › stack.
 */
export const TOOLS = stackFor(['GoHighLevel', 'n8n', 'Make', 'Zapier'] as const);

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'follow', label: 'Follow a lead' },
  { id: 'leaks', label: 'Leak estimate' },
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
  { label: 'Follow a lead', id: 'follow' },
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
