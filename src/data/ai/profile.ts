/**
 * Facts about the owner. Each line is either owner-stated (2022, Lahore, PKT) or taken from
 * the owner's own repo/site (docs/research/ai-local.md). Nothing here is inferred.
 */
import portrait from '../../assets/ai/faraz.jpg';

export const PROFILE = {
  name: 'Faraz Ahmad',
  /** The owner's own title wording on farazahmad.dev. */
  roleLine: 'Automation expert · Full-stack engineer',
  jobTitle: 'Automation Expert & Full-Stack Engineer',
  company: 'Indepth Solution',
  companyRole: 'Founder',
  /** Owner-stated. */
  sinceYear: 2022,
  city: 'Lahore',
  country: 'Pakistan',
  countryCode: 'PK',
  location: 'Lahore, Pakistan',
  timeZone: 'PKT (UTC+5)',
  github: 'https://github.com/FarazAhmad-117',
  /** Real studio portrait from the owner's repo: black and white on a solid black background. */
  portrait: {
    src: portrait,
    alt: 'Faraz Ahmad, black and white studio portrait',
  },
} as const;

/** Whole years since the owner started, evaluated at build time. */
export const yearsBuilding = (now: Date = new Date()): number => now.getFullYear() - PROFILE.sinceYear;
