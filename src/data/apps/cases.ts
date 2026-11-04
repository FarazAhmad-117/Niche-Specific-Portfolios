/**
 * Case studies for the apps niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - docs/brief/DECISIONS.md › apps (farazahmad.dev Lighthouse figures; which cases to feature)
 *  - docs/research/ai-local.md (the owner's repo: SolidMake, farazahmad.dev stack, tests, dates)
 *  - docs/research/ai-web.md §1 (Yard Terminal's own public product pages)
 *  - src/data/ai/cases.ts (the verified copy already published on the ai niche)
 *
 * Every value is either a plain verified string or todo('…'), which renders as a dashed
 * `TODO ·` chip and is listed in docs/todo/apps.md. SolidMake and Yard Terminal have no
 * verified usage numbers, so their results are product facts plus visible TODO chips.
 * Diagrams are simplified and say where they were drawn from.
 *
 * Project-owned values (name, status, link, stack, canonical modules, keyed facts) come from
 * src/person/projects.ts; every apps-specific string (the angle) stays verbatim here. A project
 * that is absent from the registry drops its case (page, OG image, sitemap entry) and its
 * supporting call-out; the home row fills up with CASE_SLOT / DETAIL_SLOT (dashed TODO chips).
 */
import type { ImageMetadata } from 'astro';
import yardTerminalShot from '../../assets/apps/yard-terminal-site.png';
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, fact, fromProject, modules, present, type ResolvedAngle } from '../../person/case-helpers';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { AI_SITE_URL, BRAND_COMPANY, PERSON_NAME } from './site';

export type Todo = { readonly todo: string };
export type Field = string | Todo;
export const todo = (text: string): Todo => ({ todo: text });
export const isTodo = (f: Field): f is Todo => typeof f !== 'string';

/** The registry projects this niche shows as cases, in card order. */
export const NICHE_PROJECTS = ['solidmake', 'yard-terminal', 'farazahmad-dev'] as const satisfies readonly ProjectId[];
/** Projects shown as supporting call-outs (linking to their ai write-ups). */
export const SUPPORTING_PROJECTS = ['ai-seo-automator', 'lead-drift'] as const satisfies readonly ProjectId[];
/** Every possible case slug (generated cases use their project id). The slugs actually built are CASE_SLUGS. */
export type CaseSlug = 'solidmake' | 'yard-terminal' | 'farazahmad-dev' | ProjectId;

/** A node sits in a column (stage, left to right) and a row. */
export interface DiagramNode {
  readonly id: string;
  readonly label: string;
  readonly sub?: string;
  readonly col: number;
  readonly row: number;
  /** io = what goes in or comes out, core = what I built, ext = a third party, gate = a human step. */
  readonly tone?: 'io' | 'core' | 'ext' | 'gate';
}
export interface DiagramEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
  /** Offline / background path (training, retries). */
  readonly dashed?: boolean;
  /**
   * Routing between different rows and columns. Default: across to the column boundary, then
   * down/up. 'gap': down/up into the gap between the rows first, along it, then into the target
   * from above/below (for a branch that would otherwise cut through other boxes).
   */
  readonly via?: 'gap';
}
export interface Diagram {
  readonly cols: number;
  readonly rows: number;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  /** Where the drawing comes from, printed under it. */
  readonly source: string;
  /** Column headings for the stage list (phones, home cards). */
  readonly stages: readonly string[];
}

export interface AppCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  readonly text: string;
  readonly status: { readonly label: string; readonly live: boolean };
  /** Three short verified facts. The home card shows the first two; the third point is covered in the case page's "built" list. */
  readonly facts: readonly [string, string, string];
  /** What the drawing title block calls the sheet. */
  readonly sheet: string;
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly diagram: Diagram;
  /** Node ids for the OG image's chain (default: the first row of the diagram). */
  readonly ogPath?: readonly string[];
  readonly stack: readonly { readonly name: string; readonly note?: string }[];
  readonly stackTodo?: string;
  readonly timeline: readonly { readonly when: Field; readonly what: string }[];
  readonly results: readonly { readonly label: string; readonly value: Field; readonly note?: string }[];
  /** Still to collect from the owner, shown as chips on the card. */
  readonly pending: readonly string[];
  readonly screenshot?: { readonly src: ImageMetadata; readonly alt: string; readonly caption: string };
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  /**
   * Generated from the registry (a project whose `niches` lists apps with no hand-written angle
   * here): shown in "More builds", and its page leaves out the timeline and result table (nothing
   * dated or measured is in the registry) and prints the notes instead.
   */
  readonly generated?: true;
  /** Client work: the client stays confidential. */
  readonly confidential?: boolean;
  /** Registry caveats, printed on the case page. */
  readonly notes?: readonly string[];
  /** Public source repository (registry `repo`). */
  readonly repo?: { readonly label: string; readonly href: string };
  /** The registry project behind the case (shared screenshot lookup). */
  readonly project?: Project;
}

/** A project's verified status; unknown (absent in the registry) reads as still to confirm. */
const statusOf = (p: { readonly status?: string; readonly live: boolean }) => ({ label: p.status ?? 'Status to confirm', live: p.live });
/** The registry stack as this niche's stack list (names only). */
const stackOf = (p: { readonly stack?: { readonly items: readonly string[] } }) => (p.stack?.items ?? []).map((name) => ({ name }));
const caseTitle = (core: string) => withNameSuffix(core, PERSON_NAME);

const solidmake = fromProject('solidmake', (p): AppCase => ({
    id: 'solidmake',
    name: p.name,
    kicker: 'Deep tech · text to CAD',
    title: 'Describe the part. Get the STEP file.',
    text: `${p.name} turns a plain-language description of a part into a production-ready STEP file for cutting, bending and welding. It is built on the DeepCAD and Text2CAD research models with prompt normalisation in front, not a thin wrapper around a chat model.`,
    status: statusOf(p),
    facts: [
      'Plain language in, a STEP file out',
      'Built on the DeepCAD and Text2CAD models',
      'Model work in Python: training pipelines and data prep',
    ],
    sheet: 'Text → CAD pipeline',
    problem: {
      title: 'Modelling a simple part from scratch in a CAD tool',
      text: 'A mechanical engineer who needs a bracket or a plate has to model it from scratch in SolidWorks or AutoCAD before it can be cut, bent or welded, however simple the part is.',
    },
    built: modules(p, [
      'words',
      // apps words these two its own way (shorter; comma before "ready").
      { id: 'normalise', text: 'The description is cleaned and structured before it reaches the model.' },
      'models',
      { id: 'step', text: 'The output is a STEP file, ready for cutting, bending and welding.' },
    ]),
    diagram: {
      cols: 4,
      rows: 2,
      stages: ['Input', 'Prepare', 'Model', 'Output'],
      source: 'Simplified, drawn from the repo descriptions',
      nodes: [
        { id: 'prompt', label: 'Text prompt', sub: 'plain-language part', col: 0, row: 0, tone: 'io' },
        { id: 'norm', label: 'Normalisation', sub: 'clean + structure', col: 1, row: 0, tone: 'core' },
        { id: 'model', label: 'DeepCAD · Text2CAD', sub: 'custom models, Python', col: 2, row: 0, tone: 'core' },
        { id: 'step', label: 'STEP file', sub: 'cut, bend, weld', col: 3, row: 0, tone: 'io' },
        { id: 'data', label: 'Data prep', sub: 'Python', col: 1, row: 1, tone: 'core' },
        { id: 'train', label: 'Training pipeline', sub: 'pre-designed training', col: 2, row: 1, tone: 'core' },
      ],
      edges: [
        { from: 'prompt', to: 'norm' },
        { from: 'norm', to: 'model' },
        { from: 'model', to: 'step' },
        { from: 'data', to: 'train', dashed: true },
        { from: 'train', to: 'model', dashed: true, label: 'offline' },
      ],
    },
    stack: stackOf(p),
    stackTodo: 'Front end and hosting: to confirm',
    timeline: [
      { when: todo('Start date'), what: 'Research and model selection' },
      { when: todo('Year: 2025 in code, to confirm'), what: 'Submitted as my final-year project' },
    ],
    results: [
      { label: 'Output', value: 'A STEP file, ready for fabrication' },
      { label: 'Skill needed', value: 'A written description instead of CAD modelling' },
      { label: 'Time to model a part, before → after', value: todo('Measure and supply') },
      { label: 'Accuracy / models generated', value: todo('Supply if measured') },
    ],
    pending: ['Time to model, before → after', 'Accuracy'],
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: Text to CAD, Built End to End`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name} turns a plain-language part description into a STEP file, on DeepCAD and Text2CAD models. Architecture, stack and build.`,
        `Case study: ${p.name} turns a plain-language part description into a STEP file, on DeepCAD and Text2CAD models.`,
      ),
    },
}));

const yardTerminal = fromProject('yard-terminal', (p): AppCase => ({
    id: 'yard-terminal',
    name: p.name,
    kicker: 'Complex SaaS · multi-channel commerce',
    title: 'One record per part. Built to list on each channel and sell once.',
    text: `${p.name} is browser-based inventory and listing software for auto salvage yards. It keeps one record per used part and is built to list it on eBay Motors and a Shopify storefront, ending the other listings when it sells; today the eBay channel runs against eBay’s sandbox and the Shopify channel is not live yet. An AI agent drafts each listing; a person approves it before it publishes. A team build, and a product of ${p.madeBy ?? BRAND_COMPANY}.`,
    status: statusOf(p),
    facts: [
      'Built for eBay Motors and Shopify; eBay runs in its sandbox today',
      'A VIN decoded once; every part inherits its fitment',
      'No auto-publish: every AI draft is approved by a person',
    ],
    sheet: 'Listing pipeline',
    problem: {
      title: fact(p, 'problemTitle'),
      text: 'A yard sells one-off parts on more than one marketplace. Typing each part into each channel is slow, and a part sold on one channel can still be for sale on the other.',
    },
    built: [
      ...modules(p, [
        // apps words three of these its own way: kept verbatim as overrides.
        { id: 'record', text: 'Every part is a single record with a quantity of one, so the same part cannot be sold twice.' },
        'vin',
        {
          id: 'approve',
          text: 'An AI agent drafts the title, category, condition, photo order and a suggested price. Nothing publishes until a person approves it.',
        },
        {
          id: 'delist',
          text: 'Built so that when a part sells, online or at the counter, its other listings end, each end verified against its channel and retried until it is confirmed.',
        },
      ]),
      {
        title: 'Every yard kept apart',
        text: 'Every record carries its yard and every query is filtered by it; a query without a yard is refused. An append-only trail records who approved what.',
      },
    ],
    diagram: {
      cols: 5,
      rows: 3,
      stages: ['Donor', 'Record', 'Draft', 'Approve', 'Channels and counter'],
      source: 'Simplified, drawn from yardterminal.com’s product and security pages',
      nodes: [
        { id: 'vin', label: 'Donor VIN', sub: 'decoded once', col: 0, row: 1, tone: 'io' },
        { id: 'part', label: 'Part record', sub: 'quantity one', col: 1, row: 1, tone: 'core' },
        { id: 'ai', label: 'AI draft', sub: 'title, photos, price', col: 2, row: 1, tone: 'core' },
        { id: 'ok', label: 'Human approval', sub: 'no auto-publish', col: 3, row: 1, tone: 'gate' },
        { id: 'ebay', label: 'eBay Motors', sub: 'sandbox today', col: 4, row: 0, tone: 'ext' },
        { id: 'shop', label: 'Shopify', sub: 'not live yet', col: 4, row: 1, tone: 'ext' },
        { id: 'pos', label: 'Counter POS', sub: 'a sale ends listings', col: 4, row: 2, tone: 'ext' },
        { id: 'audit', label: 'Audit trail', sub: 'append-only', col: 2, row: 2, tone: 'core' },
      ],
      edges: [
        { from: 'vin', to: 'part', label: 'fitment' },
        { from: 'part', to: 'ai' },
        { from: 'ai', to: 'ok' },
        { from: 'ok', to: 'ebay' },
        { from: 'ok', to: 'shop' },
        { from: 'ok', to: 'audit', dashed: true, label: 'logged' },
        { from: 'pos', to: 'shop', dashed: true, label: 'ends listings' },
      ],
    },
    // The registry stack is read from the code now (provisional: false), so it replaces the
    // public-site notes and the "to confirm" chip.
    stack: stackOf(p),
    timeline: [
      { when: todo('Start date'), what: `First built as software for a client, then rebuilt as ${p.name}` },
      { when: 'Oct 2026', what: 'Opens to founding yards, in waves (per yardterminal.com)' },
    ],
    results: [
      { label: 'Records per part', value: 'One, whatever the channel' },
      { label: 'Channels', value: 'eBay Motors, in eBay’s sandbox; Shopify, built, not live yet' },
      { label: 'Listings published without approval', value: 'None: there is no auto-publish mode' },
      { label: 'Yards, listings synced, measured delist time', value: todo('Supply after the founding beta') },
    ],
    pending: ['Yards using it', 'Listings synced'],
    // The image file is this niche's own import (src/assets/apps/); the registry holds its alt.
    screenshot: p.screenshot && {
      src: yardTerminalShot,
      alt: p.screenshot.alt,
      caption: 'The public site, yardterminal.com. Parts, prices and counts in its hero graphic are the site’s demo values.',
    },
    link: p.link,
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: Multi-Channel Listing SaaS`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name} keeps one record per salvage part, has AI draft each listing for a person to approve, and is built for eBay Motors and Shopify.`,
        `Case study: ${p.name} keeps one record per salvage part and is built to list it on eBay Motors and Shopify.`,
      ),
    },
}));

/**
 * The person's own site as a case. Kept as a registry project (kind 'own-site') rather than
 * derived from config.ts: everything this case says (stack, admin, tests, Lighthouse, timeline)
 * is a fact about that one codebase, not about the person. Absent = no case.
 */
const ownSiteCase = fromProject('farazahmad-dev', (p): AppCase => ({
    id: 'farazahmad-dev',
    name: p.name,
    kicker: 'Production Next.js app · my own',
    title: 'My own site, run like a product.',
    text: `${p.name} is a Next.js 16 app with its own admin CMS, authentication, a lead pipeline into GoHighLevel and a test suite. It is the codebase I hold to the same checks as client work, and the contact form on these niche sites sends into it.`,
    status: statusOf(p),
    facts: [fact(p, 'tests'), fact(p, 'lighthouse'), fact(p, 'leadsFirst')],
    sheet: 'App and lead pipeline',
    problem: {
      title: 'A portfolio that has to work like a product',
      text: 'A personal site that only looks good is easy. One that takes leads, runs its own content, holds up under Lighthouse and keeps passing its tests as it changes is a product, so I built it as one.',
    },
    built: [
      {
        title: 'Static where it can be',
        text: 'Next.js 16 with the App Router: slug pages are generated at build, and data is cached with tags so an edit refreshes only what changed.',
      },
      {
        title: 'Its own admin',
        text: 'A private admin, “Backstage”, behind Better Auth, with a Tiptap editor. Content lives in MongoDB, with fallbacks in the repo.',
      },
      {
        title: 'A lead pipeline that never drops one',
        text: 'Forms are validated with zod and protected by Cloudflare Turnstile. Every lead is saved to MongoDB first, then upserted into GoHighLevel; failed sends can be retried from the admin.',
      },
      {
        title: 'Measured, not assumed',
        text: 'Sentry for errors, PostHog for analytics, a node:test suite with typecheck and lint, and Lighthouse runs on every key page.',
      },
    ],
    diagram: {
      cols: 4,
      rows: 2,
      stages: ['Visitor', 'App', 'Data and CRM', 'Admin and monitoring'],
      source: 'Simplified, drawn from the repo',
      nodes: [
        { id: 'visit', label: 'Visitor', sub: 'pages, forms, audit', col: 0, row: 0, tone: 'io' },
        { id: 'next', label: 'Next.js 16', sub: 'App Router, SSG, tags', col: 1, row: 0, tone: 'core' },
        { id: 'db', label: 'MongoDB', sub: 'content + leads', col: 2, row: 0, tone: 'core' },
        { id: 'admin', label: 'Backstage admin', sub: 'Better Auth, Tiptap', col: 3, row: 0, tone: 'gate' },
        { id: 'mon', label: 'Sentry · PostHog', sub: 'errors, analytics', col: 3, row: 1, tone: 'ext' },
        { id: 'lead', label: 'Lead pipeline', sub: 'zod, Turnstile', col: 1, row: 1, tone: 'core' },
        { id: 'ghl', label: 'GoHighLevel API', sub: 'upsert, tags, deal', col: 2, row: 1, tone: 'ext' },
      ],
      edges: [
        { from: 'visit', to: 'next' },
        { from: 'next', to: 'db' },
        { from: 'admin', to: 'db' },
        { from: 'next', to: 'lead' },
        { from: 'lead', to: 'db', label: 'saved first' },
        { from: 'lead', to: 'ghl', label: 'then sent' },
        { from: 'next', to: 'mon', dashed: true, via: 'gap' },
      ],
    },
    ogPath: ['visit', 'next', 'lead', 'ghl'],
    stack: stackOf(p),
    timeline: [
      { when: '28 Jun 2024', what: 'First commit' },
      { when: '1 Oct 2026', what: 'Performance and SEO overhaul' },
      { when: '2 Oct 2026', what: 'Lighthouse 13.5 run on a local production build' },
      { when: '6 Oct 2026', what: '257 tests passing; typecheck and lint clean' },
      { when: '2 Nov 2026', what: 'Cross-origin contact endpoint for these niche sites' },
    ],
    results: [
      { label: 'Accessibility', value: '100', note: 'Lighthouse 13.5, home page' },
      { label: 'Best Practices', value: '100', note: 'Lighthouse 13.5, home page' },
      { label: 'SEO', value: '100', note: 'Lighthouse 13.5, home page' },
      { label: 'Agentic browsing', value: '100', note: 'Lighthouse 13.5, home page' },
      { label: 'Performance', value: '93–95 mobile · 100 desktop', note: 'range across runs, same build' },
      { label: 'Cumulative layout shift', value: '0', note: 'same run' },
      { label: 'Tests', value: '257 passing', note: 'node:test, as of 6 Oct 2026' },
    ],
    pending: [],
    link: p.link,
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: A Production Next.js App`, `${p.name}: Case Study`)),
      description:
        'Case study: a Next.js 16 app with an admin CMS, auth, a lead pipeline into GoHighLevel, 257 passing tests and Lighthouse 100 in four categories.',
    },
}));

/** The hand-written cases: the home row of drawing sheets, in card order. */
export const CASES: readonly AppCase[] = present([solidmake, yardTerminal, ownSiteCase]);

/**
 * The drawing for a generated case, from registry values only. A project with a `flow` gets its
 * main path left to right (in and out heavier, the parts in between as what was built). One with
 * no flow gets its modules laid out as a parts map with no wires, since the registry does not say
 * how they connect. Both are labelled as illustrative.
 */
function drawFromRegistry(p: Project, a: ResolvedAngle): Diagram {
  if (p.flow?.length) {
    const n = p.flow.length;
    return {
      cols: n,
      rows: 1,
      stages: p.flow.map((_, i) => (i === 0 ? 'In' : i === n - 1 ? 'Out' : `Step ${i}`)),
      source: 'Illustrative, drawn from the build’s main flow; not a screenshot',
      nodes: p.flow.map((label, i) => ({ id: `n${i}`, label, col: i, row: 0, tone: i === 0 || i === n - 1 ? 'io' : 'core' })),
      edges: p.flow.slice(1).map((_, i) => ({ from: `n${i}`, to: `n${i + 1}` })),
    };
  }
  const parts = a.built.slice(0, 6);
  const cols = Math.ceil(parts.length / 2);
  return {
    cols,
    rows: parts.length > 1 ? 2 : 1,
    stages: Array.from({ length: cols }, (_, i) => `Parts ${String.fromCharCode(65 + i)}`),
    source: 'Illustrative, a map of the build’s parts; not a screenshot',
    nodes: parts.map((b, i) => ({ id: `m${i}`, label: b.title, col: i % cols, row: Math.floor(i / cols), tone: 'core' })),
    edges: [],
  };
}

/** The adapter: one registry project → an apps case sheet, from registry values only. */
const fromRegistry = (p: Project, a: ResolvedAngle): AppCase => {
  const facts = a.built.map((b) => b.title);
  return {
    id: p.id,
    name: p.name,
    kicker: a.kicker,
    title: a.line,
    text: p.summary ?? a.line,
    status: { label: p.status ?? (a.confidential ? 'Client build' : 'Built'), live: p.live },
    facts: [facts[0] ?? a.title, facts[1] ?? a.line, facts[2] ?? a.title],
    sheet: p.flow?.length ? 'Main flow' : 'Parts map',
    problem: a.problem ?? { title: a.title, text: a.line },
    built: a.built,
    diagram: drawFromRegistry(p, a),
    stack: stackOf(p),
    timeline: [],
    results: [],
    pending: [],
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`)),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}. ${a.line}`, `Case study: ${p.name}.`),
    },
    generated: true,
    confidential: a.confidential,
    notes: p.notes ?? [],
    ...(p.repo ? { repo: p.repo } : {}),
    project: p,
  };
};

/** The generated cases ("More builds" on the home page), in registry order. */
export const MORE_CASES: readonly AppCase[] = autoCases(
  'apps',
  [...CASES.map((c) => c.id), ...SUPPORTING_PROJECTS],
  fromRegistry,
);

/** Every case with a page, OG image and sitemap entry: the hand-written sheets, then the generated ones. */
export const ALL_CASES: readonly AppCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.id);

/** Sheets per row on the home page (Cases.astro, ≥1024px). */
export const SHEETS_PER_ROW = 3;

/**
 * Placeholder sheet that completes the home row when the person has fewer cases than a full
 * row (or none). Rendered with dashed TODO chips; its drawing is the labelled example
 * architecture from the Spec → shipped player, never another person's project.
 */
export const CASE_SLOT = {
  sheet: 'Sheet to come',
  name: 'Your next case study',
  title: 'A product you built or led, with its architecture drawn out.',
  chips: ['Add the project to src/person/projects.ts', 'Write its apps angle in src/data/apps/cases.ts'],
} as const;

/** A supporting call-out: no page here, it links to the engineering write-up on the ai niche. */
export interface AppDetail {
  readonly id: (typeof SUPPORTING_PROJECTS)[number];
  readonly name: string;
  readonly kicker: string;
  readonly title: string;
  readonly text: string;
  readonly pending: string;
  readonly href: string;
  /** Alt of the niche's own thumbnail of the tool, when it shows one. */
  readonly thumbAlt?: string;
}

/** Small supporting cards: no page here, they link to the engineering write-ups on the ai niche. */
export const SUPPORTING: readonly AppDetail[] = present([
  fromProject('ai-seo-automator', (p): AppDetail => ({
    id: 'ai-seo-automator',
    name: p.name,
    kicker: 'Multi-tenant SaaS',
    title: fact(p, 'oneLiner'),
    text: 'Audits a site, plans the content, then writes it and publishes it to WordPress behind approval gates, on each organisation’s own AI provider.',
    pending: 'Key metric: to supply',
    href: `${AI_SITE_URL}/work/ai-seo-automator/`,
  })),
  fromProject('lead-drift', (p): AppDetail => ({
    id: 'lead-drift',
    name: p.name,
    kicker: 'Internal product · in production',
    title: 'The growth engine for my own company.',
    text: `A browser extension pulls leads from Google Maps and Apollo into one pipeline, with reminders and a site crawler. ${p.madeBy ?? BRAND_COMPANY}’s own growth engine, running in production.`,
    pending: 'Key metric: not cleared yet',
    href: `${AI_SITE_URL}/work/lead-drift/`,
    // apps words the alt its own way (the registry's alt describes the whole sign-in page).
    thumbAlt: `${p.toolName ?? p.name}, ${p.madeBy ?? BRAND_COMPANY}'s internal sales tool: its sign-in page.`,
  })),
]);

/** Call-outs per row (Cases.astro, ≥760px). */
export const DETAILS_PER_ROW = 2;

/** Placeholder call-out that completes the row of supporting details. */
export const DETAIL_SLOT = {
  kicker: 'Open slot',
  title: 'Another product worth a closer look.',
  chips: ['Add a supporting project and its write-up'],
} as const;

export const getCase = (slug: string): AppCase | undefined => ALL_CASES.find((c) => c.id === slug);

/** Next case in a fixed ring through every case; undefined when the case is the only one (no self-link). */
export function nextCase(slug: CaseSlug): AppCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.id === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.id !== slug ? next : undefined;
}

/** Up to `n` other generated cases after this one (related-build links on a generated case page). */
export const relatedCases = (slug: CaseSlug, n = 2): readonly AppCase[] => {
  const i = MORE_CASES.findIndex((c) => c.id === slug);
  const ring = [...MORE_CASES.slice(i + 1), ...MORE_CASES.slice(0, Math.max(0, i))];
  return ring.slice(0, n);
};
