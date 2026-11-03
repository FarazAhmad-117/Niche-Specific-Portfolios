/**
 * Facts about the owner, from docs/research/ai-local.md only (§3 Bio facts). Nothing here
 * is inferred. The career start year is not in the repo, so experience is stated the way
 * the owner states it: "3+ years of full-stack engineering" (July 2026 brief).
 */
import portrait from '../../assets/apps/faraz.jpg';

export const PROFILE = {
  name: 'Faraz Ahmad',
  jobTitle: 'Full-Stack Engineer & Founder, Indepth Solution',
  company: 'Indepth Solution',
  companyRole: 'Founder',
  experience: '3+ years of full-stack engineering',
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
