/**
 * Astro-side owner profile: the validated identity (src/person/person.ts) plus the portrait
 * image. Every niche's src/data/<slug>/profile.ts derives its PROFILE from profileFor().
 *
 * The portrait keeps its source filename (faraz.jpg) for now: Astro names the built image after
 * it, so renaming changes the output. Swap the photo by replacing the file (and portraitAlt in
 * config.ts).
 */
import portraitSrc from './assets/faraz.jpg';
import { PERSON, jobTitleFor } from './person.ts';

export { PERSON, jobTitleFor, bookingUrlFor, yearsBuilding } from './person.ts';

/** The owner's portrait: the image and its alt text (config.ts › portraitAlt). */
export const PORTRAIT = {
  src: portraitSrc,
  alt: PERSON.portraitAlt,
} as const;

/** The PROFILE shape the niches share, with the niche's job title. */
export function profileFor(slug: string) {
  return {
    name: PERSON.name,
    jobTitle: jobTitleFor(slug),
    company: PERSON.company,
    companyRole: PERSON.companyRole,
    sinceYear: PERSON.sinceYear,
    city: PERSON.city,
    countryCode: PERSON.countryCode,
    location: PERSON.location,
    timeZone: PERSON.timeZone,
    github: PERSON.github,
    portrait: PORTRAIT,
  } as const;
}
