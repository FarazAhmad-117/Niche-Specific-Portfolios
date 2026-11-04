/**
 * Facts about the owner, for the `ai` niche. The values live in src/person/config.ts (the one
 * file to edit for a new owner); this module only selects them. Nothing here is inferred.
 */
import { PERSON, profileFor } from '../../person/profile';
import type { PersonConfig } from '../../person/schema';

/** Typed as PersonConfig so optional fields (roleLine, country) stay readable when a config omits them. */
const cfg: PersonConfig = PERSON;

export const PROFILE = {
  ...profileFor('ai'),
  /** The owner's own title wording on the main site (config.ts › roleLine). */
  roleLine: cfg.roleLine,
  country: cfg.country,
} as const;

export { yearsBuilding } from '../../person/profile';
