/**
 * Which "Clouds & tools" lines this person's page may print. data/cloud/site.ts › TOOLS_VERIFIED
 * keeps two literal claims about the current owner's own stack (Sentry on his main site; MongoDB
 * under his main site and Yard Terminal). They are true only while the registry backs them, so
 * each shows only when every project it names is in src/person/projects.ts, under the name the
 * line uses, with that tool in its stack (the main site through data/cloud/own-stack.ts). For the
 * current owner every line shows and the list is unchanged. Lines that name no project (Vercel:
 * this repo's hosting; GitHub: the person's own profile) always show.
 *
 * When lines drop out, extra TODO chips keep the strip in complete rows of four.
 * Pure TS (no Astro imports): the JSON-LD builder uses it too.
 */
import type { Project } from '../../person/projects';
import { getProject, slotsToFill } from '../../person/case-helpers';
import { OWN_SITE, stackHas } from '../../data/cloud/own-stack';
import { TOOLS_TODO, TOOLS_VERIFIED } from '../../data/cloud/site';

type Tool = (typeof TOOLS_VERIFIED)[number];

/** The projects each owner-stack claim is about (tool name → projects, undefined = absent). */
const CLAIMS: Readonly<Record<string, readonly (Project | undefined)[]>> = {
  Sentry: [OWN_SITE],
  MongoDB: [OWN_SITE, getProject('yard-terminal')],
};

/** A claim shows only when every project it names is present, named as the line says, with the tool in its stack. */
const backed = (t: Tool): boolean =>
  (CLAIMS[t.name] ?? []).every((p) => p !== undefined && t.where.includes(p.name) && stackHas(p, t.name));

export const SHOWN_TOOLS: readonly Tool[] = TOOLS_VERIFIED.filter(backed);

/** The chip that stands in for a dropped claim line. */
const STAND_IN: Readonly<Record<string, string>> = {
  Sentry: 'TODO · error monitoring you run',
  MongoDB: 'TODO · database you run',
};
const standIns = TOOLS_VERIFIED.filter((t) => !backed(t)).map((t) => STAND_IN[t.name] ?? 'TODO · another tool you use in production');

/** TOOLS_TODO plus enough extra chips to complete the last row of four (none for the owner). */
export const SHOWN_TOOLS_TODO: readonly string[] = [
  ...TOOLS_TODO,
  ...Array.from(
    { length: slotsToFill(SHOWN_TOOLS.length + TOOLS_TODO.length, 4) },
    (_, i) => standIns[i] ?? 'TODO · another tool you use in production',
  ),
];
