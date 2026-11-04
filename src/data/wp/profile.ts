/**
 * Facts about the owner, for the `wp` niche. The values live in src/person/config.ts (the one
 * file to edit for a new owner); this module only selects them. Nothing here is inferred.
 */
import { profileFor } from '../../person/profile';

export const PROFILE = profileFor('wp');

export { yearsBuilding } from '../../person/profile';
