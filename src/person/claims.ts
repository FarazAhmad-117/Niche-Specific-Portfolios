/**
 * Helpers for first-person claims in niche copy (src/person/config.ts › firstName … contactFeedsCrm).
 *
 * Rule for every helper: an unset field never prints the current owner's wording. It returns
 * undefined / an empty list, so the caller drops the clause, uses neutral wording or shows a
 * TODO chip.
 *
 * Node-loadable (no Astro/Vite-only imports), so site.ts files and build-time endpoints can use it.
 */
import { PERSON } from './person.ts';
import type { CredentialKey, ExperienceShort, PersonConfig, Pronouns } from './schema.ts';
import type { NicheSlug } from '../niches.ts';

const cfg: PersonConfig = PERSON;

/** "I’m <FIRST_NAME>, …" */
export const FIRST_NAME: string = cfg.firstName;
/** Short display form (config.ts › shortName), else the first name. */
export const SHORT_NAME: string = cfg.shortName ?? cfg.firstName;

export const DEFAULT_PRONOUNS: Pronouns = { subject: 'they', object: 'them', possessive: 'their' };
/** The owner's pronouns (config.ts › pronouns), else they/them/their. */
export const PRONOUNS: Pronouns = cfg.pronouns ?? DEFAULT_PRONOUNS;
/** pronoun('possessive') → "his" / "their". */
export const pronoun = (kind: keyof Pronouns): string => PRONOUNS[kind];

/** The owner's master tool list (config.ts › stack). */
export const OWNER_STACK: readonly string[] = cfg.stack;
export const usesTool = (tool: string): boolean => cfg.stack.includes(tool);

/**
 * A niche's ordered tool list, filtered to the tools the owner uses. `always` = the niche's
 * own platform (niche content, not a personal claim), kept regardless.
 *   stackFor(['n8n', 'Make', 'Python'] as const)  →  the same order, minus tools not in config.stack
 */
export function stackFor<const T extends string>(list: readonly T[], always: readonly T[] = []): readonly T[] {
  return list.filter((t) => always.includes(t) || usesTool(t));
}

/** ["a"] → "a", ["a","b"] → "a and b", ["a","b","c"] → "a, b and c" (no serial comma). */
export function andList(items: readonly string[], conj: 'and' | 'or' = 'and'): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;
}

/** Letters whose spoken name starts with a vowel sound: "an FAQ", "an SEO audit", "an HTML page". */
const AN_LETTERS = /^[AEFHILMNORSX]/;
/** Words that start with a vowel letter but a consonant sound, and the reverse. */
const A_WORDS = /^(uni|use|user|usu|one\b|once\b|eu)/i;
const AN_WORDS = /^(hour|honest|honor|honour|heir)/i;

/**
 * "senior engineer" → "a senior engineer", "engineer" → "an engineer".
 * Exceptions: "an hour", "an honest", "a user", "a unique", "a one-off", "a European";
 * an all-caps acronym is read letter by letter: "an SEO engineer", "a CTO", "an MBA holder".
 */
export function withArticle(phrase: string): string {
  const first = phrase.split(/[\s-]/)[0] ?? '';
  let an: boolean;
  if (first.length > 1 && /^[A-Z0-9]+$/.test(first) && /[A-Z]/.test(first)) an = AN_LETTERS.test(first);
  else if (AN_WORDS.test(phrase)) an = true;
  else if (A_WORDS.test(phrase)) an = false;
  else an = /^[aeiou]/i.test(phrase);
  return `${an ? 'an' : 'a'} ${phrase}`;
}

/**
 * A role title mid-sentence: every word lowercased at its first letter except all-caps acronyms.
 * "Founder" → "founder", "Lead Engineer" → "lead engineer", "Co-Founder" → "co-founder",
 * "Founder & CEO" → "founder & CEO", "CTO" → "CTO".
 */
export const roleInSentence = (role: string): string =>
  role
    .split(/([\s-]+)/)
    .map((w) => (w === w.toUpperCase() ? w : w.charAt(0).toLowerCase() + w.slice(1)))
    .join('');

/** config.ts › companyRole mid-sentence (see roleInSentence). */
export const ROLE_IN_SENTENCE: string = roleInSentence(cfg.companyRole);

/**
 * The verb for "I <verb> <company>" when config.ts › companyRole says the person founded it:
 * "co-founded" for a co-founder role, "founded" for any other founder role ("Founder", "Founder & CEO"),
 * undefined otherwise (the copy then names the role instead of claiming the company was founded).
 */
export const FOUNDED_VERB: 'founded' | 'co-founded' | undefined = /\bco-?founder\b/i.test(cfg.companyRole)
  ? 'co-founded'
  : /\bfounder\b/i.test(cfg.companyRole)
    ? 'founded'
    : undefined;

/** "full-stack engineer" → "Full-stack engineer". */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** config.ts › profession ("full-stack engineer"), or undefined. */
export const PROFESSION: string | undefined = cfg.profession;
/** config.ts › seniority ("senior"), or undefined. */
export const SENIORITY: string | undefined = cfg.seniority;
/** config.ts › careerLine, or undefined. */
export const CAREER_LINE: string | undefined = cfg.careerLine;
/** config.ts › experienceShort, or undefined. */
export const EXPERIENCE_SHORT: ExperienceShort | undefined = cfg.experienceShort;

/** "senior" + "engineer" → "senior engineer"; no seniority → "engineer". */
export const seniorNoun = (noun: string): string => (SENIORITY ? `${SENIORITY} ${noun}` : noun);

/** Partner / certification status: true, false, or undefined (unknown). */
export const credential = (key: CredentialKey): boolean | undefined => cfg.credentials?.[key];

/**
 * Picks the copy for a credential state: false → `denied` (the "No, I hold no …" wording),
 * true → `confirmed`, unknown → undefined (leave the entry out).
 */
export function credentialAnswer<T>(state: boolean | undefined, answers: { readonly denied: T; readonly confirmed: T }): T | undefined {
  if (state === undefined) return undefined;
  return state ? answers.confirmed : answers.denied;
}

/** The niche's origin story (config.ts › originStories), normalised; undefined when absent. */
export function originStory(slug: NicheSlug): { readonly text: string; readonly title?: string } | undefined {
  const s = cfg.originStories?.[slug];
  if (s === undefined) return undefined;
  return typeof s === 'string' ? { text: s } : s;
}

/** config.ts › supportHours ("8AM–5PM EST"), or undefined: the hours lines are left out. */
export const SUPPORT_HOURS: string | undefined = cfg.supportHours;

/** The contact form posts into the owner's own CRM (config.ts › contactFeedsCrm). */
export const CONTACT_FEEDS_CRM: boolean = cfg.contactFeedsCrm === true;

/** Joins the non-empty sentence parts with one space ("" / undefined parts are dropped). */
export const sentences = (...parts: readonly (string | undefined | false)[]): string =>
  parts.filter((p): p is string => typeof p === 'string' && p !== '').join(' ');
