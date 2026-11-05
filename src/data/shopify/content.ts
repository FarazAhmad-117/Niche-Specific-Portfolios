/**
 * Copy for the shopify home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Positioning (owner's call, 2026-11-05, overriding the earlier "faster store, fewer apps"
 * headline and the Yard Terminal sync map): what Shopify clients hire for is a store that is
 * LIVE SOON, FOUND ON GOOGLE and BUILT TO SELL. Speed is one tool inside that, not the pitch.
 *
 * Rules (docs/brief/DECISIONS.md › shopify):
 *  - no prices anywhere: "scoped on a call"
 *  - not a Shopify Partner: no partner language, badges or implied affiliation
 *  - Shopify Plus work is in scope, and the copy says so
 *  - no invented numbers: no launch-time guarantees, no ranking or conversion promises. The
 *    launch timeline is "weeks, not months" and agreed on the call; real results are TODO chips
 *  - no testimonials
 *  - Yard Terminal is not used on this niche at all
 * Real facts come from the project registry (src/person/projects.ts): the supplier catalogue
 * pipeline (`catalog-scraper-shopify`, a client build) and Quarry (`quarry`, own theme, in
 * progress). Each line that names one drops out when the person does not have that project.
 * Case studies live in ./cases.ts, the signature section's model in ./teardown.ts.
 */
import { getProject, slotsToFill } from '../../person/case-helpers';
import { PERSON } from '../../person/person';
import { FIRST_NAME, PROFESSION, ROLE_IN_SENTENCE, withArticle } from '../../person/claims';
import { PERSON_NAME } from './site';

/** Real Shopify builds this page's copy can cite; undefined when the person has no such project. */
const catalogPipeline = getProject('catalog-scraper-shopify');
const quarry = getProject('quarry');

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave the call with a launch date or a fix list, and what it involves";

export const HERO = {
  eyebrow: `Shopify developer · ${PERSON_NAME}`,
  /** Three lines; the last one, from `accentFrom`, is set in clay. */
  headline: ['A Shopify store,', 'live in weeks,', 'built to sell.'],
  accentFrom: 'built',
  lede: 'I launch Shopify stores fast, get your products found on Google, and fix what stops visitors from buying. New stores, moves from another platform, and stores you already run.',
  primary: 'Book a scoping call',
  secondary: 'See what a launch includes',
  note: 'Free 30-minute call. Shopify Plus stores too. No price list: scope, cost and launch date are agreed on the call.',
} as const;

export type Verdict = 'done' | 'submitted' | 'connected' | 'passed';

/**
 * The hero panel: an EXAMPLE launch checklist (labelled as such). Every line is a real part of
 * launching a Shopify store; the status is the method, not a result from a client store.
 */
export const HERO_RECEIPT = [
  { app: 'Theme', note: 'set up, branded, editable', verdict: 'done' },
  { app: 'Products', note: 'imported in bulk, with variants', verdict: 'done' },
  { app: 'Payments & shipping', note: 'Shop Pay, rates, taxes', verdict: 'done' },
  { app: 'Google', note: 'sitemap in Search Console', verdict: 'submitted' },
  { app: 'Sales channels', note: 'Google and Meta', verdict: 'connected' },
  { app: 'Test orders', note: 'paid, shipped, refunded', verdict: 'passed' },
] as const satisfies readonly { app: string; note: string; verdict: Verdict }[];

export const VERDICT_LABEL: Record<Verdict, string> = {
  done: 'Done',
  submitted: 'Submitted',
  connected: 'Connected',
  passed: 'Passed',
};

/** Proof strip. Facts only, each from the registry; store results are a TODO slot. */
export const PROOF: readonly { readonly value: string; readonly label: string }[] = [
  ...(catalogPipeline
    ? [
        {
          value: 'Bulk import',
          label: 'Built a pipeline that scrapes a supplier catalogue, writes descriptions with an LLM and uploads products to Shopify',
        },
      ]
    : []),
  ...(quarry ? [{ value: 'OS 2.0', label: `Building ${quarry.name}, my own Online Store 2.0 theme for the Shopify Theme Store` }] : []),
  { value: 'Plus', label: 'Shopify Plus stores are in scope, Plus-only features included' },
];

export const PROOF_TODO = {
  title: 'Store results',
  chip: 'TODO · Stores launched, with timelines and sales numbers',
} as const;

/** Extra TODO cells so the strip keeps complete rows of four (none for the current owner). */
export const PROOF_TODO_EXTRA: readonly { readonly title: string; readonly chip: string }[] = Array.from(
  { length: slotsToFill(PROOF.length + 1, 4) },
  (_, i) =>
    i === 0
      ? { title: 'Build proof', chip: 'TODO · A Shopify store or integration you built' }
      : { title: 'Another fact', chip: 'TODO · A verified fact about your Shopify work' },
);

/**
 * The problem: a store stuck at one of three points (not live, not found, not selling). The
 * panel is an EXAMPLE store's check, labelled; the tags are the problems that come up most.
 */
export const PROBLEM = {
  title: 'Not live yet, not on Google, or not selling.',
  body: 'Most stores I’m asked about are stuck at one of three points. The launch keeps slipping because products, payments and shipping aren’t set up. The store is live, but Google shows only part of it. Or visitors arrive, browse and leave.',
  resolution: 'I get it live, get it found, then get it selling.',
  fears: [
    'A launch date that keeps moving',
    'Hundreds of products still to enter by hand',
    'Product pages Google hasn’t indexed',
    'Visitors who browse and leave',
    'A developer who disappears after launch',
  ],
  panelTitle: 'Store check',
  okLabel: 'Working',
  needsLabel: 'Needs work',
  caption: 'An example store, not a client’s. The tags are the problems I find most often.',
  /** `icon` keys map to inline SVGs in Problem.astro; `fix` is the offer that solves the tag. */
  shelf: [
    { name: 'Products', icon: 'box', tag: 'Half the catalogue still in a spreadsheet', fix: 'launch' },
    { name: 'Checkout', icon: 'card', tag: null, fix: null },
    { name: 'Google', icon: 'search', tag: 'Most product pages not indexed', fix: 'search' },
    { name: 'Product page', icon: 'page', tag: 'No delivery or returns info', fix: 'sales' },
    { name: 'Payments', icon: 'coin', tag: null, fix: null },
    { name: 'Cart', icon: 'cart', tag: 'No reason to add one more', fix: 'sales' },
  ],
} as const;

/** Short label for the offer that fixes a Store check tile (the link text on the tile). */
export const FIX_LABEL = { launch: 'Store launch', search: 'Get found on Google', sales: 'Sales lift' } as const;

export interface Offer {
  readonly id: 'launch' | 'search' | 'sales' | 'build' | 'care';
  readonly name: string;
  /** "Pick this if". */
  readonly pickIf: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** The ladder: get live → get found → get selling → build what's missing → keep it running. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'launch',
    name: 'Store launch',
    pickIf: 'You need a store live, and soon.',
    description:
      'A new store, or a move from WooCommerce or another platform with your URLs redirected. Theme set up and branded, products imported in bulk, payments, shipping, taxes and legal pages done, and test orders placed before go-live.',
    serviceType: 'Shopify store setup and launch',
    gets: ['A launch date agreed first', 'Products imported in bulk', 'Test orders before go-live'],
    priceLine: PRICE_LINE,
    cta: 'Plan my launch',
  },
  {
    id: 'search',
    name: 'Get found on Google',
    pickIf: 'The store is live, but Google shows only part of it.',
    description:
      'Search Console’s indexing report worked through, duplicate URLs folded into one, a single valid product schema, search titles from your product data, and a clean Google Merchant Center feed so products can show in Shopping.',
    serviceType: 'Shopify SEO and Google indexing',
    gets: ['Every not-indexed reason worked through', 'Valid product schema', 'Merchant Center feed'],
    priceLine: PRICE_LINE,
    cta: 'Get my products found',
  },
  {
    id: 'sales',
    name: 'Sales lift',
    pickIf: 'Visitors arrive, browse and leave.',
    description:
      'Product pages, cart and checkout reviewed on a phone, then fixed: clearer photos, delivery and returns up front, bundles and a free-shipping threshold, express checkout, and tracking set up first so we can see what changed.',
    serviceType: 'Shopify conversion and order value optimisation',
    gets: ['Product page and cart fixes', 'Bundles and order bumps', 'Tracking to measure it'],
    priceLine: PRICE_LINE,
    cta: 'Book a sales review',
  },
  {
    id: 'build',
    name: 'Custom builds & integrations',
    pickIf: 'You need something no app does well.',
    description:
      'Custom theme sections, product configurators, B2B and checkout extensions, catalogue imports from suppliers, and ERP, 3PL or CRM connections, with logging and retries so nothing fails silently.',
    serviceType: 'Shopify custom development and integrations',
    gets: ['Custom sections and apps', 'Supplier catalogue imports', 'ERP, 3PL and CRM sync'],
    priceLine: 'Quoted after scoping',
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'Care plan',
    pickIf: 'It sells today, and you want it to next month too.',
    description: 'App and theme updates checked, new products and pages, Search Console watched, and small changes every month, on stores I built or reviewed.',
    serviceType: 'Shopify store maintenance',
    gets: ['Updates checked before they ship', 'Search Console watched', 'A monthly check-in'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

export const PLUS_NOTE =
  'Shopify Plus stores are in scope, including Plus-only work such as checkout customisation and B2B.';

/** "What every build includes". `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'blocks',
    title: 'Editable sections',
    text: 'Online Store 2.0 sections and blocks, so your team changes copy, images and layout in the theme editor, not in code.',
  },
  {
    icon: 'gauge',
    title: 'Found from day one',
    text: 'Sitemap submitted to Search Console, product schema checked and search titles set before launch, not months after.',
  },
  {
    icon: 'minus',
    title: 'No unnecessary apps',
    text: 'If the theme can do it cleanly, the theme does it. Apps stay where they earn their place and their monthly fee.',
  },
  {
    icon: 'copy',
    title: 'Staging theme first',
    text: 'Work happens on an unpublished copy of the theme or a test store. You preview it, and nothing touches the live store until you approve.',
  },
  {
    icon: 'branch',
    title: 'Code in version control',
    text: 'Theme code kept in Git, so every change has a history and a way back.',
  },
  {
    icon: 'play',
    title: 'Handover video',
    text: 'A recorded walkthrough of your own store: adding products, running a sale, reading the reports.',
  },
] as const;

/** Steps in order: Scope → Plan → Build → Launch → Grow. */
export const PROCESS = [
  {
    title: 'Scope',
    text: 'A free 30-minute call. For a new store we set the launch date; for a live one I look at Search Console, analytics and the store itself.',
    leaves: 'A date or a fix list',
  },
  {
    title: 'Plan',
    text: 'Pages, products, integrations and what has to be true on launch day, agreed on paper and scheduled back from the date.',
    leaves: 'A plan you sign off',
  },
  {
    title: 'Build',
    text: 'Built on a staging theme or a test store, products imported, checked on real phones, with code in version control.',
    leaves: 'A preview you can click',
  },
  {
    title: 'Launch',
    text: 'Test orders placed, then live at a quiet hour, with the sitemap submitted to Google and the previous theme kept for a one-click rollback.',
    leaves: 'A live store, on Google',
  },
  {
    title: 'Grow',
    text: 'A handover video, then, if you want it, a care plan: Search Console and sales watched, fixes and new pages every month.',
    leaves: 'A store that keeps selling',
  },
] as const;

export const ABOUT = {
  title: 'A full-stack developer who gets stores live and selling.',
  paragraphs: [
    // "I’m a full-stack engineer, so when" from config.ts › profession; else "When".
    `I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${PERSON.company}. ${PROFESSION ? `I’m ${withArticle(PROFESSION)}, so when` : 'When'} a store needs something no app does well, I write it instead of adding one more subscription.`,
    ...(catalogPipeline
      ? [
          'For a client I built the pipeline that fills a store: it scrapes a supplier’s catalogue, has an LLM write the descriptions, tags and categories, and uploads every product through the Shopify Admin API, so nobody types products in by hand.',
        ]
      : []),
    ...(quarry ? [`I’m also building ${quarry.name}, my own Online Store 2.0 theme for the Shopify Theme Store.`] : []),
    'The aim is the same on every store: live soon, found on Google, and easy to buy from.',
  ],
} as const;

export const FAQ = [
  {
    q: 'How fast can my store be live?',
    a: 'It depends on the catalogue, the design and the integrations. A store on a proven theme with its products ready to import takes weeks, not months; a custom theme or a large migration takes longer. You get a launch date on the scoping call, and the plan works back from it.',
  },
  {
    q: 'Can you import my products?',
    a: catalogPipeline
      ? 'Yes: from a spreadsheet, another platform or a supplier’s website, with variants, photos and collections. I have built a pipeline that scrapes a supplier catalogue, writes descriptions with an LLM and uploads every product through the Shopify Admin API, so a large catalogue is never typed in by hand.'
      : 'Yes: from a spreadsheet, another platform or a supplier’s website, with variants, photos and collections, imported in bulk rather than typed in by hand.',
  },
  {
    q: 'Why aren’t my products showing on Google?',
    a: 'Usually one of a few causes: pages Google crawled but chose not to index, duplicate URLs through collections, a sitemap that was never submitted, or two apps each adding their own product schema. I work through Search Console’s indexing report and fix the causes, then set up Google Merchant Center so products can show in Shopping too. I can’t promise rankings; I can make sure Google can find and read every product.',
  },
  {
    q: 'Can you increase my sales?',
    a: 'I remove what stops people buying and add what makes them buy more: clearer product pages, delivery and returns up front, bundles and a free-shipping threshold, express checkout. Tracking goes in first, so we see what changed. I won’t promise a number before I’ve seen your store.',
  },
  {
    q: 'Do I need a new theme?',
    a: 'Often not. A proven Online Store 2.0 theme, set up well, is the fastest way to launch. If your current theme has been patched past saving, a rebuild is usually cheaper over time. We decide together on the scoping call.',
  },
  {
    q: 'Do you work on Shopify Plus?',
    a: 'Yes. Shopify Plus stores are in scope, including Plus-only work such as checkout customisation and B2B. We check what your plan allows on the scoping call.',
  },
  {
    q: 'Will the launch or the changes disrupt sales?',
    a: 'They should not. Work happens on an unpublished theme or a test store, you approve a preview, and it goes live at a quiet hour with the previous theme kept so it can be rolled back in a click. On a migration, old URLs are redirected so search traffic follows.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on the store, the work and any integrations, so I scope it on a free 30-minute call. You know what is involved before anything is agreed.',
  },
  {
    q: 'Who owns the store and the code?',
    a: 'You do. The store is on your own Shopify account, I work with staff access you grant and can remove, and the theme, any custom app and the code all stay yours.',
  },
] as const;
