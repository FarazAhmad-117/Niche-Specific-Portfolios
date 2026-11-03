/**
 * Facts about the owner. Same sources as the other niches (docs/research/ai-local.md and the
 * owner's own statements used by src/data/ghl/profile.ts: 2022, Lahore, PKT). Nothing here is
 * inferred. The portrait is the real studio shot, copied into src/assets/wp/.
 */
import portrait from '../../assets/wp/faraz.jpg';

export const PROFILE = {
  name: 'Faraz Ahmad',
  jobTitle: 'Full-Stack Engineer & Automation Expert',
  company: 'Indepth Solution',
  companyRole: 'Founder',
  sinceYear: 2022,
  city: 'Lahore',
  countryCode: 'PK',
  location: 'Lahore, Pakistan',
  timeZone: 'PKT (UTC+5)',
  github: 'https://github.com/FarazAhmad-117',
  portrait: {
    src: portrait,
    alt: 'Faraz Ahmad, black and white studio portrait',
  },
} as const;

/** Whole years since the owner started, evaluated at build time. */
export const yearsBuilding = (now: Date = new Date()): number => now.getFullYear() - PROFILE.sinceYear;
