/**
 * The four cloud case studies (decisions.md › cloud › Case studies to feature).
 *
 * Two kinds of value only:
 *  - plain strings  verified facts: decisions.md, docs/research/ai-local.md, src/data/ai/cases.ts
 *                   (Yard Terminal's public site) and this repo's own README (the niche sites)
 *  - todo(...)      not supplied yet; renders as a dashed chip. EVERY metric is a baseline TODO
 *                   (decisions: "Real numbers per case: baseline"). No samples, no estimates.
 *
 * Nothing about queues, workers, GPUs, regions or clouds is stated unless the research shows it.
 *
 * Project-owned values (name, link, client, the runsNow fact) come from the shared registry
 * (src/person/projects.ts); everything else is this niche's angle, verbatim. A case whose
 * project is absent (a new person) is omitted, with its page, OG image and sitemap entry:
 *  - yard-terminal, solidmake: registry projects of the same id
 *  - own-stack: the teardown of the person's own site, built from the `farazahmad-dev` project
 *    (its stack facts are the owner's own, so they show only while that project is present)
 *  - client-migration: niche-only, every client fact a TODO; always shown
 * The home grid fills its row of two with a dashed CASE_SLOT when the count is odd.
 */
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, fact, fromProject, kindLabel, present, slotsToFill, type ResolvedAngle } from '../../person/case-helpers';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { getNiche, nicheHost } from '../../niches';
import { OWN_SITE } from './own-stack';
import { BRAND_COMPANY, PERSON_NAME } from './site';
import { assertLaunchReady, todo, type Field } from './todo';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['yard-terminal', 'solidmake', 'farazahmad-dev'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. Generated cases use their project id. */
export type CaseSlug = 'yard-terminal' | 'solidmake' | 'client-migration' | 'own-stack' | ProjectId;

export interface ArchNode {
  readonly label: Field;
  /** Verified detail under the node, or a TODO for what is not confirmed. */
  readonly note?: Field;
}
export interface ArchLane {
  readonly title: string;
  readonly nodes: readonly ArchNode[];
}
export interface CaseMetric {
  readonly name: string;
  readonly before: Field;
  readonly after: Field;
}
export type StatusTone = 'ok' | 'warn' | 'muted';

export interface CloudCase {
  readonly slug: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  readonly client: Field;
  /** One-line angle for cards and meta. Descriptive only. */
  readonly title: string;
  readonly summary: string;
  readonly status: { readonly label: string; readonly tone: StatusTone };
  /** Short verified facts for the hero panel and the card. */
  readonly facts: readonly Field[];
  readonly brief: { readonly title: Field; readonly text: string };
  /** What the system guarantees, as built (or TODO while the write-up is pending). */
  readonly guarantees: readonly { readonly title: string; readonly text: Field }[];
  readonly arch: readonly ArchLane[];
  readonly metrics: readonly CaseMetric[];
  readonly runsNow: string;
  /** Visible chip on the card and hero for what is still missing. */
  readonly pending?: string;
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  /** OG image text (no placeholders, no numbers). */
  readonly og: { readonly line: string };
  /**
   * Generated from the registry (a project whose `niches` lists cloud and that has no hand-written
   * angle here). Its page shows the brief, what was built, the flow, the stack and the notes, and
   * leaves out the baseline metrics table (no TODO chips on generated cases).
   */
  readonly generated?: true;
  /** One-line angle for the home card (generated cases). */
  readonly line?: string;
  /** Client work: the client stays confidential. */
  readonly confidential?: boolean;
  /** Registry stack, verified from the code. */
  readonly stack?: readonly string[];
  /** Registry caveats, printed on the case page. */
  readonly notes?: readonly string[];
  /** The registry project behind the case (shared screenshot lookup). */
  readonly project?: Project;
}

const baseline = () => todo('baseline');
const metric = (name: string): CaseMetric => ({ name, before: baseline(), after: baseline() });

const yardTerminal = fromProject(
  'yard-terminal',
  (p): CloudCase => ({
    slug: 'yard-terminal',
    name: p.name,
    kicker: `Own product · ${p.madeBy ?? BRAND_COMPANY}`,
    client: 'Own product · auto salvage yards',
    title: 'Sold once, ended everywhere: the sync it cannot miss.',
    summary: `${p.name} is AI listing software for auto salvage yards. It keeps one record for every part and is built to list it on eBay Motors and a Shopify storefront, ending the other listings the moment it sells. Today the eBay channel runs against eBay’s sandbox and the Shopify channel is not live yet. For the infrastructure that is the whole job: the sync between channels must not miss.`,
    status: { label: 'Pre-launch', tone: 'muted' },
    facts: [
      'One record per part, quantity one',
      'Built for eBay Motors and Shopify (eBay in sandbox)',
      'Other listings end when a part sells',
      'Each yard’s data isolated, with an append-only audit trail',
    ],
    brief: {
      title: 'A sale on one channel has to end the listing on every other.',
      text: 'A salvage part exists once. If eBay Motors sells it while Shopify still shows it, the yard has sold something it no longer has. So the sync is not a feature, it is the product’s uptime.',
    },
    guarantees: [
      { title: 'One record per part', text: 'Every part is a single record with quantity one, so it cannot be sold twice.' },
      { title: 'Sold once, ended everywhere', text: 'Built so that when a part sells, or is sold at the counter, its other listings end.' },
      { title: 'Isolated per yard', text: 'Each yard’s data is kept apart from every other yard’s.' },
      { title: 'An audit trail that only grows', text: 'An append-only trail records what happened, and when.' },
    ],
    arch: [
      {
        title: 'Listing and sync path',
        nodes: [
          { label: 'Part record', note: 'MongoDB data layer' },
          { label: 'Channel sync', note: 'Redis + BullMQ workers' },
          { label: 'eBay Motors · Shopify', note: 'eBay in sandbox · Shopify not live yet' },
          { label: 'Audit trail', note: 'Append-only' },
        ],
      },
      {
        title: 'Runs on',
        nodes: [
          { label: todo('confirm hosting'), note: todo('regions, scaling') },
          { label: 'Browser app', note: 'Works alongside yard-management systems' },
        ],
      },
    ],
    metrics: [metric('Uptime'), metric('Sync jobs a day'), metric('Deploys a week')],
    runsNow: fact(p, 'runsNow'),
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Marketplace Sync Infrastructure`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: the infrastructure behind ${p.name}, where a part sold on one channel must end on every other. Architecture and metrics.`,
        `Case study: the infrastructure behind ${p.name}, where a part sold on one channel must end on every other.`,
      ),
    },
    og: { line: 'Sold once, ended everywhere: the sync it cannot miss.' },
  }),
);

const solidmake = fromProject(
  'solidmake',
  (p): CloudCase => ({
    slug: 'solidmake',
    name: p.name,
    kicker: 'Final-year project · AI research',
    client: p.client ?? todo('client'),
    title: 'A heavy compute pipeline: a sentence in, a STEP file out.',
    summary: `${p.name} turns a plain-language description of a part into a STEP file ready for cutting, bending and welding. It is built on the DeepCAD and Text2CAD research models with prompt normalisation in front, and the model work runs in Python: training pipelines and data preparation.`,
    status: { label: 'Research build', tone: 'muted' },
    facts: [
      'Built on DeepCAD and Text2CAD',
      'Prompt normalisation before the model',
      'Python training pipelines and data prep',
      'Output: a STEP file for fabrication',
    ],
    brief: {
      title: 'Every request runs a model. That is where the bill lives.',
      text: 'A chat wrapper costs an API call. A custom model costs compute on every job, plus the training runs behind it. The infrastructure questions are what one job costs, how long it takes, and what is left running when nobody is asking.',
    },
    guarantees: [
      { title: 'Prompts cleaned before compute', text: 'Normalisation means similar requests reach the model in the same shape.' },
      { title: 'Model work kept in Python', text: 'Training pipelines and data preparation live in one place.' },
      { title: 'One output format', text: 'Every job ends in a STEP file, ready for cutting, bending and welding.' },
      { title: 'Compute setup', text: todo('confirm GPU / compute and hosting') },
    ],
    arch: [
      {
        title: 'Job path',
        nodes: [
          { label: 'Text prompt' },
          { label: 'Prompt normalisation' },
          { label: 'DeepCAD · Text2CAD', note: 'Python' },
          { label: 'STEP file' },
        ],
      },
      {
        title: 'Runs on',
        nodes: [{ label: todo('confirm compute (GPU?)'), note: todo('hosting, queueing') }],
      },
    ],
    metrics: [metric('Cost per job'), metric('Processing time per job'), metric('Monthly compute bill')],
    runsNow: 'The owner’s final-year project and the deepest technical build in the portfolio.',
    pending: 'TODO · compute setup and numbers',
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Compute Pipeline for Text-to-CAD`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}’s pipeline from a text prompt to a STEP file, on the DeepCAD and Text2CAD models. The architecture and the cost metrics that matter.`,
        `Case study: ${p.name}’s pipeline from a text prompt to a STEP file, on the DeepCAD and Text2CAD models, and the cost metrics.`,
        `Case study: ${p.name}’s pipeline from a text prompt to a STEP file, on the DeepCAD and Text2CAD models.`,
      ),
    },
    og: { line: 'A heavy compute pipeline: a sentence in, a STEP file out.' },
  }),
);

/** Niche-only: no project behind it, every client fact a TODO. Always shown. */
const clientMigration: CloudCase = {
    slug: 'client-migration',
    name: 'Client migration & CI setup',
    kicker: 'Client work · name withheld',
    client: todo('Client name withheld / TODO'),
    title: 'A migration and CI setup, to be written up before and after.',
    summary:
      'This write-up is pending. The client’s name stays withheld until they approve it, and the before and after numbers will be measured, not estimated. Below is what the write-up will cover, with every gap marked.',
    status: { label: 'Write-up pending', tone: 'muted' },
    facts: [todo('Client name withheld / TODO'), todo('moved from'), todo('moved to'), todo('CI setup used')],
    brief: {
      title: todo('what was breaking before'),
      text: 'The client’s starting point goes here once it is confirmed: what they ran, what kept failing, and what it cost them.',
    },
    guarantees: [
      { title: 'The cutover plan', text: todo('how traffic moved, and the rollback') },
      { title: 'The pipeline', text: todo('tests, previews, deploy steps') },
      { title: 'Monitoring after', text: todo('what is watched, who is alerted') },
      { title: 'Handover', text: todo('docs and access handed back') },
    ],
    arch: [
      { title: 'Before', nodes: [{ label: todo('before stack') }] },
      { title: 'After', nodes: [{ label: todo('CI pipeline') }, { label: todo('after stack') }] },
    ],
    metrics: [metric('Deploy time'), metric('Outages a month'), metric('Monthly bill')],
    runsNow: 'Pending: published once the client approves the write-up and the numbers are measured.',
    pending: 'Client name withheld / TODO',
    seo: {
      title: withNameSuffix('Client Migration and CI/CD Setup', PERSON_NAME),
      description:
        'Case study, write-up pending: a client migration and CI/CD setup, to be documented before and after. The client name is withheld until they approve it.',
    },
    og: { line: 'A migration and CI setup, write-up in progress.' },
};

/**
 * The person's own site, taken apart. Its stack lines (Next.js 16, MongoDB, Sentry, PostHog,
 * the test count) are the current owner's verified facts in this niche's wording, so the whole
 * case exists only while the `farazahmad-dev` project backs them (./own-stack.ts).
 */
const ownStackAngle = (p: Project): CloudCase => ({
    slug: 'own-stack',
    name: 'Infra teardown: my own stack',
    kicker: `Own stack · ${p.name} + these sites`,
    client: 'Own stack',
    title: `How ${p.name} and these niche sites are actually run.`,
    summary:
      'The proof I can show today: the setup behind my own sites, taken apart. A Next.js app on MongoDB with Sentry and PostHog watching it, and a family of static niche sites built to be served from one Vercel project, one subdomain each, all generated from a single registry file.',
    status: { label: 'Running', tone: 'ok' },
    facts: [
      'Next.js 16, App Router, slug pages built static',
      'Leads saved to MongoDB first, then sent to GoHighLevel',
      'Sentry for errors, PostHog for analytics',
      `${fact(p, 'testsCount')} tests passing, ${fact(p, 'checks')} (Oct 2026)`,
    ],
    brief: {
      title: 'One person, many sites, no ops team.',
      text: 'A main site and a growing family of niche sites, run by one person. The setup has to make the safe thing the default: a site cannot be indexed by accident, a misconfigured one fails the build, and a lead is never lost to a failed API call.',
    },
    guarantees: [
      {
        title: 'Hidden until launched',
        text: 'Every niche ships with a noindex tag and a robots Disallow until one flag in the registry is flipped.',
      },
      {
        title: 'Config generated, not typed',
        text: 'The Vercel rewrites are generated from the registry, and the build stops if an enabled niche has no home page.',
      },
      {
        title: 'A lead is saved before it is sent',
        text: 'Every lead lands in MongoDB first, then goes to GoHighLevel through its API. Failed sends can be retried from admin.',
      },
      {
        title: 'Checked before it ships',
        text: `${fact(p, 'testsCount')} passing tests with ${fact(p, 'checks')}; Lighthouse 100 for accessibility, best practices and SEO on the key pages (local production build, Oct 2026).`,
      },
    ],
    arch: [
      {
        title: 'Niche sites',
        nodes: [
          { label: 'Registry', note: 'src/niches.ts' },
          { label: 'Generated rewrites', note: 'vercel.json' },
          { label: 'Static build', note: 'Astro' },
          { label: 'One Vercel project', note: nicheHost('<slug>') },
        ],
      },
      {
        title: p.name,
        nodes: [
          { label: 'Next.js 16', note: 'App Router' },
          { label: 'MongoDB', note: 'Content, leads, settings' },
          { label: 'GoHighLevel API', note: 'Lead pipeline' },
          { label: 'Sentry · PostHog', note: 'Errors, analytics' },
        ],
      },
    ],
    metrics: [metric('Monthly hosting bill'), metric('Build and deploy time'), metric('Deploys a month')],
    runsNow: `${p.name} runs on this stack today. The niche sites are built in this one repository and go live one by one.`,
    seo: {
      title: withNameSuffix('Infra Teardown: How My Own Sites Are Run', PERSON_NAME),
      description:
        'A teardown of my own stack: Next.js on MongoDB with Sentry, and static niche sites built for one Vercel project, a subdomain each, from one registry.',
    },
    og: { line: `How ${p.name} and these niche sites are actually run.` },
});
const ownStack = OWN_SITE ? ownStackAngle(OWN_SITE) : undefined;

/** The hand-written cases: the home grid of two (unchanged by the generated ones). */
export const CASES: readonly CloudCase[] = present([yardTerminal, solidmake, clientMigration, ownStack]);

/**
 * The adapter: one registry project → a cloud case, in this niche's shape. Only registry values:
 * the angle's wording (projects.ts › angles.cloud), the modules as what it guarantees, the flow as
 * the one architecture lane, the stack and the notes. No metrics (nothing measured is in the
 * registry), no TODO chips.
 */
const fromRegistry = (p: Project, a: ResolvedAngle): CloudCase => ({
  slug: p.id,
  name: p.name,
  kicker: a.kicker,
  client: p.client ?? kindLabel(p),
  title: a.title,
  line: a.line,
  summary: p.summary ?? a.line,
  status: p.status ? { label: p.status, tone: p.live ? 'ok' : 'muted' } : { label: a.confidential ? 'Client build' : kindLabel(p), tone: 'muted' },
  facts: a.built.slice(0, 4).map((b) => b.title),
  brief: a.problem ?? { title: a.title, text: a.line },
  guarantees: a.built.map((b) => ({ title: b.title, text: b.text })),
  arch: [{ title: 'Flow', nodes: a.flow.map((label) => ({ label })) }],
  metrics: [],
  runsNow: '',
  ...(p.link ? { link: p.link } : {}),
  seo: {
    title: withNameSuffix(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`), PERSON_NAME),
    description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}. ${a.line}`, `Case study: ${p.name}.`),
  },
  og: { line: a.line },
  generated: true,
  confidential: a.confidential,
  stack: p.stack?.items ?? [],
  notes: p.notes ?? [],
  project: p,
});

/**
 * The generated cases ("More builds" on the home page). The own-stack case stands for
 * farazahmad-dev, so that id is passed as hand-written too.
 */
export const MORE_CASES: readonly CloudCase[] = autoCases('cloud', [...CASES.map((c) => c.slug), 'farazahmad-dev'], fromRegistry);

/** Every case with a page, OG image and sitemap entry: the hand-written ones, then the generated ones. */
export const ALL_CASES: readonly CloudCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.slug);

/**
 * Example mode: the dashed card that completes the home grid's row of two when a project case
 * is absent. Never someone else's project. Not rendered for the current owner (four cases).
 */
export const CASE_SLOT = {
  kicker: 'Own project · infrastructure',
  title: 'A system you built and run, with what it has to guarantee.',
  chips: ['TODO · Add your own project to src/person/projects.ts', 'TODO · baseline'],
} as const;

/** How many CASE_SLOT cards the home grid shows (0 for the current owner). */
export const CASE_SLOTS = slotsToFill(CASES.length, 2);

assertLaunchReady({ noindex: getNiche('cloud').noindex, data: [ALL_CASES, CASE_SLOTS ? CASE_SLOT : null], label: 'case studies' });

export const getCase = (slug: string): CloudCase | undefined => ALL_CASES.find((c) => c.slug === slug);

/** Next case in a fixed ring through every case; undefined when the case is the only one (no self-link). */
export function nextCase(slug: CaseSlug): CloudCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.slug === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.slug !== slug ? next : undefined;
}

/** Up to `n` other generated cases (for "related builds" links on a generated case page). */
export const relatedCases = (slug: CaseSlug, n = 2): readonly CloudCase[] => {
  const i = MORE_CASES.findIndex((c) => c.slug === slug);
  const ring = [...MORE_CASES.slice(i + 1), ...MORE_CASES.slice(0, Math.max(0, i))];
  return ring.slice(0, n);
};
