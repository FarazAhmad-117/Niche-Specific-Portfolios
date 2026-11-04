/**
 * Case studies for the seo niche (decisions.md › seo › Proof).
 *
 *  - AI SEO Automator: facts from the registry (code scan of 2026-11-05: multi-tenant, for
 *    agencies and freelancers, approval gates, WordPress publishing; Webflow/Shopify planned).
 *    Its results are todo() chips until the owner supplies numbers. Its screenshot's dashboard
 *    figures are a mock-up: never quoted.
 *  - Generated cases (MORE_CASES): every other registry project whose `niches` lists 'seo'
 *    (Furniture Bazar today), built by `fromRegistry()` below from registry facts only, shown
 *    in the home "More builds" section (components/seo/MoreBuilds.astro) with the same page,
 *    OG image, JSON-LD and sitemap entry as the hand-written ones.
 *  - farazahmad.dev: the Lighthouse facts from decisions.md (seo + apps sections) and the
 *    shipped SEO surfaces (llms.txt, ai-catalog, sitemap, canonical URLs, JSON-LD).
 *  - Any client site: no data yet, so a card with a visible placeholder and no page.
 *
 * Values are plain strings (verified) or todo(...) (missing, shown as a chip). There are no
 * illustrative numbers here.
 *
 * Project-owned values (name, role, client, summary, modules, flow, link, status) come from the
 * shared registry (src/person/projects.ts); everything else below is this niche's angle,
 * verbatim. A case whose project the person does not have is omitted (no page, no OG image, no
 * sitemap entry), and the home results list shows OWN_RESULT_SLOT when CASES is empty (no project case is left),
 * so no one else's project is ever shown.
 */
import type { ImageMetadata } from 'astro';
import { todo, type Field } from './todo';
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, fact, fromProject, modules, present, type ResolvedAngle } from '../../person/case-helpers';
import { projectShot } from '../../person/shots';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { nicheHost } from '../../niches';
import { PERSON_NAME } from './site';

/** The registry projects this niche shows, in result order. */
export const NICHE_PROJECTS = ['ai-seo-automator', 'farazahmad-dev'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'ai-seo-automator' | 'farazahmad-dev' | ProjectId;

export interface Score {
  readonly label: string;
  /** 0..100 for a ring; a string range is shown as text. */
  readonly value: number;
  readonly display?: string;
}

export interface CaseStudy {
  readonly slug: CaseSlug;
  readonly name: string;
  readonly role: string;
  readonly client: string;
  readonly h1: string;
  /** SERP-card title on the home page (morphs into the h1). */
  readonly cardTitle: string;
  /** One-line angle for the card snippet and meta. Descriptive only. */
  readonly angle: string;
  readonly summary: string;
  /** Short "rich result" facts under the card snippet. Verified only. */
  readonly rich: readonly string[];
  readonly glance: readonly { readonly label: string; readonly value: Field }[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly code: string; readonly title: string; readonly text: string }[];
  /** Empty = the page leaves out its "How it runs" section (a generated case with no registry flow). */
  readonly flow: readonly string[];
  /** Lighthouse-style scorecard, only where measured. */
  readonly scores?: {
    readonly title: string;
    readonly note: string;
    readonly pages: readonly { readonly path: string; readonly seo: number }[];
    readonly home: readonly Score[];
  };
  /** Empty = the page leaves out the results table (generated cases print no results they do not have). */
  readonly results: readonly { readonly label: string; readonly value: Field; readonly source?: string }[];
  readonly lesson?: { readonly title: string; readonly text: string };
  /** Real screenshot from the shared folder (src/person/assets/projects/), when the project has one. */
  readonly shot?: { readonly src: ImageMetadata; readonly alt: string; readonly caption: string };
  /** Caveats from the registry (`notes`), printed on the case page. */
  readonly notes?: readonly string[];
  /** Built by the registry adapter below (no hand-written angle); listed under "More builds". */
  readonly generated?: boolean;
  /** Unnamed client work: the page shows a "Confidential client" label instead of a name. */
  readonly confidential?: boolean;
  /** Stack line for generated cases (hand-written cases keep theirs in the copy). */
  readonly stack?: readonly string[];
  /** Status label for generated cases, only when the registry has one. */
  readonly status?: string;
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  readonly og: { readonly eyebrow: string; readonly line: string };
}

/** The project's shared screenshot (src/person/shots.ts) with this niche's caption, or nothing. */
function shotOf(p: Project, caption: string): Pick<CaseStudy, 'shot'> {
  const s = projectShot(p);
  return s ? { shot: { ...s, caption } } : {};
}

/** The six automator modules, in the order this niche lists them (`code` = the module id). */
const AUTOMATOR_MODULES = ['crawl', 'keywords', 'publish', 'approvals', 'score', 'byok'] as const;

const automator = fromProject(
  'ai-seo-automator',
  (p): CaseStudy => ({
    slug: 'ai-seo-automator',
    name: p.name,
    role: p.role ?? 'Product · Engineering · AI',
    client: p.client ?? 'Multi-tenant SaaS · agencies and freelancers',
    h1: `${p.name}: SEO that runs itself.`,
    cardTitle: `${p.name}: SEO that runs itself`,
    angle: 'A multi-tenant SEO platform for agencies: it audits a site, plans content, writes it with AI and publishes to WordPress, behind human approval gates.',
    summary:
      p.summary ??
      `${p.name} is a multi-tenant SaaS that runs an automated SEO loop for websites: audit, plan, generate, publish, track and repeat, with configurable human approval gates.`,
    rich: ['Audit → plan → write → publish', 'Human approval gates', 'OpenAI · Claude · Gemini'],
    glance: [
      { label: 'What', value: 'Multi-tenant SEO automation SaaS' },
      { label: 'For', value: 'Agencies and freelancers' },
      { label: 'Pipeline', value: 'Audit, AI drafts and publishing run as queued jobs' },
      { label: 'AI', value: 'Each organisation’s own OpenAI, Claude or Gemini credentials' },
      { label: 'Publishing', value: 'WordPress today; Webflow and Shopify planned' },
      { label: 'Status', value: p.status ?? todo('case.ai-seo-automator.status', 'Live status and users') },
    ],
    problem: {
      title: fact(p, 'problemTitle'),
      text: fact(p, 'problemText'),
    },
    built: modules(p, AUTOMATOR_MODULES).map((m, i) => ({ code: AUTOMATOR_MODULES[i] ?? '', title: m.title, text: m.text })),
    flow: p.flow ?? ['Scrape and audit', 'Competitors and keywords', 'AI content', 'Publish', 'Health score'],
    results: [
      { label: 'Pages produced', value: todo('case.ai-seo-automator.pages', 'Pages produced') },
      { label: 'Time per page', value: todo('case.ai-seo-automator.time', 'Time per page, before and after') },
      {
        label: 'Impressions and clicks',
        value: todo('case.ai-seo-automator.gsc', 'Search Console growth, anonymized screenshot'),
      },
      { label: 'Site audit', value: 'Re-run as a queued job each time the loop repeats', source: 'The product’s code' },
    ],
    lesson: {
      title: 'What it taught me for client work',
      text: 'Automating the pipeline is the easy part. For client sites I keep the same research-to-publish pipeline but put a human editor and quality checks in front of publishing, so speed never costs quality.',
    },
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: SEO Automation Case Study`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, a multi-tenant SEO platform that audits sites, plans and writes content with AI and publishes to WordPress after human approval.`,
        `Case study: ${p.name}, a multi-tenant SEO platform that audits sites, writes content with AI and publishes it after human approval.`,
        `Case study: ${p.name}, an SEO platform that audits, writes and publishes, with human approval gates.`,
      ),
    },
    og: { eyebrow: 'CASE STUDY', line: 'SEO that runs itself: audit, plan, write, approve and publish.' },
    ...(p.notes ? { notes: p.notes } : {}),
    ...shotOf(p, 'The product’s landing page. The dashboard card on it is a design mock-up: its figures are not results.'),
  }),
);

/**
 * The person's own site. Every measured value below (Lighthouse runs, page paths, CLS) is a fact
 * about that one codebase, so it only exists while the person has the `farazahmad-dev` project.
 */
const ownSite = fromProject(
  'farazahmad-dev',
  (p): CaseStudy => ({
    slug: 'farazahmad-dev',
    name: p.name,
    role: 'Technical SEO · Engineering',
    client: 'My own site · a Next.js app',
    h1: `${p.name}: technical SEO, built into the code.`,
    cardTitle: `${p.name}: technical SEO, built into the code`,
    angle: 'My own Next.js site. Lighthouse SEO 100 on its five main pages, with canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog shipped by the app.',
    summary: `${p.name} is my own site, a Next.js app. The SEO is part of the code: canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog for agents ship with the app itself. Lighthouse 13.5 scores SEO 100 on all five main pages.`,
    rich: ['Lighthouse SEO 100 × 5 pages', 'CLS 0', 'llms.txt · ai-catalog · JSON-LD'],
    glance: [
      { label: 'What', value: 'My own site, a Next.js app' },
      { label: 'Lighthouse SEO', value: '100 on 5 pages' },
      { label: 'Home page', value: 'Accessibility, Best Practices, SEO, Agentic browsing: 100' },
      { label: 'Measured', value: 'Lighthouse 13.5, local production build, 2026-10-02' },
      { label: 'Traffic', value: todo('case.farazahmad-dev.traffic', 'Indexed pages and clicks from Search Console') },
    ],
    problem: {
      title: 'SEO that lives in a plugin breaks quietly',
      text: 'On most sites, the SEO is a layer on top: a plugin, a tag manager, a checklist someone ran once. When the code changes, the SEO drifts and nobody notices until traffic does.',
    },
    built: [
      { code: '<link rel="canonical">', title: 'Canonical URLs', text: 'Every page declares its one true URL, so duplicates never compete.' },
      { code: 'application/ld+json', title: 'JSON-LD', text: 'Structured data that tells search engines who I am and what I do.' },
      { code: '/sitemap.xml', title: 'A sitemap', text: 'Every public page listed for crawlers, shipped with the app.' },
      { code: '/llms.txt', title: 'llms.txt', text: 'A plain-text summary of the site for language models, served by the app.' },
      { code: '/.well-known/ai-catalog.json', title: 'An AI catalog', text: 'A machine-readable catalog that describes the site to AI agents.' },
      { code: 'CLS 0', title: 'Speed as an SEO feature', text: 'Layout shift at zero and desktop Performance at 100 on the home page.' },
    ],
    flow: ['Next.js routes', 'Metadata + JSON-LD', 'Sitemap + llms.txt', 'Crawlers and AI agents'],
    scores: {
      title: 'Lighthouse SEO, five pages',
      note: 'Lighthouse 13.5 on a local production build, measured 2026-10-02.',
      pages: [
        { path: '/', seo: 100 },
        { path: '/audit', seo: 100 },
        { path: '/templates', seo: 100 },
        { path: '/agencies', seo: 100 },
        { path: '/contact', seo: 100 },
      ],
      home: [
        { label: 'Accessibility', value: 100 },
        { label: 'Best Practices', value: 100 },
        { label: 'SEO', value: 100 },
        { label: 'Agentic browsing', value: 100 },
        { label: 'Performance · mobile', value: 93, display: '93–95' },
        { label: 'Performance · desktop', value: 100 },
      ],
    },
    results: [
      { label: 'Lighthouse SEO', value: '100 on /, /audit, /templates, /agencies and /contact', source: 'Lighthouse 13.5 · 2026-10-02' },
      { label: 'Cumulative Layout Shift', value: '0 on the home page', source: 'Lighthouse 13.5 · 2026-10-02' },
      { label: 'Shipped surfaces', value: 'llms.txt, ai-catalog, sitemap, canonical URLs, JSON-LD', source: 'The site’s code' },
      { label: 'Indexed pages and clicks', value: todo('case.farazahmad-dev.gsc', 'Search Console screenshot') },
    ],
    lesson: {
      title: 'Why this is the pitch',
      text: 'This is the whole idea in one site: SEO written into the code that renders the page, so it can’t drift when the site changes. I do the same in client codebases.',
    },
    ...(p.link ? { link: p.link } : {}),
    ...shotOf(p, `The home page of ${p.link?.label ?? p.name}, a screenshot of the live site.`),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Technical SEO in Code`, `${p.name}: Case Study`), PERSON_NAME),
      description:
        'Case study: technical SEO built into a Next.js site. Lighthouse SEO 100 on five pages, canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'Technical SEO built into the code: Lighthouse SEO 100 on five pages.' },
  }),
);

/** The hand-written cases (the home results list). Every existing home consumer reads this. */
export const CASES: readonly CaseStudy[] = present([automator, ownSite]);

/**
 * The adapter: one generated case for every registry project whose `niches` lists 'seo' and that
 * has no hand-written angle above. Wording comes from `angles.seo` (or the canonical fields);
 * only registry facts are printed: no results table, no lesson, no TODO chips.
 */
function fromRegistry(p: Project, a: ResolvedAngle): CaseStudy {
  const picks = p.angles?.seo?.modulePicks ?? (p.modules ?? []).map((m) => m.id);
  const stack = [...(p.stack?.items ?? [])];
  const confidential = a.confidential && !p.link;
  return {
    slug: p.id,
    name: p.name,
    role: a.kicker,
    client: confidential ? 'Confidential client' : (p.client ?? a.kicker),
    h1: a.title,
    cardTitle: a.title,
    angle: a.line,
    summary: p.summary ?? a.line,
    rich: [...(p.status ? [p.status] : []), ...a.built.slice(0, 3).map((b) => b.title)].slice(0, 3),
    glance: [
      { label: 'What', value: p.client ?? a.kicker },
      ...(p.status ? [{ label: 'Status', value: p.status }] : []),
      ...(p.link ? [{ label: 'Live at', value: p.link.label }] : []),
      ...(stack.length ? [{ label: 'Built with', value: stack.slice(0, 5).join(' · ') }] : []),
    ],
    problem: a.problem ?? { title: a.title, text: p.summary ?? a.line },
    built: a.built.map((b, i) => {
      const pick = picks[i];
      return { code: typeof pick === 'string' ? pick : (pick?.id ?? ''), title: b.title, text: b.text };
    }),
    flow: p.flow ?? [],
    results: [],
    ...(p.link ? { link: p.link } : {}),
    ...shotOf(p, p.link ? `The live site, ${p.link.label}: a screenshot of its home page.` : `A screenshot of ${p.name}.`),
    ...(p.notes ? { notes: p.notes } : {}),
    ...(p.status ? { status: p.status } : {}),
    generated: true,
    confidential,
    stack,
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${a.line}`, `Case study: ${p.name}.`),
    },
    og: { eyebrow: confidential ? 'CLIENT BUILD' : 'CASE STUDY', line: a.line },
  };
}

/** Generated cases, in registry order (the "More builds" section and their /work/<id>/ pages). */
export const MORE_CASES: readonly CaseStudy[] = autoCases('seo', CASES.map((c) => c.slug), fromRegistry);

/** Every case with a page: routes, OG images, JSON-LD and the sitemap read this. */
export const ALL_CASES: readonly CaseStudy[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.slug);

/** The home section's lede: it names only the kinds of work actually present. */
export const CASES_LEDE: string =
  automator && ownSite
    ? 'One product I built to automate SEO, and my own site, where every claim below is a page you can open. Client results go up as soon as their screenshots are cleared.'
    : automator
      ? 'One product I built to automate SEO, where every claim below is a page you can open. Client results go up as soon as their screenshots are cleared.'
      : ownSite
        ? 'My own site, where every claim below is a page you can open. Client results go up as soon as their screenshots are cleared.'
        : 'Every result here will be a page you can open. Projects and client results go up as soon as they are added and cleared.';

/** The niche's host as the results page prints it (`seo.example.com`). */
export const SEO_HOST = nicheHost('seo');

/** The third case: no data yet, a card only (decisions.md › seo › "Any client site"). */
export const CLIENT_CASE = {
  name: 'Client site',
  cardTitle: 'Client site: Search Console, before and after',
  angle: 'An anonymized client site: what the clicks and impressions graph looked like before the work, and after.',
  url: `${SEO_HOST} › work › client-site`,
  placeholder: todo('case.client.gsc', 'Anonymized Search Console screenshots, before and after'),
} as const;

/**
 * Placeholder result shown only when CASES is empty (the person has none of this niche's
 * projects, see NICHE_PROJECTS), so the section never reads as just one empty client card.
 * No page, no claims.
 */
export const OWN_RESULT_SLOT =
  CASES.length === 0
    ? ({
        name: 'Your project',
        cardTitle: 'Your own project: what you built, and what it measured',
        angle: 'A product or site of your own, with the SEO work in it and the numbers you can show.',
        url: `${SEO_HOST} › work › your-project`,
        placeholder: todo('case.own.project', 'Add your own project to src/person/projects.ts'),
      } as const)
    : undefined;

export const getCase = (slug: string): CaseStudy | undefined => ALL_CASES.find((c) => c.slug === slug);

/** The case after this one in ALL_CASES, wrapping round; undefined when it would be the same case. */
export function nextCase(slug: CaseSlug): CaseStudy | undefined {
  const i = ALL_CASES.findIndex((c) => c.slug === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.slug !== slug ? next : undefined;
}

/** Up to `max` other cases for the "related" links on a case page (next case excluded). */
export function relatedCases(slug: CaseSlug, max = 2): readonly CaseStudy[] {
  const skip = new Set([slug, nextCase(slug)?.slug]);
  return ALL_CASES.filter((c) => !skip.has(c.slug)).slice(0, max);
}
