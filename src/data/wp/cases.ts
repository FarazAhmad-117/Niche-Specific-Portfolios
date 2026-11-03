/**
 * Case studies for the wp niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - docs/research/ai-local.md › AI SEO Automator, and src/data/ai/cases.ts: a self-serve
 *    platform; bring-your-own AI API key; deep scraping and site audits; competitor discovery,
 *    research, backlinks and alerts when competitors publish; keyword research; AI content
 *    generated and published straight to the site; a live site health score.
 *    NOT verified there: that the site it publishes to is WordPress, or how (REST API, plugin).
 *    decisions.md › wp lists the case as "AI SEO Automator → WordPress publishing", so the
 *    WordPress link is shown as a TODO chip to confirm, never described.
 *    Status, users and numbers: NOT FOUND, so TODO chips.
 *  - decisions.md › wp › "Any rebuild / rescue" is open: a dashed placeholder slot on the home
 *    page (see Cases.astro), never a page with invented results.
 *
 * `plugin-heavy-teardown` is an EXAMPLE. It is labelled as illustrative everywhere it appears
 * (card, page, OG image, JSON-LD genre) and describes method, never results.
 */

export const CASE_SLUGS = ['ai-seo-automator', 'plugin-heavy-teardown'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

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

export const CASES: readonly WpCase[] = [
  {
    id: 'ai-seo-automator',
    name: 'AI SEO Automator',
    kicker: 'My own product · publishing',
    title: 'SEO that runs itself: audited, written and published straight to the site.',
    text: 'AI SEO Automator is my self-serve platform for site owners who want SEO on autopilot. It scrapes and audits a site, finds competitors, researches keywords, writes AI content and publishes it straight to the site, using the owner’s own AI API key.',
    example: false,
    flow: ['Scrape and audit', 'Competitors and keywords', 'AI content', 'Publish to the site', 'Live health score'],
    facts: [
      'Publishes AI-written content straight to the site',
      'Runs on the owner’s own AI API key',
      'Audits the site and keeps a live health score',
    ],
    problem: {
      title: 'Publishing is the step that never happens',
      text: 'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop. The last mile, getting a finished post onto the site, is where it usually stalls.',
    },
    built: [
      { title: 'Deep scrape and audit', text: 'Crawls the site and flags what is hurting it.' },
      { title: 'Competitors and alerts', text: 'Discovers competitors, researches their backlinks and alerts the owner when they publish.' },
      { title: 'Keyword research', text: 'Finds the terms worth writing for.' },
      { title: 'Written and published', text: 'AI generates the content and publishes it straight to the site.' },
      { title: 'A live health score', text: 'One number that shows how the site is doing, kept current.' },
      { title: 'Bring your own AI key', text: 'Runs on the owner’s own AI API key, so the AI costs stay theirs.' },
    ],
    runsNow: {
      label: 'How it runs',
      text: 'Built as self-serve: a site owner signs up, connects their own AI key, and lets it audit, write and publish.',
    },
    pending: [
      'TODO · Confirm WordPress is a publishing target, and how (REST API or plugin)',
      'TODO · Posts published and time saved',
      'TODO · Status: live? users?',
    ],
    seo: {
      title: 'AI SEO Automator: Publishing on Autopilot | Faraz Ahmad',
      description:
        'Case study: AI SEO Automator audits a site, researches keywords and competitors, then writes AI content and publishes it straight to the site.',
    },
  },
  {
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
      title: 'WordPress Audit: Example Plugin-Heavy Teardown | Faraz Ahmad',
      description:
        'An illustrative WordPress teardown: 47 plugins, two caches, a switched-off security plugin, and how an audit, cleanup and block-theme rebuild fix them.',
    },
  },
];

export const getCase = (slug: string): WpCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): WpCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[wp] no case after ${slug}`);
  return next;
}

/** The open case slot (decisions.md › wp › Case studies: "Any rebuild / rescue"). */
export const CASE_SLOT = {
  kicker: 'Client story · rebuild or rescue',
  title: 'A real WordPress rescue or rebuild.',
  text: 'This slot stays empty until a client clears their site for publishing. No made-up results in the meantime.',
  chips: ['TODO · Client site and permission', 'TODO · Load time before → after', 'TODO · Plugins removed, traffic kept'],
} as const;
