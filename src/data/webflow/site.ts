/**
 * Site-wide constants for the `webflow` niche. Single source for booking, contact, tools and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('webflow');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const PERSON_NAME = PERSON.name;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('webflow', content);
}

/**
 * What the work touches. Webflow is the platform; the rest is the stack the owner actually
 * uses (docs/research/ai-local.md: GSAP + Lenis, JavaScript/Next.js, MongoDB, GoHighLevel,
 * n8n, Make, Zapier) plus Figma, which the offers name. Never add one that is not real.
 * Webflow is the niche's platform and always shows; the rest only where the tool is also in
 * src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor(
  ['Webflow', 'Figma', 'GSAP', 'Lenis', 'JavaScript', 'APIs and webhooks', 'n8n', 'Make', 'Zapier', 'GoHighLevel'] as const,
  ['Webflow'],
);

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'build', label: 'Build system' },
  { id: 'gallery', label: 'Interaction gallery' },
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
  { label: 'Build system', id: 'build' },
  { label: 'Motion', id: 'gallery' },
  { label: 'Work', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
