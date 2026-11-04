/**
 * The template's ORIGINAL owner (Faraz Ahmad) and his projects, as search tokens.
 *
 * One list, two readers: `npm run check:leaks` scans a finished build (and src/ with --src) for all
 * of them; `npm run check:person` scans src/ for the identity ones, so leftovers are found even
 * after `init:person` replaced the config (a scan built only from the NEW config can never see the
 * old owner). Fixed on purpose: never derive it from src/person/config.ts.
 *
 * group:
 *   identity       who he is: name, domain, handles, places, time zone, hours. Scanned in src/ by check:person.
 *   project-name   a project's display name (scanned in src/ code lines by check:person).
 *   generic        also appears innocently elsewhere (gmail.com); build scan only.
 *   stack          tools and figures his own site cites; build scan only.
 *   project-id     project ids / slugs: they are the registry keys the niche angles are written for, so
 *                  they stay in the code on purpose; build scan only.
 *
 * Node loads this file directly (native TypeScript type stripping). No imports.
 */
export type OwnerTokenGroup = 'identity' | 'project-name' | 'generic' | 'stack' | 'project-id';

export const OWNER_TOKENS: readonly { readonly token: string; readonly group: OwnerTokenGroup }[] = [
  // identity
  { token: 'Faraz', group: 'identity' },
  { token: 'farazahmad', group: 'identity' },
  { token: 'Lahore', group: 'identity' },
  { token: 'Pakistan', group: 'identity' },
  { token: 'PKT', group: 'identity' },
  { token: 'UTC+5', group: 'identity' },
  { token: 'Indepth', group: 'identity' },
  { token: 'FarazAhmad-117', group: 'identity' },
  { token: 'calendly.com/farazahmad1', group: 'identity' },
  { token: 'gmail.com', group: 'generic' },
  { token: 'cupupmarketing', group: 'identity' },
  { token: '8AM–5PM', group: 'identity' },
  { token: 'Next.js 16', group: 'stack' },
  { token: '257', group: 'stack' },
  { token: 'Sentry', group: 'stack' },
  { token: 'PostHog', group: 'stack' },
  // projects
  { token: 'Yard Terminal', group: 'project-name' },
  { token: 'yard-terminal', group: 'project-id' },
  { token: 'yardterminal', group: 'project-id' },
  { token: 'SolidMake', group: 'project-name' },
  { token: 'solidmake', group: 'project-id' },
  { token: 'AI SEO Automator', group: 'project-name' },
  { token: 'ai-seo-automator', group: 'project-id' },
  { token: 'Lead Drift', group: 'project-name' },
  { token: 'lead-drift', group: 'project-id' },
  { token: 'Leadrift', group: 'project-name' },
  { token: 'leadrift', group: 'project-id' },
  { token: 'lead-pipeline', group: 'project-id' },
  { token: 'lead pipeline', group: 'project-id' },
  { token: 'farazahmad.dev lead pipeline', group: 'project-id' },
];

/** Every token, in list order (what `npm run check:leaks` scans by default). */
export const DEFAULT_TOKENS: readonly string[] = OWNER_TOKENS.map((t) => t.token);

/** The tokens of the given groups. */
export const ownerTokens = (...groups: OwnerTokenGroup[]): string[] =>
  OWNER_TOKENS.filter((t) => groups.includes(t.group)).map((t) => t.token);
