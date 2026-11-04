/**
 * Facts about the owner, for the `apps` niche. The values live in src/person/config.ts (the one
 * file to edit for a new owner); this module only selects them. Nothing here is inferred.
 * Experience is stated the way the owner states it (config.ts › experience) instead of a start
 * year, so this PROFILE has no sinceYear.
 */
import { PERSON, PORTRAIT, jobTitleFor } from '../../person/profile';
import type { PersonConfig } from '../../person/schema';

/** Typed as PersonConfig so the optional experience stays readable when a config omits it. */
const cfg: PersonConfig = PERSON;

export const PROFILE = {
  name: PERSON.name,
  jobTitle: jobTitleFor('apps'),
  company: PERSON.company,
  companyRole: PERSON.companyRole,
  experience: cfg.experience,
  city: PERSON.city,
  countryCode: PERSON.countryCode,
  location: PERSON.location,
  timeZone: PERSON.timeZone,
  github: PERSON.github,
  portrait: PORTRAIT,
} as const;
