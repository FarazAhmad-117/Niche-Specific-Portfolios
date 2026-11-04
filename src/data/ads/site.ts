/**
 * Site-wide constants for the `ads` niche. Single source for booking, contact, platforms and
 * section ids so copy, nav, JSON-LD and anchors can never drift.
 * Keep free of Astro-only imports: it is also used by build-time endpoints.
 */

import { nicheOrigin } from '../../niches';
import { PERSON, bookingUrlFor } from '../../person/person';
import { credential, stackFor } from '../../person/claims';
// Owner identity comes from src/person/config.ts; edit it there, not here.

export const SITE_ORIGIN = nicheOrigin('ads');
export const MAIN_SITE_URL = PERSON.mainSiteUrl;
export const PERSON_NAME = PERSON.name;
export const BRAND_COMPANY = PERSON.company;

/** decisions.md › global › Contact & booking. */
export const BOOKING_URL = PERSON.bookingUrl;
export const CONTACT_EMAIL = PERSON.email;

/** Booking link with the placement recorded as a UTM, e.g. bookingUrl('hero'). */
export function bookingUrl(content?: string): string {
  return bookingUrlFor('ads', content);
}

/** decisions.md › ads › Platforms supported. No partner status, no badges. */
export const PLATFORMS = ['Meta', 'Google Ads', 'TikTok', 'LinkedIn'] as const;

/**
 * decisions.md › ads › Minimum monthly ad spend: "500 at least". The currency is not stated,
 * so it is never shown with a symbol (TODO chip where it appears, docs/todo/ads.md).
 */
export const MIN_SPEND = 500;
export const MIN_SPEND_LINE = '500 a month in ad spend';
export const MIN_SPEND_TODO = 'TODO · Confirm the currency (USD?)';

/**
 * The tools the owner actually uses (decisions.md › ai › Stack, docs/research/ai-local.md).
 * Never add one that is not real; ad-platform APIs are named by platform, not by product.
 * Shown only where the tool is also in src/person/config.ts › stack (stackFor).
 */
export const STACK = stackFor(['n8n', 'Make', 'Zapier', 'Python', 'Node.js', 'MongoDB', 'GoHighLevel'] as const);

/** Partner status per platform (config.ts › credentials): true / false / undefined = unknown. */
export const PARTNER_STATUS = [
  { platform: 'Google', held: credential('googleAdsPartner') },
  { platform: 'Meta', held: credential('metaPartner') },
] as const;

/**
 * Home sections in page order (brief §4, testimonials omitted per decisions).
 * `id` is the anchor and the `<section id>`; the h2 inside uses `${id}-title`.
 */
export const SECTIONS = [
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'The problem' },
  { id: 'rules', label: 'Rules engine' },
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
  { label: 'Rules engine', id: 'rules' },
  { label: 'Cases', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'Process', id: 'process' },
  { label: 'FAQ', id: 'faq' },
] as const satisfies readonly { label: string; id: SectionId }[];
