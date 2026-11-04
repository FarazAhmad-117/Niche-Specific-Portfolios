/**
 * Meta helpers that survive long person, company and project names. Pure TS, no imports.
 */

/** The limits every niche's assertMeta guard enforces (src/data/<niche>/seo.ts). */
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 155;

/**
 * The first variant that fits in `max` characters, else the LAST variant unchanged.
 * Pass the variants from longest (the original wording) to shortest (a shorter wording of the
 * same facts: a clause dropped, never a new claim). Deterministic, never truncates: when nothing
 * fits, the shortest variant is returned as is, so the niche's assertMeta guard still fails the
 * build with its normal `description is N chars (max M)` message.
 *
 *   description: fitDescription(SEO_DESCRIPTION_MAX,
 *     `Case study: ${p.name}, … Lead collection, outreach workflows and nurture sequences.`,
 *     `Case study: ${p.name}, … Lead collection and outreach.`)
 */
export function fitDescription(max: number, ...variants: readonly [string, ...string[]]): string {
  let last = variants[0];
  for (const v of variants) {
    if (v.length <= max) return v;
    last = v;
  }
  return last;
}

/**
 * Builds a `<core> | <name>` page title that survives long person names.
 *
 * Fallback order (first one that fits in `max` characters wins, deterministic):
 *  1. `${core}${sep}${name}`       the full name.
 *  2. `${core}${sep}${firstName}`  first word of the name only, used only if it is shorter
 *                                  than the full name.
 *  3. `core`                       the name suffix is dropped entirely.
 *  4. `core` (unchanged)           nothing fits: it is returned as is, never truncated, so the
 *                                  niche's assertMeta guard fails the build with its normal
 *                                  `title is N chars (max M)` message.
 */
export function withNameSuffix(core: string, name: string, max = 60, sep = ' | '): string {
  const full = `${core}${sep}${name}`;
  if (full.length <= max) return full;

  const trimmed = name.trim();
  const firstName = trimmed.split(/\s+/)[0] ?? '';
  if (firstName && firstName.length < trimmed.length) {
    const short = `${core}${sep}${firstName}`;
    if (short.length <= max) return short;
  }

  return core;
}
