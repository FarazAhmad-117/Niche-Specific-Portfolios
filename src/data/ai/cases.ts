/**
 * The four case studies (spec §6). One shape, three kinds of value:
 *
 *  - plain strings  verified facts: the owner's decisions.md, the owner's repo
 *                   (docs/research/ai-local.md) or the product's own public site
 *                   (docs/research/ai-web.md for Yard Terminal)
 *  - sample(...)    illustrative figures so the layout reads as finished while the real,
 *                   measured numbers are pending (see src/data/ai/todo.ts). Pages that show
 *                   one say so, they never reach meta/OG/JSON-LD, and the build refuses to run
 *                   with the niche indexable while any remain.
 *  - todo(...)      genuinely unknown; renders as a visible placeholder chip.
 *
 * Yard Terminal is pre-launch and its own /limits page says there is no customer count or
 * time-saved figure yet, so its results are verified product facts only: no samples.
 */
import type { ImageMetadata } from 'astro';
import yardTerminalShot from '../../assets/ai/cases/yard-terminal-site.png';
import { getNiche } from '../../niches';
import { assertLaunchReady, sample, todo, type Field } from './todo';

export const CASE_SLUGS = ['lead-drift', 'yard-terminal', 'solidmake', 'ai-seo-automator'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export interface DiagramNode {
  readonly label: Field;
}

export interface CaseDiagram {
  readonly kind: 'nodes';
  readonly nodes: readonly DiagramNode[];
  /** The last N nodes happen at the same time (outputs), not one after another. */
  readonly fanOut?: number;
}

export interface CaseMetric {
  readonly label: string;
  readonly before: Field;
  readonly after: Field;
}

export type CaseStatusTone = 'live' | 'building';

export interface CaseStudy {
  readonly slug: CaseSlug;
  readonly name: string;
  /** Role tags from the owner's repo, shown as the eyebrow ("Design · Engineering · AI"). */
  readonly role: string;
  /** Who it was built for. */
  readonly client: string;
  readonly h1: string;
  /** One-line angle for cards and meta. Descriptive only. */
  readonly angle: string;
  /** Two or three plain sentences: what it is and what it does. */
  readonly summary: string;
  readonly status: { readonly label: string; readonly tone: CaseStatusTone } | null;
  /** True only when the owner confirmed it is live (drives the lime status pill and OG pill). */
  readonly inProduction: boolean;
  /** Year. Repo fallbacks are unconfirmed, so they are samples until the owner confirms. */
  readonly year: Field;
  readonly headlineMetric: { readonly label: string; readonly value: Field };
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly baseline: {
    readonly story: string;
    readonly facts: readonly { readonly label: string; readonly value: Field }[];
  };
  readonly diagram: CaseDiagram;
  readonly stack: readonly string[];
  /** True while the stack is the owner's provisional default (not confirmed per project). */
  readonly stackProvisional: boolean;
  readonly results: readonly CaseMetric[];
  readonly runsNow: { readonly statement: string; readonly points: readonly string[] };
  /** Real product screenshot, when one exists. */
  readonly screenshot?: { readonly src: ImageMetadata; readonly alt: string };
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  /** OG image text (no placeholders, no samples, no numbering). */
  readonly og: { readonly eyebrow: string; readonly line: string };
}

/** The owner's provisional default while per-project stacks are unconfirmed. */
const DEFAULT_STACK = ['Next.js', 'React', 'Tailwind CSS', 'MongoDB'] as const;

export const CASES: readonly CaseStudy[] = [
  {
    slug: 'lead-drift',
    name: 'Lead Drift',
    role: 'Founder build · Indepth Solution',
    client: "Internal product · Indepth Solution's own growth engine",
    h1: "Lead Drift: Indepth Solution's own growth engine, in production.",
    angle: 'Lead scraping and outreach in one system, built for Indepth Solution’s own growth.',
    summary:
      "A browser extension scrapes leads from Google Maps, Yellow Pages, eBay and Apollo. Automated outreach workflows and email sequences then nurture them until they turn into work. It is Indepth Solution's own growth engine, and it runs in production.",
    status: { label: 'Running in production', tone: 'live' },
    inProduction: true,
    year: sample('case.lead-drift.year', '2024'),
    headlineMetric: { label: 'Lead sources', value: '4' },
    problem: {
      title: 'Growth that depended on someone remembering to do it',
      text: 'Finding prospects, writing to them and following up were separate chores in separate tools. Leads cooled while the next batch was still being copied into a sheet.',
    },
    built: [
      {
        title: 'Scrape from where buyers already are',
        text: 'A browser extension pulls leads from Google Maps, Yellow Pages, eBay and Apollo into one place.',
      },
      {
        title: 'Outreach that runs itself',
        text: 'Automated workflows send the first touch and the follow-ups, so nothing waits on a person.',
      },
      {
        title: 'Email sequences that nurture',
        text: 'Leads move through sequences until they reply, book or drop out, and the result feeds back into the system.',
      },
    ],
    baseline: {
      story:
        'Before: prospecting, outreach and follow-up were manual steps. Leads were collected by hand and contacted when time allowed.',
      facts: [
        { label: 'Manual prospecting per week', value: sample('case.lead-drift.base.hours', '12 hours') },
        { label: 'Leads contacted per week', value: sample('case.lead-drift.base.leads', '80') },
        { label: 'Follow-ups missed', value: sample('case.lead-drift.base.missed', 'About 1 in 3') },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: [
        { label: 'Extension scrape' },
        { label: 'Outreach workflow' },
        { label: 'Email sequence' },
        { label: 'Converted work' },
      ],
    },
    stack: [...DEFAULT_STACK],
    stackProvisional: true,
    results: [
      {
        label: 'Manual prospecting time',
        before: sample('case.lead-drift.r1.b', '12 h / week'),
        after: sample('case.lead-drift.r1.a', '2 h / week'),
      },
      {
        label: 'Leads contacted',
        before: sample('case.lead-drift.r2.b', '80 / week'),
        after: sample('case.lead-drift.r2.a', '600 / week'),
      },
      {
        label: 'Follow-ups sent on time',
        before: sample('case.lead-drift.r3.b', '66%'),
        after: sample('case.lead-drift.r3.a', '100%'),
      },
    ],
    runsNow: {
      statement: "Running in production as Indepth Solution's own growth engine.",
      points: ['Outreach and sequences run unattended.', 'Built and maintained by the same engineer who runs it.'],
    },
    seo: {
      title: 'Lead Drift: AI Lead Automation in Production | Faraz Ahmad',
      description:
        "Case study: Lead Drift, Indepth Solution's own growth engine, running in production. Lead scraping and automated outreach, built end to end.",
    },
    og: { eyebrow: 'CASE STUDY', line: "Indepth Solution's own growth engine, running in production." },
  },
  {
    slug: 'yard-terminal',
    name: 'Yard Terminal',
    role: 'Design · Engineering · AI',
    client: 'Own product · auto salvage yards · a product of Indepth Solution',
    h1: 'Yard Terminal: AI listing software for auto salvage yards.',
    angle: 'AI listing software for auto salvage yards: one record per part, listed on eBay Motors and Shopify.',
    summary:
      'Yard Terminal keeps one record for every part a salvage yard sells, lists it on eBay Motors and a Shopify storefront, and ends the other listings the moment it sells. An AI agent drafts each listing and a person approves it before it publishes.',
    status: { label: 'Opening to founding yards', tone: 'building' },
    inProduction: false,
    year: sample('case.yard-terminal.year', '2025'),
    headlineMetric: { label: 'Channels live', value: '2' },
    problem: {
      title: 'Salvage parts, listed twice and sold twice',
      text: 'A yard sells one-off parts across more than one marketplace. Listing each part by hand in each place is slow, and a part sold on one channel can still be for sale on the other.',
    },
    built: [
      {
        title: 'One record per part',
        text: 'Every part is a single record with quantity one, so the same part cannot be sold twice.',
      },
      {
        title: 'Decode the VIN once',
        text: 'A VIN is decoded once and every part from that donor vehicle inherits its year, make, model and engine.',
      },
      {
        title: 'AI drafts, a person approves',
        text: 'An AI agent writes each listing. Nothing publishes until a person approves it; there is no auto-publish mode.',
      },
      {
        title: 'Sold once, ended everywhere',
        text: 'When a part sells, or is sold at the counter, its other listings end. An append-only audit trail records what happened.',
      },
    ],
    baseline: {
      story:
        'Before: each part was typed into each marketplace separately, with fitment looked up by hand and stock tracked across tabs.',
      facts: [
        { label: 'Marketplaces', value: 'One login and one set of tabs per channel' },
        { label: 'Fitment', value: 'Looked up part by part' },
        { label: 'Overselling', value: 'Prevented by whoever remembered to delist' },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: [
        { label: 'VIN decode' },
        { label: 'Part record' },
        { label: 'AI draft' },
        { label: 'Human approval' },
        { label: 'eBay Motors' },
        { label: 'Shopify' },
      ],
      fanOut: 2,
    },
    stack: ['NestJS', ...DEFAULT_STACK],
    stackProvisional: true,
    results: [
      { label: 'Records per part', before: 'One per channel', after: 'One' },
      { label: 'Channels live', before: 'Managed one by one', after: 'eBay Motors and Shopify' },
      { label: 'AI-drafted listings', before: 'Written by hand', after: 'Every one human-approved' },
    ],
    runsNow: {
      statement: 'Pre-launch. Opening to the first 200 founding yards, with a waitlist and demo booking open.',
      points: [
        'Runs in the browser; works alongside yard-management systems rather than replacing them.',
        'Each yard’s data is isolated, with an append-only audit trail.',
      ],
    },
    screenshot: {
      src: yardTerminalShot,
      alt: 'Yard Terminal home page: a decoded VIN with parts inheriting fitment, listed on eBay and Shopify.',
    },
    link: { label: 'yardterminal.com', href: 'https://yardterminal.com' },
    seo: {
      title: 'Yard Terminal: AI Listings for Salvage Yards | Faraz Ahmad',
      description:
        'Case study: Yard Terminal, AI listing software for auto salvage yards. One record per part, eBay Motors and Shopify, every AI draft human-approved.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'AI listing software for auto salvage yards: eBay Motors and Shopify.' },
  },
  {
    slug: 'solidmake',
    name: 'SolidMake',
    role: 'AI research · Engineering',
    client: 'Final-year project · mechanical engineers',
    h1: 'SolidMake: from a text description to a CAD file.',
    angle: 'Custom AI beyond no-code: describe the part, get the STEP file.',
    summary:
      'SolidMake turns a plain-language description of a part into a production-ready STEP file for cutting, bending and welding. It is not a thin wrapper around a chat model: it is built on the DeepCAD and Text2CAD research models, with prompt normalisation in front.',
    status: null,
    inProduction: false,
    year: sample('case.solidmake.year', '2025'),
    headlineMetric: { label: 'Output', value: 'STEP' },
    problem: {
      title: 'Hours in a CAD tool for a simple part',
      text: 'A mechanical engineer who needs a bracket or plate has to model it from scratch in SolidWorks or AutoCAD before it can be cut, bent or welded.',
    },
    built: [
      {
        title: 'Say it in words',
        text: 'The engineer describes the part in natural language, with no modelling steps.',
      },
      {
        title: 'Normalise the prompt',
        text: 'The description is cleaned and structured before it reaches the model, so similar requests give consistent results.',
      },
      {
        title: 'Custom models, not an API call',
        text: 'Built on DeepCAD and Text2CAD, with pre-designed training and an optimised process flow, in Python.',
      },
      {
        title: 'A file you can cut',
        text: 'The output is a STEP file ready for cutting, bending and welding.',
      },
    ],
    baseline: {
      story: 'Before: every part was modelled by hand in a CAD tool, however simple it was.',
      facts: [
        { label: 'Time to model a simple part', value: sample('case.solidmake.base.time', '40 minutes') },
        { label: 'Tool needed', value: 'A full CAD package and the skill to drive it' },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: [
        { label: 'Text prompt' },
        { label: 'Prompt normalisation' },
        { label: 'DeepCAD · Text2CAD' },
        { label: 'STEP file' },
      ],
    },
    stack: ['Python', 'DeepCAD', 'Text2CAD'],
    stackProvisional: false,
    results: [
      {
        label: 'Time per part',
        before: sample('case.solidmake.r1.b', '40 min'),
        after: sample('case.solidmake.r1.a', '3 min'),
      },
      { label: 'Skill needed', before: 'CAD modelling', after: 'A written description' },
      { label: 'Output', before: 'Native CAD file', after: 'STEP, ready for fabrication' },
    ],
    runsNow: {
      statement: 'The deepest technical build in the portfolio, and the owner’s final-year project.',
      points: ['Custom model work stays in Python: training pipelines and data preparation.'],
    },
    seo: {
      title: 'SolidMake: AI Agent Turns Text into CAD | Faraz Ahmad',
      description:
        'Case study: SolidMake, custom AI that turns a text description into a CAD model (STEP file). AI agent development beyond no-code tools.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'Custom AI beyond no-code: describe the part, get the STEP file.' },
  },
  {
    slug: 'ai-seo-automator',
    name: 'AI SEO Automator',
    role: 'Product · Engineering · AI',
    client: 'Self-serve product · site owners',
    h1: 'AI SEO Automator: SEO that runs itself.',
    angle: 'A self-serve platform that audits, researches and publishes, using your own AI key.',
    summary:
      'AI SEO Automator is a self-serve platform for site owners who want SEO on autopilot. It scrapes and audits a site, finds competitors, researches keywords, writes AI content and publishes it straight to the site, using the owner’s own AI API key.',
    status: null,
    inProduction: false,
    year: sample('case.ai-seo-automator.year', '2024'),
    headlineMetric: { label: 'Automated modules', value: '6' },
    problem: {
      title: 'SEO is a weekly chore nobody has time for',
      text: 'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop.',
    },
    built: [
      { title: 'Deep scrape and audit', text: 'Crawls the site and flags what is hurting it.' },
      {
        title: 'Competitors and alerts',
        text: 'Discovers competitors, researches their backlinks and alerts when they publish.',
      },
      { title: 'Keyword research', text: 'Finds the terms worth writing for.' },
      {
        title: 'Content, written and published',
        text: 'AI generates the content and publishes it straight to the site.',
      },
      {
        title: 'A live health score',
        text: 'One number that shows how the site is doing, kept current.',
      },
      {
        title: 'Bring your own AI key',
        text: 'Runs on the owner’s own AI API key, so costs and data stay theirs.',
      },
    ],
    baseline: {
      story: 'Before: audits, research, writing and publishing were separate manual jobs, done when time allowed.',
      facts: [
        { label: 'Time per published page', value: sample('case.ai-seo-automator.base.time', '3 hours') },
        { label: 'Pages published per week', value: sample('case.ai-seo-automator.base.pages', '2') },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: [
        { label: 'Scrape and audit' },
        { label: 'Competitors and keywords' },
        { label: 'AI content' },
        { label: 'Publish' },
        { label: 'Health score' },
      ],
    },
    stack: [...DEFAULT_STACK],
    stackProvisional: true,
    results: [
      {
        label: 'Pages published',
        before: sample('case.ai-seo-automator.r1.b', '2 / week'),
        after: sample('case.ai-seo-automator.r1.a', '20 / week'),
      },
      {
        label: 'Time per page',
        before: sample('case.ai-seo-automator.r2.b', '3 h'),
        after: sample('case.ai-seo-automator.r2.a', '15 min'),
      },
      { label: 'Site audit', before: 'Occasional, manual', after: 'Continuous, with a live score' },
    ],
    runsNow: {
      statement: 'Self-serve: site owners sign up, connect their own AI key and let it run.',
      points: ['Alerts tell the owner when a competitor publishes.'],
    },
    seo: {
      title: 'AI SEO Automator: AI Content Pipeline | Faraz Ahmad',
      description:
        'Case study: AI SEO Automator, an AI content and SEO pipeline built as custom automation. The problem, the build, the stack and the result.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'SEO that runs itself: audit, research, write and publish.' },
  },
];

assertLaunchReady({ noindex: getNiche('ai').noindex, data: CASES, label: 'case studies' });

export const getCase = (slug: string): CaseStudy | undefined => CASES.find((c) => c.slug === slug);

/** Next case in the fixed ring: lead-drift → yard-terminal → solidmake → ai-seo-automator → lead-drift. */
export function nextCase(slug: CaseSlug): CaseStudy {
  const i = CASES.findIndex((c) => c.slug === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`No case after ${slug}`);
  return next;
}

/** Kept for call sites that only need "unknown" placeholders. */
export { todo };
