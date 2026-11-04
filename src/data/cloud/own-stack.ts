/**
 * The person's own site, as far as this niche's "own stack" copy may cite it. The cloud copy
 * (the own-stack case, the proof cell, the About paragraph, a FAQ sentence and two tool lines)
 * states the owner's own stack in its own wording: Next.js 16 on MongoDB, Sentry for errors,
 * PostHog for analytics, leads saved before they are sent, a test suite with other checks, and
 * Lighthouse scores. Those lines show only while the registry backs every one of them: the
 * person has an own-site project (kind 'own-site', see findOwnSite) whose stack lists those
 * tools and whose facts carry `testsCount`, `checks`, `lighthouse` and `leadsFirst` (the copy
 * prints the count and checks from the registry). Otherwise OWN_SITE is undefined and the copy
 * drops out. The measurement month in that copy is still the current owner's: a new person whose
 * own site backs the copy must check them. Pure TS (no Astro imports).
 */
import type { Project } from '../../person/projects';
import { findOwnSite } from '../../person/case-helpers';

/** True when the project's stack lists an item starting with `name` ("MongoDB · Mongoose"). */
export const stackHas = (p: Project, name: string): boolean => (p.stack?.items ?? []).some((i) => i.startsWith(name));

/** The stack items and facts the cloud copy cites. */
const CITED_STACK = ['Next.js 16', 'MongoDB', 'Sentry', 'PostHog'] as const;
const CITED_FACTS = ['testsCount', 'checks', 'lighthouse', 'leadsFirst'] as const;

const backsCopy = (p: Project): boolean =>
  CITED_STACK.every((s) => stackHas(p, s)) && CITED_FACTS.every((k) => p.facts[k] !== undefined);

const site = findOwnSite();

/** The own-site project when it backs the cloud niche's own-stack copy; else undefined. */
export const OWN_SITE: Project | undefined = site && backsCopy(site) ? site : undefined;
