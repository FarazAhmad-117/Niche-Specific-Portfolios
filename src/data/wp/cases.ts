/**
 * Case studies for the wp niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - project-handoff/projects.json (code scan, 2026-11-05) › ai-seo-automator: a multi-tenant
 *    SaaS built for a client, for agencies and freelancers; audit, plan, AI drafts, publishing
 *    as queued jobs; configurable human approval gates; OpenAI / Claude / Gemini credentials per
 *    organisation; a WordPress publishing adapter (Webflow and Shopify planned, not built).
 *    NOT verified: how the adapter talks to WordPress (REST API or plugin), so never described.
 *    Status, users and numbers: NOT FOUND, so TODO chips.
 *  - decisions.md › wp › "Any rebuild / rescue" is open: a dashed placeholder slot on the home
 *    page (see Cases.astro), never a page with invented results.
 *
 * `plugin-heavy-teardown` is an EXAMPLE. It is labelled as illustrative everywhere it appears
 * (card, page, OG image, JSON-LD genre) and describes method, never results.
 *
 * Project-owned values (name, the module list) come from the shared registry
 * (src/person/projects.ts); everything else below is this niche's angle, verbatim. When the
 * person has no `ai-seo-automator` project the case is omitted (Example mode) and the home row
 * shows OWN_PRODUCT_SLOT instead, so the row stays full and no one else's project is shown.
 */
import type { ProjectId } from '../../person/projects';
import { exampleCase, fact, fromProject, modules, present } from '../../person/case-helpers';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { PERSON_NAME } from './site';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['ai-seo-automator'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'ai-seo-automator' | 'plugin-heavy-teardown';

export interface WpCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  /** True for an illustrative case: an "Example" stamp everywhere. */
  readonly example: boolean;
  /** The flow, in order. */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly runsNow: { readonly label: string; readonly text: string };
  /** Things the owner still has to supply (each rendered as a dashed chip). */
  readonly pending: readonly string[];
  readonly seo: { readonly title: string; readonly description: string };
}

/** AI SEO Automator from the registry, with the wp angle (publishing). */
const automator = fromProject(
  'ai-seo-automator',
  (p): WpCase => ({
    id: 'ai-seo-automator',
    name: p.name,
    kicker: 'A product I built · publishing',
    title: 'SEO that runs itself: audited, written, approved and published to WordPress.',
    text: `${p.name} is a multi-tenant SEO platform I built for agencies and freelancers. It audits a site, plans the content, has AI draft it and publishes it to WordPress once the approval gates the team set are passed.`,
    example: false,
    flow: ['Audit the site', 'Plan the content', 'AI draft', 'Human approval', 'Publish to WordPress'],
    facts: ['Publishes approved posts to WordPress', fact(p, 'byok'), 'Webflow and Shopify publishing are planned, not built'],
    problem: {
      title: 'Publishing is the step that never happens',
      text: 'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop. The last mile, getting a finished post onto the site, is where it usually stalls.',
    },
    // The canonical modules; wp words three of them its own way (overrides only where it differs).
    built: modules(p, [
      'crawl',
      'keywords',
      { id: 'publish', title: 'Written and published' },
      'approvals',
      'score',
      'byok',
    ]),
    runsNow: {
      label: 'How it runs',
      text: 'Each organisation connects its own AI provider, sets its approval gates, and the loop audits, writes and publishes, then repeats.',
    },
    pending: ['TODO · Posts published and time saved', 'TODO · Status: live? users?'],
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Approved Publishing to WP`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name} audits a site, plans content, has AI draft it and publishes it to WordPress after human approval.`,
        `Case study: ${p.name} audits a site, writes AI content and publishes it to WordPress after approval.`,
      ),
    },
  }),
);

/** Niche-only illustrative case: no project behind it, always labelled Example. */
const teardown = exampleCase<WpCase>({
  id: 'plugin-heavy-teardown',
  name: 'Anatomy of a plugin-heavy site',
  kicker: 'Example teardown · illustrative',
  title: 'What an audit finds on a site with 47 plugins, and how the fix goes.',
  text: 'An illustrative site built from problems WordPress sites commonly collect: two caching plugins fighting, a security plugin switched off, a page builder with its add-on pack, nine updates nobody dares run. Not a client site; a walk-through of how I audit and fix one.',
  example: true,
  flow: ['Back up and stage', 'Map every plugin', 'Rank the risks', 'Remove, replace, rebuild', 'Speed pass', 'Hand over'],
  facts: [
    'Every plugin listed with what it does and whether anything uses it',
    'Risks ranked before anything is switched off',
    'Fixed on staging, then launched in a quiet hour',
  ],
  problem: {
    title: 'Nobody knows which plugin does what',
    text: 'Forty-seven plugins, and nobody can say which ones the site actually needs. Two caches fight over the same pages, two SEO plugins print two sets of tags, the security plugin was switched off “to test something”, and nine updates have waited for months because the last one broke the homepage.',
  },
  built: [
    { title: 'Back up and copy to staging', text: 'A full backup, then a staging copy. Nothing is changed on the live site until the plan is agreed.' },
    { title: 'Map every plugin', text: 'Each plugin listed with what it does, what depends on it, and whether it loads on every page.' },
    { title: 'Rank the risks', text: 'Security first, then conflicts, then speed. Nothing is removed until we agree the order.' },
    { title: 'Remove, replace, rebuild', text: 'Duplicates go, a slider becomes a core block, the builder layouts become a block theme with patterns your team can edit.' },
    { title: 'Speed pass', text: 'One caching setup, images resized to the size they’re shown, scripts deferred, then checked again.' },
    { title: 'Hand over', text: 'A plugin list with a reason for each, a recorded walkthrough, and a care plan if you want one.' },
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'A lighter site on a block theme, a plugin list where every entry has a reason, and a walkthrough of how to edit it.',
  },
  pending: ['TODO · Replace with a real anonymized rescue or rebuild, with before/after numbers'],
  seo: {
    title: withNameSuffix('WordPress Audit: Example Plugin-Heavy Teardown', PERSON_NAME),
    description:
      'An illustrative WordPress teardown: 47 plugins, two caches, a switched-off security plugin, and how an audit, cleanup and block-theme rebuild fix them.',
  },
});

/** The cases present for this person, in card order (a missing project is dropped). */
export const CASES: readonly WpCase[] = present([automator, teardown]);
export const CASE_SLUGS: readonly CaseSlug[] = CASES.map((c) => c.id);

export const getCase = (slug: string): WpCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring; undefined when the case is the only one (no self-link). */
export function nextCase(slug: CaseSlug): WpCase | undefined {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  return next && next.id !== slug ? next : undefined;
}

/** The open case slot (decisions.md › wp › Case studies: "Any rebuild / rescue"). */
export const CASE_SLOT = {
  kicker: 'Client story · rebuild or rescue',
  title: 'A real WordPress rescue or rebuild.',
  text: 'This slot stays empty until a client clears their site for publishing. No made-up results in the meantime.',
  chips: ['TODO · Client site and permission', 'TODO · Load time before → after', 'TODO · Plugins removed, traffic kept'],
} as const;

/**
 * Example mode: shown in the first home card's place when the person has no publishing product
 * in the registry (no `ai-seo-automator`). A dashed slot, never a link, never a claim.
 */
export const OWN_PRODUCT_SLOT = {
  kicker: 'Own product · publishing',
  title: 'A product of your own that writes or publishes content.',
  text: 'This slot stays empty until a real project is added to src/person/projects.ts. Nothing is shown in its place.',
  chips: ['TODO · Add your own project to src/person/projects.ts', 'TODO · Its WordPress connection, if it has one'],
} as const;
