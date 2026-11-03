/**
 * Case studies for the seo niche (decisions.md › seo › Proof).
 *
 *  - AI SEO Automator: facts reused from src/data/ai/cases.ts (verified there); no new claims.
 *    Its results are todo() chips until the owner supplies numbers and screenshots.
 *  - farazahmad.dev: the Lighthouse facts from decisions.md (seo + apps sections) and the
 *    shipped SEO surfaces (llms.txt, ai-catalog, sitemap, canonical URLs, JSON-LD).
 *  - Any client site: no data yet, so a card with a visible placeholder and no page.
 *
 * Values are plain strings (verified) or todo(...) (missing, shown as a chip). There are no
 * illustrative numbers here.
 */
import { todo, type Field } from './todo';

export const CASE_SLUGS = ['ai-seo-automator', 'farazahmad-dev'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

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
  readonly flow: readonly string[];
  /** Lighthouse-style scorecard, only where measured. */
  readonly scores?: {
    readonly title: string;
    readonly note: string;
    readonly pages: readonly { readonly path: string; readonly seo: number }[];
    readonly home: readonly Score[];
  };
  readonly results: readonly { readonly label: string; readonly value: Field; readonly source?: string }[];
  readonly lesson: { readonly title: string; readonly text: string };
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
  readonly og: { readonly eyebrow: string; readonly line: string };
}

export const CASES: readonly CaseStudy[] = [
  {
    slug: 'ai-seo-automator',
    name: 'AI SEO Automator',
    role: 'Product · Engineering · AI',
    client: 'Self-serve product · site owners',
    h1: 'AI SEO Automator: SEO that runs itself.',
    cardTitle: 'AI SEO Automator: SEO that runs itself',
    angle: 'A self-serve platform that audits a site, researches keywords and competitors, writes content and publishes it, using the owner’s own AI key.',
    summary:
      'AI SEO Automator is a self-serve platform for site owners who want SEO on autopilot. It scrapes and audits a site, finds competitors, researches keywords, writes AI content and publishes it straight to the site, using the owner’s own AI API key.',
    rich: ['6 automated modules', 'Bring your own AI key', 'Audit → research → write → publish'],
    glance: [
      { label: 'What', value: 'Self-serve SEO automation platform' },
      { label: 'For', value: 'Site owners' },
      { label: 'Modules', value: '6, from audit to live health score' },
      { label: 'AI costs', value: 'On the owner’s own API key' },
      { label: 'Status', value: todo('case.ai-seo-automator.status', 'Live status and users') },
    ],
    problem: {
      title: 'SEO is a weekly chore nobody has time for',
      text: 'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop.',
    },
    built: [
      { code: 'crawl', title: 'Deep scrape and audit', text: 'Crawls the site and flags what is hurting it.' },
      {
        code: 'competitors',
        title: 'Competitors and alerts',
        text: 'Discovers competitors, researches their backlinks and alerts when they publish.',
      },
      { code: 'keywords', title: 'Keyword research', text: 'Finds the terms worth writing for.' },
      {
        code: 'publish',
        title: 'Content, written and published',
        text: 'AI generates the content and publishes it straight to the site.',
      },
      { code: 'score', title: 'A live health score', text: 'One number that shows how the site is doing, kept current.' },
      {
        code: 'byok',
        title: 'Bring your own AI key',
        text: 'Runs on the owner’s own AI API key, so costs and data stay theirs.',
      },
    ],
    flow: ['Scrape and audit', 'Competitors and keywords', 'AI content', 'Publish', 'Health score'],
    results: [
      { label: 'Pages produced', value: todo('case.ai-seo-automator.pages', 'Pages produced') },
      { label: 'Time per page', value: todo('case.ai-seo-automator.time', 'Time per page, before and after') },
      {
        label: 'Impressions and clicks',
        value: todo('case.ai-seo-automator.gsc', 'Search Console growth, anonymized screenshot'),
      },
      { label: 'Site audit', value: 'Continuous, with a live health score' },
    ],
    lesson: {
      title: 'What it taught me for client work',
      text: 'Automating the pipeline is the easy part. For client sites I keep the same research-to-publish pipeline but put a human editor and quality checks in front of publishing, so speed never costs quality.',
    },
    seo: {
      title: 'AI SEO Automator: SEO Automation Case Study | Faraz Ahmad',
      description:
        'Case study: AI SEO Automator, a self-serve platform that audits a site, researches keywords and competitors, writes content and publishes it.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'SEO that runs itself: audit, research, write and publish.' },
  },
  {
    slug: 'farazahmad-dev',
    name: 'farazahmad.dev',
    role: 'Technical SEO · Engineering',
    client: 'My own site · a Next.js app',
    h1: 'farazahmad.dev: technical SEO, built into the code.',
    cardTitle: 'farazahmad.dev: technical SEO, built into the code',
    angle: 'My own Next.js site. Lighthouse SEO 100 on its five main pages, with canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog shipped by the app.',
    summary:
      'farazahmad.dev is my own site, a Next.js app. The SEO is part of the code: canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog for agents ship with the app itself. Lighthouse 13.5 scores SEO 100 on all five main pages.',
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
    link: { label: 'farazahmad.dev', href: 'https://farazahmad.dev' },
    seo: {
      title: 'farazahmad.dev: Technical SEO in Code | Faraz Ahmad',
      description:
        'Case study: technical SEO built into a Next.js site. Lighthouse SEO 100 on five pages, canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog.',
    },
    og: { eyebrow: 'CASE STUDY', line: 'Technical SEO built into the code: Lighthouse SEO 100 on five pages.' },
  },
];

/** The third case: no data yet, a card only (decisions.md › seo › "Any client site"). */
export const CLIENT_CASE = {
  name: 'Client site',
  cardTitle: 'Client site: Search Console, before and after',
  angle: 'An anonymized client site: what the clicks and impressions graph looked like before the work, and after.',
  url: 'seo.farazahmad.dev › work › client-site',
  placeholder: todo('case.client.gsc', 'Anonymized Search Console screenshots, before and after'),
} as const;

export const getCase = (slug: string): CaseStudy | undefined => CASES.find((c) => c.slug === slug);

export function nextCase(slug: CaseSlug): CaseStudy {
  const i = CASES.findIndex((c) => c.slug === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`No case after ${slug}`);
  return next;
}
