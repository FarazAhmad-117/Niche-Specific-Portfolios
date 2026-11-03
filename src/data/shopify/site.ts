/**
 * Site-wide constants for the `shopify` niche. Single source for booking, contact, tools and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

export const SITE_ORIGIN = 'https://shopify.farazahmad.dev';
export const MAIN_SITE_URL = 'https://farazahmad.dev';
export const YARD_TERMINAL_URL = 'https://yardterminal.com';
export const PERSON_NAME = 'Faraz Ahmad';
export const BRAND_COMPANY = 'Indepth Solution';

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = 'https://calendly.com/farazahmad1/30min';
export const CONTACT_EMAIL = 'farazahmad31048@gmail.com';

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  const url = new URL(BOOKING_URL);
  url.searchParams.set('utm_source', 'shopify');
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

/**
 * What the work touches. Shopify is the platform; Admin API and webhooks are what Yard
 * Terminal's Shopify channel runs on; the rest is the owner's real stack
 * (docs/research/ai-local.md). Liquid / Online Store 2.0 follow from the decided theme offer:
 * listed in docs/todo/shopify.md for the owner to confirm.
 */
export const STACK = ['Liquid', 'Online Store 2.0', 'Shopify Admin API', 'Webhooks', 'Node.js', 'Next.js', 'MongoDB'] as const;

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
