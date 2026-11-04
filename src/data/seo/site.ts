/**
 * Site-wide constants for the `seo` niche. Single source for booking, contact and section ids
 * so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('seo');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const AI_SITE_URL = nicheOrigin('ai');
export const PERSON_NAME = PERSON.name;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('seo', content);
}

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'growth', label: 'How growth looks' },
  { id: 'engine', label: 'The engine' },
  { id: 'work', label: 'Case studies' },
  { id: 'backlinks', label: 'Backlinks' },
  { id: 'services', label: 'Services' },
  { id: 'safe', label: 'How I keep it safe' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'How it grows', id: 'growth' },
  { label: 'Engine', id: 'engine' },
  { label: 'Work', id: 'work' },
  { label: 'Backlinks', id: 'backlinks' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
