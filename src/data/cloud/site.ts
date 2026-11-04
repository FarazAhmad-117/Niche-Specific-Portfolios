/**
 * Site-wide constants for the `cloud` niche. Single source for booking, contact, tools and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: build-time endpoints use it too.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('cloud');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/**
 * Support hours (src/person/config.ts › supportHours), e.g. "8AM–5PM EST". Business hours, not a
 * 24/7 pager. Undefined when unset: the hours lines drop out and the copy says "business hours".
 */
export { SUPPORT_HOURS } from '../../person/claims';

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('cloud', content);
}

/**
 * Tools the research proves are in use (docs/research/ai-local.md, README.md of this repo).
 * Clouds and certifications are OPEN in decisions.md: they stay TODO until the owner confirms.
 */
export const TOOLS_VERIFIED = [
  { name: 'Vercel', where: 'These niche sites are built to run on it: one project, a subdomain each' },
  { name: 'GitHub', where: `Where the code lives: ${PERSON.github.replace(/^https:\/\//, '')}` },
  // The two lines below are claims about the current owner's own stack (main site), not
  // identity, so they stay literal on purpose. Never print TOOLS_VERIFIED directly: pages and
  // JSON-LD read lib/cloud/tools.ts › SHOWN_TOOLS, which keeps each line only while the
  // registry projects it names (by name) are present with that tool in their stack.
  { name: 'Sentry', where: 'Error monitoring on farazahmad.dev' },
  { name: 'MongoDB', where: 'Data layer of farazahmad.dev and Yard Terminal' },
] as const;

export const TOOLS_TODO = [
  'TODO · confirm clouds you use (AWS? GCP? Azure?)',
  'TODO · infra-as-code tool',
  'TODO · CI runner',
  'TODO · certifications (or none)',
] as const;

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'board', label: 'Status board' },
  { id: 'leaks', label: 'Where bills leak' },
  { id: 'work', label: 'Case studies' },
  { id: 'services', label: 'Services' },
  { id: 'included', label: 'In every engagement' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const NAV_LINKS = [
  { label: 'Status board', id: 'board' },
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
