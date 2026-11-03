/**
 * Facts about the owner. Same sources as the other niches (docs/research/ai-local.md,
 * docs/research/ai-web.md and the owner's own statements: 2022, Lahore, PKT). Nothing here is
 * inferred.
 */
import portrait from '../../assets/shopify/faraz.jpg';

export const PROFILE = {
  name: 'Faraz Ahmad',
  jobTitle: 'Shopify & Full-Stack Developer',
  company: 'Indepth Solution',
  companyRole: 'Founder',
  sinceYear: 2022,
  city: 'Lahore',
  countryCode: 'PK',
  location: 'Lahore, Pakistan',
  timeZone: 'PKT (UTC+5)',
  github: 'https://github.com/FarazAhmad-117',
  /** Real studio portrait from the owner's repo: black and white on black. */
  portrait: {
    src: portrait,
    alt: 'Faraz Ahmad, black and white studio portrait',
  },
} as const;

/** Whole years since the owner started, evaluated at build time. */
export const yearsBuilding = (now: Date = new Date()): number => now.getFullYear() - PROFILE.sinceYear;
