/**
 * Site-wide constants for the `wp` niche. Single source for booking, contact and section ids so
 * copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('wp');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const PERSON_NAME = PERSON.name;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('wp', content);
}

/**
 * What the work covers (the offers in decisions.md › wp, and the brief's positioning). Used for
 * JSON-LD knowsAbout. Never add a tool or credential that is not real.
 */
export const TOPICS = [
  'WordPress',
  'WooCommerce',
  'Block themes',
  'WordPress security',
  'Core Web Vitals',
  'WordPress maintenance',
] as const;

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'before-after', label: 'Before / after' },
  { id: 'work', label: 'Case studies' },
  { id: 'services', label: 'Services' },
  { id: 'included', label: 'In every site' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'Before / after', id: 'before-after' },
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];

/** Folio number of a home section ("03"), so every section head is numbered like a page. */
export const folio = (id: SectionId): string =>
  String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0');
