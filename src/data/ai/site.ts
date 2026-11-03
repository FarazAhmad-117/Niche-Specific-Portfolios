/**
 * Site-wide constants for the `ai` niche. Single source for booking, contact,
 * stack and section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

export const SITE_ORIGIN = 'https://ai.farazahmad.dev';
export const MAIN_SITE_URL = 'https://farazahmad.dev';
export const PERSON_NAME = 'Faraz Ahmad';
export const BRAND_COMPANY = "Indepth Solution";

export const BOOKING_URL = 'https://calendly.com/farazahmad1/30min';
export const CONTACT_EMAIL = 'farazahmad31048@gmail.com';

/** Booking link with the offer/placement recorded as a UTM, e.g. bookingUrl('audit'). */
export function bookingUrl(content?: string): string {
  const url = new URL(BOOKING_URL);
  url.searchParams.set('utm_source', 'ai');
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

/**
 * Tools actually used: decisions.md plus the owner's own repo and instruction
 * (React, Tailwind CSS and NestJS added on the owner's word). Never add one that is not real.
 */
export const STACK = [
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
] as const;
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
