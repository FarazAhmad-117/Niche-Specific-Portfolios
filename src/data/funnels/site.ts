/**
 * Site-wide constants for the `funnels` niche. Single source for booking, contact, tools
 * and section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

export const SITE_ORIGIN = 'https://funnels.farazahmad.dev';
export const MAIN_SITE_URL = 'https://farazahmad.dev';
export const AI_SITE_URL = 'https://ai.farazahmad.dev';
export const PERSON_NAME = 'Faraz Ahmad';
export const BRAND_COMPANY = 'Indepth Solution';

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = 'https://calendly.com/farazahmad1/30min';
export const CONTACT_EMAIL = 'farazahmad31048@gmail.com';

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  const url = new URL(BOOKING_URL);
  url.searchParams.set('utm_source', 'funnels');
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

/** decisions.md › funnels › "Tools you support". Never add one that is not real. */
export const TOOLS = ['GoHighLevel', 'n8n', 'Make', 'Zapier'] as const;

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
