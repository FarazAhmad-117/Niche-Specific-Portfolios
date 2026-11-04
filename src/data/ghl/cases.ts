/**
 * Case studies for the ghl niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - decisions.md › ghl › Real numbers per case: saved to MongoDB first, then sent to
 *    GoHighLevel through its API; contact upsert by email; tags incl. niche:<slug>; a note;
 *    an open opportunity; failed sends retried from admin
 *  - docs/research/ai-local.md: the API is called with a Private Integration Token
 * Lead-delivery numbers are open, so there are none: a visible TODO chip says so.
 *
 * `account-teardown` is an EXAMPLE (decisions: client stories are open). It is labelled as
 * illustrative everywhere it appears and describes method, never results.
 *
 * Project-owned values (status, the retry fact, the site the pipeline runs on) come from the
 * shared registry (src/person/projects.ts); everything else below is this niche's angle,
 * verbatim. When the person has no `lead-pipeline` project the case is omitted (Example mode):
 * the home page shows OWN_PROJECT_SLOT in its place, and no page, OG image or sitemap entry is
 * generated for it. The teardown is never promoted to stand in for it: the case page lays an
 * example out as a teardown, so a "degraded" pipeline case would show the wrong content.
 */
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, exampleCase, fact, fromProject, getProject, present, type ResolvedAngle } from '../../person/case-helpers';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { MAIN_SITE_URL, PERSON_NAME } from './site';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['lead-pipeline'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'lead-pipeline' | 'account-teardown' | ProjectId;

/**
 * The site a pipeline project runs on, as printed ("farazahmad.dev"): its parent project's
 * name, else the host of the person's main site.
 */
export const pipelineSite = (p: Project): string => (p.partOf ? getProject(p.partOf)?.name : undefined) ?? new URL(MAIN_SITE_URL).host;

export interface GhlCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** True for an illustrative case: shown with an "Example" tape everywhere. */
  readonly example: boolean;
  /** The flow, in order. */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  /** Absent only on a generated case whose project states no problem. */
  readonly problem?: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  /** Absent on generated cases (their status, if any, is in status). */
  readonly runsNow?: { readonly label: string; readonly text: string };
  /** True for a case built by the adapter from the registry (
iches lists ghl): the More builds grid. */
  readonly generated?: boolean;
  /** Client work: shown with the Confidential client treatment, never a name. */
  readonly confidential?: boolean;
  /** Caveats from the registry, printed on the case page. */
  readonly notes?: readonly string[];
  readonly stack?: readonly string[];
  readonly link?: { readonly label: string; readonly href: string };
  /** Something the owner still has to supply (rendered as a dashed chip). */
  readonly pending?: string;
  readonly seo: { readonly title: string; readonly description: string };
}

/** The lead pipeline from the registry, with the ghl angle (custom integration). */
const leadPipeline = fromProject(
  'lead-pipeline',
  (p): GhlCase => ({
    id: 'lead-pipeline',
    name: `${pipelineSite(p)} → GoHighLevel`,
    kicker: 'Custom integration · main case',
    title: 'Every form lead lands in GoHighLevel, labelled, and nothing is lost.',
    text: 'My own sites don’t use a GoHighLevel form. Each lead is saved to MongoDB first, then sent to GoHighLevel through its API: the contact is upserted by email, tagged with the site it came from, and given a note and an open opportunity. If a send fails, it can be retried from my admin.',
    status: p.status ?? null,
    example: false,
    flow: ['Form posted', 'Saved to MongoDB', 'Contact upserted', 'Tags incl. niche:<slug>', 'Note added', 'Open opportunity'],
    facts: [
      'Saved to MongoDB first, then sent through the GoHighLevel API',
      'Upserted by email: a repeat visitor stays one contact',
      'Tagged niche:<slug>, so each of my sites is its own segment',
      fact(p, 'retry'),
    ],
    problem: {
      title: 'A lead should never depend on one fragile hop',
      text: 'A form that posts straight into a CRM, or through one more connector, works until a step fails. Then nobody notices and the lead is simply gone. I wanted every lead stored on my side before anything else could go wrong, and GoHighLevel to receive a contact that arrives already labelled.',
    },
    built: [
      {
        title: 'Saved before anything else',
        text: 'The form posts to my own API, which writes the lead to MongoDB first. Whatever happens next, the lead exists.',
      },
      {
        title: 'One contact per person',
        text: 'The lead is sent to GoHighLevel through its API, authenticated with a Private Integration Token, and the contact is upserted by email rather than created, so a second enquiry updates the same person.',
      },
      {
        title: 'Labelled for routing',
        text: 'Tags are added, including niche:<slug> for the site the lead came from, with a note holding the message and an open opportunity in the pipeline.',
      },
      {
        title: 'Nothing silently lost',
        text: 'If the send to GoHighLevel fails, the lead is still in the database and can be retried from the admin.',
      },
    ],
    runsNow: {
      label: 'Where it is now',
      text: `Live on ${pipelineSite(p)} and on these niche sites. The form at the bottom of this page goes through it and arrives tagged niche:ghl.`,
    },
    pending: `TODO · Leads delivered and send success rate from ${pipelineSite(p)}`,
    seo: {
      title: withNameSuffix('Website to GoHighLevel Lead Pipeline (API)', PERSON_NAME),
      description:
        'Case study: website leads saved to MongoDB, then upserted into GoHighLevel by email with niche tags, a note and an open opportunity, retried from admin.',
    },
  }),
);

/** Niche-only illustrative case: no project behind it, always labelled Example. */
const teardown = exampleCase<GhlCase>({
  id: 'account-teardown',
  name: 'Anatomy of a messy account',
  kicker: 'Example teardown · illustrative',
  title: 'What an audit finds, and how the rewire goes.',
  text: 'An illustrative sub-account built from the faults that come up most in GoHighLevel: duplicate workflows, drafts that never fire, alerts to inboxes nobody reads. Not a client account; a walk-through of how I audit and rebuild one.',
  status: null,
  example: true,
  flow: ['Map what exists', 'Rank the faults', 'Rewire', 'Test contacts', 'Handover'],
  facts: [
    'Every trigger, workflow, stage and alert drawn as it actually runs',
    'Faults ranked by risk before anything is switched off',
    'Rewired as one trigger, one workflow, one job',
  ],
  problem: {
    title: 'Nobody can say what happens when a lead comes in',
    text: 'The names say one thing and the account does another. Two workflows answer the same form, the booking confirmation is still a draft, and the hot-lead alert goes to someone who left. Each fault is small; together they decide whether a lead is answered.',
  },
  built: [
    {
      title: 'Map what is really there',
      text: 'A read-only pass over every trigger, workflow, pipeline stage and notification, drawn as it actually fires, not as the names suggest.',
    },
    {
      title: 'Rank the faults',
      text: 'Each fault gets a risk: double sends and dead alerts first, cosmetic naming last. Nothing is switched off until we agree the order.',
    },
    {
      title: 'Rewire, one job per workflow',
      text: 'One trigger starts one workflow; workflows are numbered and named by purpose; one pipeline replaces the near-copies.',
    },
    {
      title: 'Test with test contacts',
      text: 'Every path run end to end with a test contact, with error notifications wired, before a real lead touches it.',
    },
    {
      title: 'Hand it over',
      text: 'A map, the naming scheme and a recorded walkthrough, so the next person can read the account without me.',
    },
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'A map of the account, a ranked fix list, the rewired workflows, and a recorded walkthrough of your own account.',
  },
  pending: 'TODO · Replace with a real anonymized client teardown and screenshots',
  seo: {
    title: withNameSuffix('GoHighLevel Account Audit: Example Teardown', PERSON_NAME),
    description:
      'An illustrative GoHighLevel sub-account teardown: duplicate workflows, drafts that never fire, dead alerts, and how an audit and rewire fixes them.',
  },
});

/** The hand-written cases, in authored order (the home grid above the More builds section). */
export const CASES: readonly GhlCase[] = present([leadPipeline, teardown]);

/** Registry facts that are fit for the hero list (keyed problem copy is shown elsewhere). */
const HERO_FACT_SKIP = new Set(['problemTitle', 'problemText', 'oneLiner']);

/**
 * The ghl adapter: a registry project whose `niches` lists ghl, as a GhlCase. Only registry
 * values: the angle's wording (src/person/projects.ts › angles.ghl), the summary, modules,
 * flow, stack, notes and keyed facts. No numbers of its own, no TODO chips.
 */
function generatedCase(p: Project, a: ResolvedAngle): GhlCase {
  const stack = p.stack?.items ?? [];
  return {
    id: p.id,
    name: a.title,
    kicker: a.kicker,
    title: a.line,
    text: p.summary ?? a.line,
    status: p.status ?? null,
    example: false,
    flow: a.flow,
    facts: [
      ...(a.confidential ? ['Confidential client: no names, accounts or figures shown'] : []),
      ...Object.entries(p.facts)
        .filter(([k]) => !HERO_FACT_SKIP.has(k))
        .map(([, v]) => v),
      ...(stack.length ? [`Built with ${stack.slice(0, 3).join(', ')}`] : []),
    ],
    ...(a.problem ? { problem: a.problem } : {}),
    built: a.built,
    generated: true,
    confidential: a.confidential,
    notes: p.notes ?? [],
    stack,
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}, a GoHighLevel build.`),
    },
  };
}

/** Registry projects listed for ghl that no hand-written case above shows, in registry order. */
export const MORE_CASES: readonly GhlCase[] = autoCases(
  'ghl',
  CASES.map((c) => c.id),
  generatedCase,
);

/** Every case with a page: routes, OG images, JSON-LD and the sitemap read this. */
export const ALL_CASES: readonly GhlCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.id);

/**
 * Example mode: the home page's main card when the person has no `lead-pipeline` project. A
 * dashed placeholder, never someone else's project.
 */
export const OWN_PROJECT_SLOT = {
  kicker: 'Own project · GoHighLevel integration',
  title: 'A GoHighLevel integration you built and run.',
  text: 'This slot stays empty until a real project is added to src/person/projects.ts. Nothing is shown in its place.',
  chips: ['TODO · Add your own project to src/person/projects.ts', 'TODO · What it sends to GoHighLevel, and its status'],
} as const;

export const getCase = (slug: string): GhlCase | undefined => ALL_CASES.find((c) => c.id === slug);

/** Next case in a fixed ring over every case; undefined when the case is the only one (no self-link). */
export function nextCase(slug: CaseSlug): GhlCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.id === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.id !== slug ? next : undefined;
}

/**
 * Related builds for a generated case page: the other generated cases after it in the ring,
 * skipping `exclude` (the next case, already linked), at most `max`.
 */
export function relatedCases(slug: CaseSlug, exclude?: CaseSlug, max = 2): readonly GhlCase[] {
  const i = MORE_CASES.findIndex((c) => c.id === slug);
  if (i < 0) return [];
  const ring = [...MORE_CASES.slice(i + 1), ...MORE_CASES.slice(0, i)];
  return ring.filter((c) => c.id !== exclude).slice(0, max);
}

/**
 * What GoHighLevel receives for one lead (example contact; field names are the real steps).
 * Rendered on the pipeline case page as a record.
 */
export const GHL_RECORD = [
  ['contact', 'upsert by email · sam@northwind.example'],
  ['tags', 'niche:ghl'],
  ['note', 'the message from the form'],
  ['opportunity', 'status: open'],
] as const;
