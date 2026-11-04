/**
 * Site-wide constants for the `ai` niche. Single source for booking, contact,
 * stack and section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('ai');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the offer/placement recorded as a UTM, e.g. bookingUrl('audit'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('ai', content);
}

/**
 * Tools actually used: decisions.md plus the owner's own repo and instruction
 * (React, Tailwind CSS and NestJS added on the owner's word). Never add one that is not real.
 * Shown only where the tool is also in src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor([
  'n8n',
  'Make',
  'Zapier',
  'GoHighLevel',
  'Claude',
  'OpenAI',
  'Python',
  'MongoDB',
  'Next.js',
  'React',
  'Tailwind CSS',
  'NestJS',
] as const);
export type StackTool = (typeof STACK)[number];

/**
 * Home sections in page order (brief §4, testimonials removed). `id` is the
 * anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 * `label` is the section's rail label. Sections are never numbered.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'build', label: 'What I build' },
  { id: 'work', label: 'Case studies' },
  { id: 'more', label: 'More builds' },
  { id: 'offers', label: 'Services' },
  { id: 'checklist', label: 'Production checklist' },
  { id: 'process', label: 'Process' },
  { id: 'compare', label: 'Comparison' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

/**
 * Primary nav (spec §4.2). Hash links resolve against the home page. Labels say where
 * they lead (owner review): "Case studies", not "Work".
 */
export const NAV_LINKS = [
  { label: 'Case studies', id: 'work' },
  { label: 'Services', id: 'offers' },
  { label: 'About', id: 'about' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
