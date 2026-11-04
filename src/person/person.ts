/**
 * The validated owner identity plus the helpers every niche's site.ts derives from.
 *
 * Node-loadable (no image imports, no import.meta.env): site.ts files feed build-time
 * endpoints (OG images, JSON-LD) and must stay free of Astro-only imports. The portrait lives in
 * src/person/profile.ts. Values come from src/person/config.ts; edit them there.
 */
import { PERSON_CONFIG } from './config.ts';
import { validatePersonConfig, type PersonConfig } from './schema.ts';
import { NICHES } from '../niches.ts';

/** Throws at module load (so `astro build` fails) with the field and file to fix. */
export const PERSON = validatePersonConfig(
  PERSON_CONFIG,
  NICHES.map((n) => n.slug),
);

const cfg: PersonConfig = PERSON;

/** Name text of the footer's display signature: config.ts › footerSignature, else the name. */
export const FOOTER_SIGNATURE: string = cfg.footerSignature ?? cfg.name;

/** The job title a niche shows: its jobTitleByNiche override, else the default. */
export function jobTitleFor(slug: string): string {
  const overrides: Readonly<Record<string, string>> = cfg.jobTitleByNiche ?? {};
  return overrides[slug] ?? PERSON.jobTitle;
}

/** Booking link with the niche and placement recorded as UTMs, e.g. bookingUrlFor('ai', 'hero'). */
export function bookingUrlFor(slug: string, content?: string): string {
  const url = new URL(PERSON.bookingUrl);
  url.searchParams.set('utm_source', slug);
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

/** Whole years since the owner started, evaluated at build time. */
export const yearsBuilding = (now: Date = new Date()): number => now.getFullYear() - PERSON.sinceYear;

/** "3+ years" once at least one whole year has passed since sinceYear; undefined in the start year (no "0+ years"). */
export function yearsPlus(now: Date = new Date()): string | undefined {
  const n = yearsBuilding(now);
  return n >= 1 ? `${n}+ years` : undefined;
}

/** " (3+ years)" for "Building since 2022 (3+ years)"; "" in the start year. */
export const yearsSuffix = (now: Date = new Date()): string => {
  const y = yearsPlus(now);
  return y ? ` (${y})` : '';
};
