/**
 * Site-wide constants for the `seo` niche. Single source for booking, contact and section ids
 * so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

export const SITE_ORIGIN = 'https://seo.farazahmad.dev';
export const MAIN_SITE_URL = 'https://farazahmad.dev';
export const AI_SITE_URL = 'https://ai.farazahmad.dev';
export const PERSON_NAME = 'Faraz Ahmad';

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = 'https://calendly.com/farazahmad1/30min';
export const CONTACT_EMAIL = 'farazahmad31048@gmail.com';

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  const url = new URL(BOOKING_URL);
  url.searchParams.set('utm_source', 'seo');
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
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
