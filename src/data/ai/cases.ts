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
 *
 * Project-owned values (name, role, client, summary, status, live, link, stack, modules, flow,
 * screenshot alt, keyed facts) come from the shared registry (src/person/projects.ts), whose
 * canonical wording was taken from this file. Everything else below is this niche's angle,
 * verbatim. EXAMPLE MODE: a project missing from the registry drops its case (`present()`),
 * so its page, OG image and sitemap entry disappear and no one else's project is shown. The
 * home consumers (Capabilities, CaseCards, ProofStrip, About) cope with any count, zero included.
 */
import type { ImageMetadata } from 'astro';
import yardTerminalShot from '../../assets/ai/cases/yard-terminal-site.png';
import { getNiche } from '../../niches';
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, companyProjects, fact, fromProject, madeBy, modules, present, type ResolvedAngle } from '../../person/case-helpers';
import { projectShot } from '../../person/shots';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { BRAND_COMPANY, PERSON_NAME } from './site';
import { assertLaunchReady, sample, todo, type Field } from './todo';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['lead-drift', 'yard-terminal', 'solidmake', 'ai-seo-automator'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'lead-drift' | 'yard-terminal' | 'solidmake' | 'ai-seo-automator';

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
  /** Real product screenshot, when one exists. `caption` replaces the default "live page" caption. */
  readonly screenshot?: { readonly src: ImageMetadata; readonly alt: string; readonly caption?: string };
  /** Caveats from the registry (`notes`), shown on the case page. */
  readonly notes?: readonly string[];
  /** Hand-written cases are never generated. */
  readonly generated?: false;
  /**
   * Real screenshot of the project's own internal tool, when it has one (Lead Drift → Leadrift).
   * `shot` keys the image the case page imports itself (pages/ai/work/[slug].astro › TOOL_SHOTS:
   * importing it here instead would emit an extra copy of the original file). `bar` is the
   * frame's title bar text. The page captions it "<name>, the internal tool <team>'s sales team
   * works in: <does>".
   */
  readonly tool?: {
    readonly name: string;
    readonly shot: 'leadrift';
    readonly alt: string;
    readonly bar: string;
    readonly team: string;
    readonly does: string;
  };
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  /** OG image text (no placeholders, no samples, no numbering). */
  readonly og: { readonly eyebrow: string; readonly line: string };
}

/**
 * A case generated from the registry (a project whose `niches` lists 'ai' and that has no
 * hand-written angle here). Only registry facts: no headline figure, no baseline, no samples, no
 * TODO chips. Rendered in the home "More builds" section and on its own /work/<id>/ page.
 */
export interface GeneratedCase {
  readonly slug: ProjectId;
  readonly generated: true;
  readonly name: string;
  /** Eyebrow ("Client build · AI quoting"). */
  readonly kicker: string;
  /** "Client build", "Own product", … */
  readonly kind: string;
  readonly client: string;
  readonly h1: string;
  readonly angle: string;
  readonly summary: string;
  readonly status: { readonly label: string; readonly tone: CaseStatusTone } | null;
  readonly inProduction: boolean;
  readonly problem?: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly diagram: CaseDiagram;
  readonly stack: readonly string[];
  readonly stackProvisional: boolean;
  readonly notes: readonly string[];
  /** Client work: shown with a "Confidential client" mark, never a name. */
  readonly confidential: boolean;
  readonly screenshot?: { readonly src: ImageMetadata; readonly alt: string };
  readonly link?: { readonly label: string; readonly href: string };
  readonly repo?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  readonly og: { readonly eyebrow: string; readonly line: string };
}

/** Either kind of case: what the case route, OG images, JSON-LD and the sitemap read. */
export type AnyCase = CaseStudy | GeneratedCase;

/** The project's verified stack (registry), with its provisional flag. */
const stackOf = (p: Project): Pick<CaseStudy, 'stack' | 'stackProvisional'> => ({
  stack: [...(p.stack?.items ?? [])],
  stackProvisional: p.stack?.provisional ?? true,
});

/** The project's public link (registry), when it has one. */
const linkOf = (p: Project): Pick<CaseStudy, 'link'> => (p.link ? { link: p.link } : {});

/** The project's caveats (registry `notes`), when it has any. */
const notesOf = (p: Project): Pick<CaseStudy, 'notes'> => (p.notes?.length ? { notes: p.notes } : {});

/** Case page title: `<core> | <person name>`, shortened by the shared rule for long names. */
const caseTitle = (core: string): string => withNameSuffix(core, PERSON_NAME);

const leadDrift = fromProject(
  'lead-drift',
  (p): CaseStudy => ({
    slug: 'lead-drift',
    name: p.name,
    role: p.role ?? '',
    client: p.client ?? '',
    h1: `${p.name}: ${madeBy(p)}'s own growth engine, in production.`,
    angle: `Lead scraping and outreach in one system, built for ${madeBy(p)}’s own growth.`,
    summary: p.summary ?? '',
    status: p.status ? { label: p.status, tone: p.live ? 'live' : 'building' } : null,
    inProduction: p.live,
    year: sample('case.lead-drift.year', '2024'),
    headlineMetric: { label: 'Pipeline stages', value: '6' },
    problem: {
      title: fact(p, 'problemTitle'),
      text: fact(p, 'problemText'),
    },
    built: modules(p, ['scrape', 'outreach', 'sequences']),
    baseline: {
      story:
        'Before: prospecting, outreach and follow-up were manual steps. Leads were collected by hand and contacted when time allowed.',
      facts: [
        { label: 'Manual prospecting per week', value: sample('case.lead-drift.base.hours', '12 hours') },
        { label: 'Leads collected per week', value: sample('case.lead-drift.base.leads', '80') },
        { label: 'Follow-ups missed', value: sample('case.lead-drift.base.missed', 'About 1 in 3') },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: [
        { label: 'Extension scrape' },
        { label: 'Lead pipeline' },
        { label: 'Site crawl' },
        { label: 'Reminders' },
      ],
    },
    ...stackOf(p),
    results: [
      {
        label: 'Manual prospecting time',
        before: sample('case.lead-drift.r1.b', '12 h / week'),
        after: sample('case.lead-drift.r1.a', '2 h / week'),
      },
      {
        label: 'Leads collected',
        before: sample('case.lead-drift.r2.b', '80 / week'),
        after: sample('case.lead-drift.r2.a', '600 / week'),
      },
      { label: 'Next step on every lead', before: 'Kept in heads and sheets', after: 'One pipeline, with reminders' },
    ],
    runsNow: {
      statement: `Running in production as ${madeBy(p)}'s own growth engine.`,
      points: [
        'Lead capture, the pipeline, crawling and reminders run in production. Email sending is switched off for now.',
        'Built and maintained by the same engineer who runs it.',
      ],
    },
    // The internal tool's screenshot is shown only when the registry confirms it exists.
    ...(p.screenshot && p.toolName && p.toolText
      ? {
          tool: {
            name: p.toolName,
            shot: 'leadrift',
            alt: p.screenshot.alt,
            bar: `${p.toolName} · sign-in page`,
            team: madeBy(p),
            does: `${p.toolText} Screenshot of its sign-in page.`,
          },
        }
      : {}),
    ...linkOf(p),
    ...notesOf(p),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: AI Lead Automation in Production`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, ${madeBy(p)}'s own growth engine, running in production. Lead scraping and a lead pipeline with reminders, built end to end.`,
        `Case study: ${p.name}, ${madeBy(p)}'s own growth engine, running in production. Lead scraping and a lead pipeline.`,
        `Case study: ${p.name}, a growth engine running in production: lead scraping and a lead pipeline.`,
      ),
    },
    og: { eyebrow: 'CASE STUDY', line: `${madeBy(p)}'s own growth engine, running in production.` },
  }),
);

const yardTerminal = fromProject(
  'yard-terminal',
  (p): CaseStudy => ({
    slug: 'yard-terminal',
    name: p.name,
    role: p.role ?? '',
    client: p.client ?? '',
    h1: `${p.name}: AI listing software for auto salvage yards.`,
    angle: 'AI listing software for auto salvage yards: one record per part, built to list on eBay Motors and Shopify.',
    summary: p.summary ?? '',
    status: p.status ? { label: p.status, tone: p.live ? 'live' : 'building' } : null,
    inProduction: p.live,
    year: sample('case.yard-terminal.year', '2025'),
    headlineMetric: { label: 'Records per part', value: '1' },
    problem: {
      title: fact(p, 'problemTitle'),
      text: 'A yard sells one-off parts across more than one marketplace. Listing each part by hand in each place is slow, and a part sold on one channel can still be for sale on the other.',
    },
    built: modules(p, ['record', 'vin', 'approve', 'delist']),
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
        { label: 'eBay · sandbox' },
        { label: 'Shopify · not live yet' },
      ],
      fanOut: 2,
    },
    ...stackOf(p),
    results: [
      { label: 'Records per part', before: 'One per channel', after: 'One' },
      { label: 'Channels', before: 'Managed one by one', after: 'eBay in sandbox, Shopify built' },
      { label: 'AI-drafted listings', before: 'Written by hand', after: 'Every one human-approved' },
    ],
    runsNow: {
      statement: fact(p, 'runsNow'),
      points: [
        'Runs in the browser; works alongside yard-management systems rather than replacing them.',
        'Each yard’s data is isolated, with an append-only audit trail.',
      ],
    },
    ...(p.screenshot ? { screenshot: { src: yardTerminalShot, alt: p.screenshot.alt } } : {}),
    ...linkOf(p),
    ...notesOf(p),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: AI Listings for Salvage Yards`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, AI listing software for auto salvage yards. One record per part, built for eBay Motors and Shopify, every AI draft human-approved.`,
        `Case study: ${p.name}, AI listing software for auto salvage yards. One record per part, built for eBay Motors and Shopify.`,
        `Case study: ${p.name}, AI listing software for auto salvage yards.`,
      ),
    },
    og: { eyebrow: 'CASE STUDY', line: 'AI listing software for auto salvage yards, built for eBay Motors and Shopify.' },
  }),
);

const solidMake = fromProject(
  'solidmake',
  (p): CaseStudy => ({
    slug: 'solidmake',
    name: p.name,
    role: p.role ?? '',
    client: p.client ?? '',
    h1: `${p.name}: from a text description to a CAD file.`,
    angle: 'Custom AI beyond no-code: describe the part, get the STEP file.',
    summary: p.summary ?? '',
    // The registry's "Final-year project" is shown in the client line here, not as a pill.
    status: null,
    inProduction: p.live,
    year: sample('case.solidmake.year', '2025'),
    headlineMetric: { label: 'Output', value: 'STEP' },
    problem: {
      title: 'Hours in a CAD tool for a simple part',
      text: 'A mechanical engineer who needs a bracket or plate has to model it from scratch in SolidWorks or AutoCAD before it can be cut, bent or welded.',
    },
    built: modules(p, ['words', 'normalise', 'models', 'step']),
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
    ...stackOf(p),
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
    ...linkOf(p),
    ...notesOf(p),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: AI Agent Turns Text into CAD`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, custom AI that turns a text description into a CAD model (STEP file). AI agent development beyond no-code tools.`,
        `Case study: ${p.name}, custom AI that turns a text description into a CAD model (STEP file).`,
      ),
    },
    og: { eyebrow: 'CASE STUDY', line: 'Custom AI beyond no-code: describe the part, get the STEP file.' },
  }),
);

const aiSeoAutomator = fromProject(
  'ai-seo-automator',
  (p): CaseStudy => ({
    slug: 'ai-seo-automator',
    name: p.name,
    role: p.role ?? '',
    client: p.client ?? '',
    h1: `${p.name}: SEO that runs itself.`,
    angle: 'A multi-tenant SEO loop for agencies: audit, plan, write and publish, with human approval gates.',
    summary: p.summary ?? '',
    status: p.status ? { label: p.status, tone: p.live ? 'live' : 'building' } : null,
    inProduction: p.live,
    year: sample('case.ai-seo-automator.year', '2024'),
    headlineMetric: { label: 'AI providers', value: '3' },
    problem: {
      title: fact(p, 'problemTitle'),
      text: fact(p, 'problemText'),
    },
    built: modules(p, ['crawl', 'keywords', 'approvals', 'publish', 'score', 'byok']),
    baseline: {
      story: 'Before: audits, research, writing and publishing were separate manual jobs, done when time allowed.',
      facts: [
        { label: 'Time per published page', value: sample('case.ai-seo-automator.base.time', '3 hours') },
        { label: 'Pages published per week', value: sample('case.ai-seo-automator.base.pages', '2') },
      ],
    },
    diagram: {
      kind: 'nodes',
      nodes: (p.flow ?? []).map((label) => ({ label })),
    },
    ...stackOf(p),
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
      { label: 'Site audit', before: 'Occasional, manual', after: 'Queued, on every loop' },
    ],
    runsNow: {
      statement: 'Multi-tenant: each agency or freelancer runs its own organisation, with its own AI provider credentials.',
      points: ['Nothing publishes until it passes the approval gates the organisation sets.'],
    },
    // The shared screenshot (src/person/assets/projects/), when the registry has one. Its
    // dashboard card is a design mock-up: the caption says so, and no figure from it is quoted.
    ...(() => {
      const shot = projectShot(p);
      return shot
        ? { screenshot: { ...shot, caption: `${p.name}'s landing page. The dashboard card on it is a design mock-up: its figures are not results.` } }
        : {};
    })(),
    ...linkOf(p),
    ...notesOf(p),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, `${p.name}: AI Content Pipeline`, `${p.name}: Case Study`)),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, an AI content and SEO pipeline built as custom automation. The problem, the build, the stack and the result.`,
        `Case study: ${p.name}, an AI content and SEO pipeline built as custom automation.`,
      ),
    },
    og: { eyebrow: 'CASE STUDY', line: 'SEO that runs itself: audit, research, write and publish.' },
  }),
);

/** The cases present for this person, in card order (a missing project is dropped). */
export const CASES: readonly CaseStudy[] = present([leadDrift, yardTerminal, solidMake, aiSeoAutomator]);

/**
 * The one adapter: a registry project (no hand-written angle here) → this niche's generated case.
 * Wording from the project's `angles.ai` (or its canonical fields), via angleFor().
 */
const generated = (p: Project, a: ResolvedAngle): GeneratedCase => {
  const shot = projectShot(p);
  return {
    slug: p.id,
    generated: true,
    name: p.name,
    kicker: a.kicker,
    kind: a.confidential ? 'Client build' : a.kicker.split(' · ')[0] ?? 'Own product',
    client: p.client ?? (a.confidential ? 'Confidential client' : ''),
    h1: a.title,
    angle: a.line,
    summary: p.summary ?? a.line,
    status: p.status ? { label: p.status, tone: p.live ? 'live' : 'building' } : null,
    inProduction: p.live,
    ...(a.problem ? { problem: a.problem } : {}),
    built: a.built,
    diagram: { kind: 'nodes', nodes: a.flow.map((label) => ({ label })) },
    ...stackOf(p),
    notes: p.notes ?? [],
    confidential: a.confidential,
    ...(shot ? { screenshot: shot } : {}),
    ...(p.link ? { link: p.link } : {}),
    ...(p.repo ? { repo: p.repo } : {}),
    seo: {
      title: caseTitle(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`)),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}. ${a.line}`, `Case study: ${p.name}.`),
    },
    og: { eyebrow: a.confidential ? 'CLIENT BUILD' : 'CASE STUDY', line: a.line },
  };
};

/** Generated cases (registry order), minus every project a hand-written case above already shows. */
export const MORE_CASES: readonly GeneratedCase[] = autoCases('ai', CASES.map((c) => c.slug), generated);

/** Every case with a page: hand-written first, then generated. */
export const ALL_CASES: readonly AnyCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly ProjectId[] = ALL_CASES.map((c) => c.slug);

assertLaunchReady({ noindex: getNiche('ai').noindex, data: ALL_CASES, label: 'case studies' });

/** A hand-written case (the home consumers that read headline figures use this). */
export const getCase = (slug: string): CaseStudy | undefined => CASES.find((c) => c.slug === slug);

/** Any case with a page, hand-written or generated. */
export const getAnyCase = (slug: string): AnyCase | undefined => ALL_CASES.find((c) => c.slug === slug);

/**
 * Next case in the fixed ring: lead-drift → yard-terminal → solidmake → ai-seo-automator → the
 * generated cases → lead-drift (only the present ones). Undefined when there is no other case.
 */
export function nextCase(slug: ProjectId): AnyCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.slug === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.slug !== slug ? next : undefined;
}

/** The other generated cases, for the "more builds" links on a generated case page. */
export const relatedCases = (slug: ProjectId): readonly GeneratedCase[] => MORE_CASES.filter((c) => c.slug !== slug);

/**
 * This niche's projects that are products of the owner's company (registry `madeBy` equal to
 * the person's company), in card order, as the copy names them ("the company behind Lead Drift
 * and Yard Terminal"). Only the present ones are named.
 */
export const COMPANY_PROJECT_NAMES: readonly string[] = companyProjects(NICHE_PROJECTS)
  .filter((p) => p.madeBy === BRAND_COMPANY)
  .map((p) => p.name);

/** "A", "A and B", "A, B and C". Empty string for none. */
export function andList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Kept for call sites that only need "unknown" placeholders. */
export { todo };
