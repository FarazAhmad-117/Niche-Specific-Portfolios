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
 */
import type { ImageMetadata } from 'astro';
import yardTerminalShot from '../../assets/apps/yard-terminal-site.png';
import { AI_SITE_URL } from './site';

export type Todo = { readonly todo: string };
export type Field = string | Todo;
export const todo = (text: string): Todo => ({ todo: text });
export const isTodo = (f: Field): f is Todo => typeof f !== 'string';

export const CASE_SLUGS = ['solidmake', 'yard-terminal', 'farazahmad-dev'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

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
}

export const CASES: readonly AppCase[] = [
  {
    id: 'solidmake',
    name: 'SolidMake',
    kicker: 'Deep tech · text to CAD',
    title: 'Describe the part. Get the STEP file.',
    text: 'SolidMake turns a plain-language description of a part into a production-ready STEP file for cutting, bending and welding. It is built on the DeepCAD and Text2CAD research models with prompt normalisation in front, not a thin wrapper around a chat model.',
    status: { label: 'Final-year project', live: false },
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
    built: [
      { title: 'Say it in words', text: 'The engineer describes the part in natural language, with no modelling steps.' },
      {
        title: 'Normalise the prompt',
        text: 'The description is cleaned and structured before it reaches the model.',
      },
      {
        title: 'Custom models, not an API call',
        text: 'Built on DeepCAD and Text2CAD, with pre-designed training and an optimised process flow, in Python.',
      },
      { title: 'A file you can cut', text: 'The output is a STEP file, ready for cutting, bending and welding.' },
    ],
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
    stack: [{ name: 'Python' }, { name: 'DeepCAD' }, { name: 'Text2CAD' }],
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
      title: 'SolidMake: Text to CAD, Built End to End | Faraz Ahmad',
      description:
        'Case study: SolidMake turns a plain-language part description into a STEP file, on DeepCAD and Text2CAD models. Architecture, stack and build.',
    },
  },
  {
    id: 'yard-terminal',
    name: 'Yard Terminal',
    kicker: 'Complex SaaS · multi-channel commerce',
    title: 'One record per part. Listed on each channel, sold once.',
    text: 'Yard Terminal is browser-based inventory and listing software for auto salvage yards. It keeps one record per used part, lists it on eBay Motors and a Shopify storefront, and ends the other listings when it sells. An AI agent drafts each listing; a person approves it before it publishes.',
    status: { label: 'Opening to founding yards', live: false },
    facts: [
      'eBay Motors, Shopify and a counter POS: all live',
      'A VIN decoded once; every part inherits its fitment',
      'No auto-publish: every AI draft is approved by a person',
    ],
    sheet: 'Listing pipeline',
    problem: {
      title: 'Salvage parts, listed twice and sold twice',
      text: 'A yard sells one-off parts on more than one marketplace. Typing each part into each channel is slow, and a part sold on one channel can still be for sale on the other.',
    },
    built: [
      { title: 'One record per part', text: 'Every part is a single record with a quantity of one, so the same part cannot be sold twice.' },
      {
        title: 'Decode the VIN once',
        text: 'A VIN is decoded once and every part from that donor vehicle inherits its year, make, model and engine.',
      },
      {
        title: 'AI drafts, a person approves',
        text: 'An AI agent drafts the title, category, condition, photo order and a suggested price. Nothing publishes until a person approves it.',
      },
      {
        title: 'Sold once, ended everywhere',
        text: 'When a part sells, online or at the counter, its other listings end. Each end is verified against its channel and retried until it is confirmed.',
      },
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
        { id: 'ebay', label: 'eBay Motors', sub: 'live', col: 4, row: 0, tone: 'ext' },
        { id: 'shop', label: 'Shopify', sub: 'live', col: 4, row: 1, tone: 'ext' },
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
    stack: [
      { name: 'MongoDB', note: 'named as the data layer on farazahmad.dev' },
      { name: 'Next.js on Vercel', note: 'the public website, a separate app' },
    ],
    stackTodo: 'Product app stack: not public yet, to confirm',
    timeline: [
      { when: todo('Start date'), what: 'First built as software for a client, then rebuilt as Yard Terminal' },
      { when: 'Oct 2026', what: 'Opens to founding yards, in waves (per yardterminal.com)' },
    ],
    results: [
      { label: 'Records per part', value: 'One, whatever the channel' },
      { label: 'Channels live', value: 'eBay Motors, Shopify, counter POS' },
      { label: 'Listings published without approval', value: 'None: there is no auto-publish mode' },
      { label: 'Yards, listings synced, measured delist time', value: todo('Supply after the founding beta') },
    ],
    pending: ['Yards using it', 'Listings synced'],
    screenshot: {
      src: yardTerminalShot,
      alt: 'Yard Terminal home page: a decoded VIN with parts inheriting fitment, listed on eBay and Shopify.',
      caption: 'The public site, yardterminal.com. Parts, prices and counts in its hero graphic are the site’s demo values.',
    },
    link: { label: 'yardterminal.com', href: 'https://yardterminal.com' },
    seo: {
      title: 'Yard Terminal: Multi-Channel Listing SaaS | Faraz Ahmad',
      description:
        'Case study: Yard Terminal keeps one record per salvage part, lists it on eBay Motors and Shopify, and ends every other listing when it sells.',
    },
  },
  {
    id: 'farazahmad-dev',
    name: 'farazahmad.dev',
    kicker: 'Production Next.js app · my own',
    title: 'My own site, run like a product.',
    text: 'farazahmad.dev is a Next.js 16 app with its own admin CMS, authentication, a lead pipeline into GoHighLevel and a test suite. It is the codebase I hold to the same checks as client work, and the contact form on these niche sites sends into it.',
    status: { label: 'Live', live: true },
    facts: [
      '257 tests passing (6 Oct 2026)',
      'Lighthouse 100: Accessibility, Best Practices, SEO, Agentic browsing',
      'Every lead saved to MongoDB first, then sent to GoHighLevel',
    ],
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
    stack: [
      { name: 'Next.js 16' },
      { name: 'React 19' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS 4' },
      { name: 'MongoDB · Mongoose' },
      { name: 'Better Auth' },
      { name: 'zod' },
      { name: 'Tiptap' },
      { name: 'GSAP · Lenis' },
      { name: 'three.js' },
      { name: 'Sentry' },
      { name: 'PostHog' },
    ],
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
    link: { label: 'farazahmad.dev', href: 'https://farazahmad.dev' },
    seo: {
      title: 'farazahmad.dev: A Production Next.js App | Faraz Ahmad',
      description:
        'Case study: a Next.js 16 app with an admin CMS, auth, a lead pipeline into GoHighLevel, 257 passing tests and Lighthouse 100 in four categories.',
    },
  },
];

/** Small supporting cards: no page here, they link to the engineering write-ups on the ai niche. */
export const SUPPORTING = [
  {
    id: 'ai-seo-automator',
    name: 'AI SEO Automator',
    kicker: 'Self-serve SaaS',
    title: 'SEO that runs itself.',
    text: 'Audits a site, researches competitors and keywords, then writes and publishes content, on the owner’s own AI key.',
    pending: 'Key metric: to supply',
    href: `${AI_SITE_URL}/work/ai-seo-automator/`,
  },
  {
    id: 'lead-drift',
    name: 'Lead Drift',
    kicker: 'Internal product · in production',
    title: 'The growth engine for my own company.',
    text: 'A browser extension collects leads; automated outreach and email sequences follow up. Indepth Solution’s own growth engine, running in production.',
    pending: 'Key metric: not cleared yet',
    href: `${AI_SITE_URL}/work/lead-drift/`,
  },
] as const;

export const getCase = (slug: string): AppCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): AppCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[apps] no case after ${slug}`);
  return next;
}
