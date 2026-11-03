/**
 * Copy for the seo home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › seo + global):
 *  - no prices anywhere: "scoped on a call"
 *  - no link building, said plainly
 *  - never invent numbers, rankings or client names; missing numbers are todo() chips,
 *    shape-only visuals carry an "Illustration" / "Example" label
 *  - no "rank #1", no guarantees, no black-hat language
 */
import { todo, type Field } from './todo';

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE =
  "You'll leave the call knowing what's blocking your site in search, and what fixing it involves";

export const HERO = {
  eyebrow: 'Technical SEO · Faraz Ahmad',
  /** decisions.md › seo › Hero headline. The middle phrase gets the marker. */
  headline: { before: 'SEO', marked: 'built into your code,', after: 'not bolted on.' },
  lede: 'I’m a full-stack engineer who does SEO from inside the codebase: technical fixes shipped as real changes, programmatic pages built on real data, and an AI content engine where a person edits every page.',
  primary: 'Book a scoping call',
  secondary: 'Get a technical audit',
  note: 'Free 30-minute call. No packages to decode: scope and cost are agreed on the call.',
} as const;

/**
 * Hero "snippet lab": four fixes in the page source, and what each one changes in how the
 * page shows up in search. The store, the query and the URLs are an example, labelled so.
 */
export interface LabFix {
  readonly id: 'title' | 'desc' | 'canonical' | 'schema';
  readonly code: string;
  readonly label: string;
}
export const LAB = {
  query: 'trail running shoes wide feet',
  site: 'Your Store',
  before: {
    url: 'yourstore.com › collections › all?sort=price&page=3',
    title: 'Home',
    snippet: 'Skip to content · Menu · Search · Cart (0) · Sign in · Free shipping on orders over… · Shop all · New in · Sale…',
  },
  after: {
    url: 'yourstore.com › trail › wide-fit',
    title: 'Trail running shoes for wide feet | Your Store',
    snippet: 'Wide-fit trail shoes with a roomy toe box and grippy outsoles. Filter by width, drop and terrain, and see what’s in stock today.',
    rich: 'In stock · Free returns',
  },
  fixes: [
    { id: 'title', code: '<title>', label: 'A title written for the query' },
    { id: 'desc', code: '<meta name="description">', label: 'A description, not scraped nav text' },
    { id: 'canonical', code: '<link rel="canonical">', label: 'One clean URL, not a filtered duplicate' },
    { id: 'schema', code: 'Product JSON-LD', label: 'Structured data for stock and returns' },
  ] satisfies readonly LabFix[],
} as const;

/** Proof strip: verified facts only. The one number we do not have yet is a placeholder. */
export interface ProofItem {
  readonly value: Field;
  readonly label: string;
}
export const PROOF: readonly ProofItem[] = [
  {
    value: '100',
    label: 'Lighthouse SEO score on five pages of farazahmad.dev (Lighthouse 13.5, local production build, 2026-10-02)',
  },
  { value: '6', label: 'Automated modules in AI SEO Automator, from site audit to publishing' },
  { value: '0', label: 'Links bought, swapped or built. I don’t do link building' },
  {
    value: todo('proof.clicks', 'Clicks gained: from Search Console screenshots'),
    label: 'Organic clicks gained for client sites, shown once anonymized screenshots are in',
  },
];

export const PROBLEM = {
  title: 'Content isn’t your problem.',
  titleMarked: 'Your site can’t be crawled, or your content can’t scale.',
  body: 'Most sites don’t need another blog post. They need search engines to reach, render and trust the pages they already have, and a way to publish good pages faster than one at a time.',
  /** Typical findings from a crawl. Status names an SEO lead will recognise; no client data. */
  groups: [
    {
      label: 'Can’t be crawled',
      items: [
        { code: 'Crawled – currently not indexed', text: 'Pages search engines found and chose to leave out.' },
        { code: '301 → 301 → 301 → 200', text: 'Redirect chains that waste crawl and dilute signals.' },
        { code: '<a onclick>', text: 'Links that only work with JavaScript, so crawlers never follow them.' },
      ],
    },
    {
      label: 'Can’t scale',
      items: [
        { code: '?sort=&page=', text: 'Thousands of filter URLs competing with the page you want to rank.' },
        { code: 'LCP · INP · CLS', text: 'Core Web Vitals failing on the templates that matter most.' },
        { code: '1 page / week', text: 'Content written one page at a time, with no system behind it.' },
      ],
    },
  ],
  resolution: 'Both are engineering problems. That’s the part I fix.',
} as const;

/**
 * Signature: the growth chart (brief §4 item 4). Phases of a typical engagement. The chart
 * itself is shape-only (no axis values, no counts) and labelled as an illustration until the
 * owner supplies real Search Console data (see src/data/seo/growth.ts).
 */
export interface GrowthPhase {
  readonly id: string;
  /** Where the phase starts on the chart, 0..1. */
  readonly x: number;
  readonly title: string;
  /** Short label printed on the chart's annotation flag. */
  readonly flag: string;
  readonly did: string;
  readonly see: string;
}
export const GROWTH = {
  title: 'Fix it, build it, then grow it.',
  lede: 'This is the shape a typical engagement draws in Search Console. Press play, or step through it.',
  phases: [
    {
      id: 'audit',
      x: 0,
      title: 'Audit',
      flag: 'Audit',
      did: 'I crawl the site, read the code and pull your Search Console data, then rank every problem by impact and effort.',
      see: 'Nothing moves yet. You get the fix list and know exactly what is wrong.',
    },
    {
      id: 'indexation',
      x: 0.2,
      title: 'Fixed indexation',
      flag: 'Fixed indexation',
      did: 'Canonicals, redirects, sitemaps, rendering and internal links fixed in the code, shipped as reviewable changes.',
      see: 'Impressions usually move first, as pages that were stuck get crawled and indexed.',
    },
    {
      id: 'programmatic',
      x: 0.44,
      title: 'Programmatic pages live',
      flag: 'Programmatic pages live',
      did: 'A template and a data pipeline generate pages for every real variation people search for, each with unique data.',
      see: 'New pages pick up long-tail impressions, and clicks start to follow.',
    },
    {
      id: 'engine',
      x: 0.66,
      title: 'Content engine live',
      flag: 'Content engine live',
      did: 'Research, brief, AI draft, human edit, publish: a pipeline that keeps shipping pages a person has read.',
      see: 'A steadier climb, because publishing no longer depends on someone finding time.',
    },
    {
      id: 'grow',
      x: 0.84,
      title: 'Grow and report',
      flag: 'Monthly reports',
      did: 'Monthly fixes, new pages and a report built from Search Console: what changed, what moved, what’s next.',
      see: 'You see the work and the result in the same place, every month.',
    },
  ] satisfies readonly GrowthPhase[],
} as const;

/** The content engine (brief §4 item 5). The human edit is the gate; nothing skips it. */
export interface EngineStep {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly gate?: boolean;
}
export const ENGINE = {
  title: 'AI does the legwork. A person signs off every page.',
  lede: 'The content engine I build for clients is a pipeline, not a prompt. Drafts are cheap; publishing is not. So the only way onto your site is through a human editor and a set of checks.',
  steps: [
    { id: 'research', title: 'Research', text: 'Keywords and search intent from real data, grouped into topics worth a page.' },
    { id: 'brief', title: 'Brief', text: 'An outline, the questions to answer, sources and internal links, per page.' },
    { id: 'draft', title: 'AI draft', text: 'A first draft written against the brief, with your product facts as input.' },
    {
      id: 'edit',
      title: 'Human edit',
      text: 'An editor checks facts, adds experience and voice, or sends it back. Nothing skips this step.',
      gate: true,
    },
    { id: 'checks', title: 'Quality checks', text: 'Duplication, thin content, links, schema and on-page basics must pass.' },
    { id: 'publish', title: 'Publish', text: 'Straight into your CMS, with sitemaps and internal links updated.' },
    { id: 'measure', title: 'Measure', text: 'Search Console data feeds the next round of research.' },
  ] satisfies readonly EngineStep[],
  rejectNote: 'Sent back with notes',
} as const;

/** decisions.md › seo › Offers. No prices: every card says "Scoped on a call". */
export interface Offer {
  readonly id: string;
  readonly name: string;
  readonly serviceType: string;
  readonly description: string;
  readonly includes: readonly string[];
  readonly featured?: boolean;
}
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Technical SEO audit',
    serviceType: 'Technical SEO audit',
    description:
      'Crawl, indexation, Core Web Vitals, structured data and internal links, checked against your code, not just a tool report. You get a fix list ranked by impact and effort.',
    includes: [
      'Crawl and index coverage review',
      'Core Web Vitals and rendering checks',
      'Structured data and internal link map',
      'A prioritized fix list with code-level notes',
    ],
    featured: true,
  },
  {
    id: 'fixes',
    name: 'Technical fixes',
    serviceType: 'Technical SEO implementation',
    description: 'I implement the audit in your codebase: redirects, canonicals, sitemaps, rendering, speed and schema.',
    includes: ['Changes you can review before they ship', 'Checked again after each release'],
  },
  {
    id: 'programmatic',
    name: 'Programmatic SEO build',
    serviceType: 'Programmatic SEO',
    description: 'A template and data pipeline that generates useful pages at scale, each with its own data, not swapped keywords.',
    includes: ['Thin or duplicate pages never publish', 'Sitemaps and internal links built with the pages'],
  },
  {
    id: 'engine',
    name: 'Content engine',
    serviceType: 'AI-assisted content pipeline',
    description: 'An AI-assisted research, brief, draft, human edit and publish pipeline that runs into your CMS.',
    includes: ['A person edits every page before it ships', 'Quality checks gate publishing'],
  },
  {
    id: 'growth',
    name: 'Monthly growth plan',
    serviceType: 'Ongoing SEO',
    description: 'Ongoing content and fixes, with a monthly report built from your Search Console data.',
    includes: ['New pages and fixes every month', 'Report: what changed, what moved, what’s next'],
  },
];

/** "How I keep it safe" (brief §4 item 8). Six items so the grid fills 3 × 2. */
export const SAFE = {
  title: 'Nothing that can get your site penalized.',
  items: [
    {
      code: 'links: none',
      title: 'No link building',
      text: 'I don’t buy, swap or build links. No networks, no guest-post farms. The work is your site itself: code, pages and content.',
    },
    {
      code: 'review: human',
      title: 'A person edits every page',
      text: 'AI drafts; an editor checks facts and adds what only you know. Drafts that aren’t good enough go back, not live.',
    },
    {
      code: 'gate: quality',
      title: 'Quality thresholds',
      text: 'Pages that are thin, duplicated or have no unique data fail the checks and don’t publish, however many there are.',
    },
    {
      code: 'policy: google',
      title: 'Inside Google’s guidelines',
      text: 'Everything is built to Google Search Essentials and its spam policies, including the rules on scaled content.',
    },
    {
      code: 'git revert',
      title: 'A rollback plan',
      text: 'Changes go through version control and ship in stages, so any change can be undone quickly if something moves the wrong way.',
    },
    {
      code: 'owner: you',
      title: 'Your accounts, your data',
      text: 'Search Console, analytics, code and content stay in your accounts. I work with access you can revoke.',
    },
  ],
} as const;

/** Process (brief §4 item 9): Audit → Fix → Build engine → Grow → Report. */
export const PROCESS = [
  { id: 'audit', title: 'Audit', text: 'Crawl, code and Search Console. You get a ranked fix list.' },
  { id: 'fix', title: 'Fix', text: 'The fixes, shipped in your codebase as reviewable changes.' },
  { id: 'build', title: 'Build engine', text: 'Programmatic pages and the content pipeline, if they fit.' },
  { id: 'grow', title: 'Grow', text: 'New pages and fixes every month, all human-reviewed.' },
  { id: 'report', title: 'Report', text: 'Search Console numbers: what changed and what’s next.' },
] as const;

export const ABOUT = {
  title: 'An engineer who does SEO, not the other way round.',
  paragraphs: [
    'I’m Faraz. I build software for a living, and I came to SEO from the code side: most of what holds a site back in search lives in its templates, its rendering and its URLs.',
    'I built AI SEO Automator, a platform that audits a site, researches keywords and competitors, writes content and publishes it. I overhauled my own site, farazahmad.dev, so it ships canonical URLs, JSON-LD, a sitemap, llms.txt and an AI catalog, and scores 100 for SEO in Lighthouse on its main pages.',
    'I don’t do link building, and I don’t promise rankings. I fix what’s in the code, build systems that publish pages worth reading, and report what Search Console shows.',
  ],
} as const;

/** FAQ (brief §5). Same text feeds the FAQPage JSON-LD. */
export const FAQ = [
  {
    q: 'How long until results?',
    a: 'Technical fixes can show in Search Console within weeks, once search engines recrawl the changed pages. Programmatic pages and content take months to build up. I won’t promise rankings or dates; I’ll show you what changed in Search Console every month.',
  },
  {
    q: 'Is AI content safe for rankings?',
    a: 'Google judges content on whether it is helpful, not on how it was produced. What gets sites penalized is publishing lots of low-value pages to manipulate rankings. In the engine I build, a person edits every page and pages that fail quality checks never publish.',
  },
  {
    q: 'Do you build links?',
    a: 'No. I don’t buy, swap or build links. My work is the site itself: technical fixes, programmatic pages and content. If your plan needs link building, I’ll say so and you can hire a specialist for it.',
  },
  {
    q: 'Can you work in my CMS or framework?',
    a: 'Most likely. Next.js and React apps are home ground, and most technical fixes live in templates, routing and data, which every stack has. Tell me what you run on the call and I’ll say plainly if it’s a fit.',
  },
  {
    q: 'What do monthly reports show?',
    a: 'What I changed that month, what moved in Search Console (clicks, impressions, indexed pages and the queries behind them), and what I plan next. Numbers come straight from your accounts.',
  },
  {
    q: 'Will a migration hurt traffic?',
    a: 'Done carelessly, yes. I map every old URL to its new one with redirects, keep canonicals, sitemaps and internal links consistent, and watch Search Console coverage after the switch. Every change can be rolled back.',
  },
] as const;
