/**
 * Site-wide constants for the `wp` niche. Single source for booking, contact and section ids so
 * copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

export const SITE_ORIGIN = 'https://wp.farazahmad.dev';
export const MAIN_SITE_URL = 'https://farazahmad.dev';
export const PERSON_NAME = 'Faraz Ahmad';

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = 'https://calendly.com/farazahmad1/30min';
export const CONTACT_EMAIL = 'farazahmad31048@gmail.com';

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  const url = new URL(BOOKING_URL);
  url.searchParams.set('utm_source', 'wp');
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
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
