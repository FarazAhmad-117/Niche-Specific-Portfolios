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
 */
import { getNiche } from '../../niches';
import { assertLaunchReady, todo, type Field } from './todo';

export const CASE_SLUGS = ['yard-terminal', 'solidmake', 'client-migration', 'own-stack'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

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
}

const baseline = () => todo('baseline');
const metric = (name: string): CaseMetric => ({ name, before: baseline(), after: baseline() });

export const CASES: readonly CloudCase[] = [
  {
    slug: 'yard-terminal',
    name: 'Yard Terminal',
    kicker: 'Own product · Indepth Solution',
    client: 'Own product · auto salvage yards',
    title: 'Sold once, ended everywhere: the sync it cannot miss.',
    summary:
      'Yard Terminal is AI listing software for auto salvage yards. It keeps one record for every part, lists it on eBay Motors and a Shopify storefront, and ends the other listings the moment it sells. For the infrastructure that is the whole job: the sync between channels must not miss.',
    status: { label: 'Pre-launch', tone: 'muted' },
    facts: [
      'One record per part, quantity one',
      'Listed on eBay Motors and Shopify',
      'Other listings end when a part sells',
      'Each yard’s data isolated, with an append-only audit trail',
    ],
    brief: {
      title: 'A sale on one channel has to end the listing on every other.',
      text: 'A salvage part exists once. If eBay Motors sells it while Shopify still shows it, the yard has sold something it no longer has. So the sync is not a feature, it is the product’s uptime.',
    },
    guarantees: [
      { title: 'One record per part', text: 'Every part is a single record with quantity one, so it cannot be sold twice.' },
      { title: 'Sold once, ended everywhere', text: 'When a part sells, or is sold at the counter, its other listings end.' },
      { title: 'Isolated per yard', text: 'Each yard’s data is kept apart from every other yard’s.' },
      { title: 'An audit trail that only grows', text: 'An append-only trail records what happened, and when.' },
    ],
    arch: [
      {
        title: 'Listing and sync path',
        nodes: [
          { label: 'Part record', note: 'MongoDB data layer' },
          { label: 'Channel sync', note: todo('confirm queue / worker setup') },
          { label: 'eBay Motors · Shopify', note: 'Both channels live' },
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
    runsNow: 'Pre-launch. Opening to the first 200 founding yards, with a waitlist and demo booking open.',
    link: { label: 'yardterminal.com', href: 'https://yardterminal.com' },
    seo: {
      title: 'Yard Terminal: Marketplace Sync Infrastructure | Faraz Ahmad',
      description:
        'Case study: the infrastructure behind Yard Terminal, where a part sold on eBay Motors or Shopify must end everywhere else. Architecture and metrics.',
    },
    og: { line: 'Sold once, ended everywhere: the sync it cannot miss.' },
  },
  {
    slug: 'solidmake',
    name: 'SolidMake',
    kicker: 'Final-year project · AI research',
    client: 'Final-year project · mechanical engineers',
    title: 'A heavy compute pipeline: a sentence in, a STEP file out.',
    summary:
      'SolidMake turns a plain-language description of a part into a STEP file ready for cutting, bending and welding. It is built on the DeepCAD and Text2CAD research models with prompt normalisation in front, and the model work runs in Python: training pipelines and data preparation.',
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
      title: 'SolidMake: Compute Pipeline for Text-to-CAD | Faraz Ahmad',
      description:
        'Case study: SolidMake’s pipeline from a text prompt to a STEP file, on the DeepCAD and Text2CAD models. The architecture and the cost metrics that matter.',
    },
    og: { line: 'A heavy compute pipeline: a sentence in, a STEP file out.' },
  },
  {
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
      title: 'Client Migration and CI/CD Setup | Faraz Ahmad',
      description:
        'Case study, write-up pending: a client migration and CI/CD setup, to be documented before and after. The client name is withheld until they approve it.',
    },
    og: { line: 'A migration and CI setup, write-up in progress.' },
  },
  {
    slug: 'own-stack',
    name: 'Infra teardown: my own stack',
    kicker: 'Own stack · farazahmad.dev + these sites',
    client: 'Own stack',
    title: 'How farazahmad.dev and these niche sites are actually run.',
    summary:
      'The proof I can show today: the setup behind my own sites, taken apart. A Next.js app on MongoDB with Sentry and PostHog watching it, and a family of static niche sites built to be served from one Vercel project, one subdomain each, all generated from a single registry file.',
    status: { label: 'Running', tone: 'ok' },
    facts: [
      'Next.js 16, App Router, slug pages built static',
      'Leads saved to MongoDB first, then sent to GoHighLevel',
      'Sentry for errors, PostHog for analytics',
      '257 tests passing, typecheck and lint clean (Oct 2026)',
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
        text: '257 passing tests with typecheck and lint clean; Lighthouse 100 for accessibility, best practices and SEO on the key pages (local production build, Oct 2026).',
      },
    ],
    arch: [
      {
        title: 'Niche sites',
        nodes: [
          { label: 'Registry', note: 'src/niches.ts' },
          { label: 'Generated rewrites', note: 'vercel.json' },
          { label: 'Static build', note: 'Astro' },
          { label: 'One Vercel project', note: '<slug>.farazahmad.dev' },
        ],
      },
      {
        title: 'farazahmad.dev',
        nodes: [
          { label: 'Next.js 16', note: 'App Router' },
          { label: 'MongoDB', note: 'Content, leads, settings' },
          { label: 'GoHighLevel API', note: 'Lead pipeline' },
          { label: 'Sentry · PostHog', note: 'Errors, analytics' },
        ],
      },
    ],
    metrics: [metric('Monthly hosting bill'), metric('Build and deploy time'), metric('Deploys a month')],
    runsNow: 'farazahmad.dev runs on this stack today. The niche sites are built in this one repository and go live one by one.',
    seo: {
      title: 'Infra Teardown: How My Own Sites Are Run | Faraz Ahmad',
      description:
        'A teardown of my own stack: Next.js on MongoDB with Sentry, and static niche sites built for one Vercel project, a subdomain each, from one registry.',
    },
    og: { line: 'How farazahmad.dev and these niche sites are actually run.' },
  },
];

assertLaunchReady({ noindex: getNiche('cloud').noindex, data: CASES, label: 'case studies' });

export const getCase = (slug: string): CloudCase | undefined => CASES.find((c) => c.slug === slug);

/** Next case in the fixed ring. */
export function nextCase(slug: CaseSlug): CloudCase {
  const i = CASES.findIndex((c) => c.slug === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`No case after ${slug}`);
  return next;
}
