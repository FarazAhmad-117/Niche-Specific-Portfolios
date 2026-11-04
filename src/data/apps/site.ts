/**
 * Site-wide constants for the `apps` niche. Single source for booking, contact, stack and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints (OG, JSON-LD).
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('apps');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const AI_SITE_URL = nicheOrigin('ai');
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('apps', content);
}

/**
 * Stack marks for the proof strip. Only what the owner's own repos show
 * (docs/research/ai-local.md › Tech stack). Postgres and AWS from the brief are not
 * verified, so they are not listed (docs/todo/apps.md).
 * Shown only where the tool is also in src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor(['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'Vercel'] as const);

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'spec', label: 'Spec → shipped' },
  { id: 'work', label: 'Case studies' },
  { id: 'services', label: 'Services' },
  { id: 'included', label: 'Always included' },
  { id: 'process', label: 'Process' },
  { id: 'compare', label: 'Comparison' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'Spec → shipped', id: 'spec' },
  { label: 'Work', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
