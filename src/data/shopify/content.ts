/**
 * Copy for the shopify home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › shopify):
 *  - no prices anywhere: "scoped on a call"
 *  - not a Shopify Partner: no partner language, badges or implied affiliation
 *  - Shopify Plus work is in scope, and the copy says so
 *  - the main real case is Yard Terminal (a team build, Indepth Solution's product). Its facts
 *    come from docs/research/ai-web.md (the product's own site) checked against the code scan
 *    (project-handoff/projects.json): one record per part, BUILT to list on eBay Motors and a
 *    Shopify storefront and end the other listing when it sells. Today the eBay channel runs in
 *    eBay's sandbox and the Shopify channel does not run yet. Amazon, Google Shopping and
 *    Facebook Marketplace are not built: never stated.
 *  - storefront (speed / conversion) work is open: a visible placeholder, never invented
 *  - no testimonials
 * Case studies live in ./cases.ts, the signature section's model in ./teardown.ts, the sync
 * map's in ./sync.ts.
 *
 * Owner identity comes from src/person (via ./site.ts) and the Yard Terminal copy from the
 * project registry: when the person has no `yard-terminal` project, the proof cells, About
 * paragraph and FAQ sentence that name it drop out (the proof strip gets TODO cells instead, so
 * it keeps four).
 */
import { getProject, slotsToFill } from '../../person/case-helpers';
import { PERSON } from '../../person/person';
import { FIRST_NAME, PROFESSION, ROLE_IN_SENTENCE, withArticle } from '../../person/claims';
import { PERSON_NAME } from './site';

/** The real project this page's sync copy is about; undefined in Example mode. */
const yardTerminal = getProject('yard-terminal');

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave the call knowing what's slowing the store down or what to build, and what it involves";

export const HERO = {
  eyebrow: `Shopify developer · ${PERSON_NAME}`,
  /** decisions.md › shopify › Hero headline. "fewer apps." is set in clay. */
  headline: ['A faster', 'Shopify store', 'with fewer apps.'],
  accentFrom: 'fewer',
  lede: 'I audit, build and extend Shopify stores: pages that load fast, apps only where they earn their place, themes your team can edit, and integrations that keep every channel in sync.',
  primary: 'Book a scoping call',
  secondary: 'Get a speed audit',
  note: 'Free 30-minute call. Shopify Plus stores too. No price list: scope and cost are agreed on the call.',
} as const;

export type Verdict = 'keep' | 'replace' | 'remove' | 'defer';

/**
 * The hero receipt: an EXAMPLE app audit (labelled as such). Every line is a common kind of
 * Shopify app and the verdict is the method, not a result from a client store.
 */
export const HERO_RECEIPT = [
  { app: 'Product reviews', note: 'earns its place', verdict: 'keep' },
  { app: 'Countdown bar', note: 'a theme section does it', verdict: 'replace' },
  { app: 'Old popup app', note: 'uninstalled, code still loads', verdict: 'remove' },
  { app: 'Live chat', note: 'loads when someone asks', verdict: 'defer' },
  { app: 'Size chart', note: 'a metafield and a block', verdict: 'replace' },
  { app: 'Upsell', note: 'earns its place', verdict: 'keep' },
] as const satisfies readonly { app: string; note: string; verdict: Verdict }[];

export const VERDICT_LABEL: Record<Verdict, string> = {
  keep: 'Keep',
  replace: 'Replace',
  remove: 'Remove',
  defer: 'Defer',
};

/** Proof strip (brief §4 item 2). Facts only; the storefront numbers are a TODO slot. */
export const PROOF: readonly { readonly value: string; readonly label: string }[] = [
  ...(yardTerminal
    ? [
        { value: '2 channels', label: `${yardTerminal.name} is built to list every part on Shopify and eBay Motors from one record` },
        { value: 'Sold once', label: 'Built so that when a part sells on one channel, its other listing is ended' },
      ]
    : []),
  { value: 'Plus', label: 'Shopify Plus stores are in scope, Plus-only features included' },
];

export const PROOF_TODO = {
  title: 'Storefront results',
  chip: 'TODO · Stores sped up, with before and after numbers',
} as const;

/** Extra TODO cells so the strip keeps complete rows of four (none for the current owner). */
export const PROOF_TODO_EXTRA: readonly { readonly title: string; readonly chip: string }[] = Array.from(
  { length: slotsToFill(PROOF.length + 1, 4) },
  (_, i) =>
    i === 0
      ? { title: 'Integration proof', chip: 'TODO · A sync or integration you built, with the channels it connects' }
      : { title: 'Another fact', chip: 'TODO · A verified fact about your Shopify work' },
);

/**
 * The problem (brief: "Every extra second and every extra app costs you sales"). The shelf of
 * apps is an EXAMPLE store, labelled; the tags are the fears from the brief.
 */
export const PROBLEM = {
  title: 'Every extra app is one more thing the page waits for.',
  body: 'Each app solved a real problem the week it went in. A year later the theme carries six scripts, two of them from apps nobody uses, and the product page is slower on a phone than anyone would accept in a shop.',
  resolution: 'I make the store lighter, then keep it that way.',
  fears: [
    'A slow product page on a phone',
    'App bloat, and a monthly fee for each small job',
    'A theme that breaks after an update',
    'Inventory out of sync across channels',
    'A developer who disappears after launch',
  ],
  shelf: [
    { name: 'Reviews', tag: null },
    { name: 'Countdown', tag: 'Monthly fee, one small job' },
    { name: 'Popup', tag: 'Uninstalled, code left behind' },
    { name: 'Chat', tag: 'Loads for every visitor' },
    { name: 'Size chart', tag: 'Another script on every page' },
    { name: 'Upsell', tag: null },
  ],
} as const;

export interface Offer {
  readonly id: 'audit' | 'theme' | 'features' | 'sync' | 'care';
  readonly name: string;
  /** "Pick this if". */
  readonly pickIf: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › shopify › Offers to show. Order follows the brief's ladder. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Speed & app audit',
    pickIf: 'The store feels slow and nobody can say why.',
    description:
      'I measure what your key pages load, review every app and script and the theme code, and hand you a fix list ranked by expected impact. I can make the fixes too.',
    serviceType: 'Shopify speed and app audit',
    gets: ['Every app and script, with a verdict', 'Core Web Vitals and theme review', 'A ranked fix list'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'theme',
    name: 'Theme build / rebuild',
    pickIf: 'The theme has been patched so often nobody wants to touch it.',
    description:
      'A custom Online Store 2.0 theme, or a clean rebuild of yours, with sections and blocks your team edits in the theme editor and a speed budget it has to meet.',
    serviceType: 'Shopify theme build and rebuild',
    gets: ['Sections your team can edit', 'Built on a staging theme', 'A speed budget it must meet'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'features',
    name: 'Custom features',
    pickIf: 'You need something no app does well, or one app too many does.',
    description:
      'Bundles, product configurators, B2B and checkout extensions, built into the theme or as a small custom app instead of another subscription.',
    serviceType: 'Shopify custom feature development',
    gets: ['Bundles and configurators', 'B2B and wholesale', 'Checkout extensions'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'sync',
    name: 'Integrations & sync',
    pickIf: 'Stock, orders or listings live in more than one place.',
    description:
      'Marketplaces, ERP, 3PL and CRM connected to Shopify, so inventory and orders stay in step, with logging and retries so nothing fails silently.',
    serviceType: 'Shopify integration and inventory sync',
    gets: ['Marketplaces and channels', 'ERP, 3PL and CRM', 'Logging and retries'],
    priceLine: 'Quoted after scoping',
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'Care plan',
    pickIf: 'It runs well today, and you want it to next month too.',
    description: 'App and theme updates checked, fixes and small changes every month, on stores I built or audited.',
    serviceType: 'Shopify store maintenance',
    gets: ['Updates checked before they ship', 'Fixes and small changes', 'A monthly check-in'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

export const PLUS_NOTE =
  'Shopify Plus stores are in scope, including Plus-only work such as checkout customisation and B2B.';

/** "What every build includes" (brief §4 item 8). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'blocks',
    title: 'Editable sections',
    text: 'Online Store 2.0 sections and blocks, so your team changes copy, images and layout in the theme editor, not in code.',
  },
  {
    icon: 'minus',
    title: 'No unnecessary apps',
    text: 'If the theme can do it cleanly, the theme does it. Apps stay where they earn their place and their fee.',
  },
  {
    icon: 'gauge',
    title: 'A speed budget',
    text: 'Agreed limits for images, scripts and page weight, checked before launch, so speed is a requirement, not a hope.',
  },
  {
    icon: 'copy',
    title: 'Staging theme first',
    text: 'Work happens on an unpublished copy of the theme. You preview it, and nothing touches the live store until you approve.',
  },
  {
    icon: 'branch',
    title: 'Code in version control',
    text: 'Theme code kept in Git, so every change has a history and a way back.',
  },
  {
    icon: 'play',
    title: 'Handover video',
    text: 'A recorded walkthrough of your own store and theme, so the knowledge stays with you.',
  },
] as const;

/** Steps in order (brief §4 item 9): Audit → Design/plan → Build → Launch → Care. */
export const PROCESS = [
  {
    title: 'Audit',
    text: 'A free 30-minute scoping call, then for an existing store a look at what really loads and what each app does.',
    leaves: 'A ranked fix list',
  },
  {
    title: 'Plan',
    text: 'Sections, features, integrations and the speed budget agreed on paper before anything is built.',
    leaves: 'A plan you sign off',
  },
  {
    title: 'Build',
    text: 'Built on a staging theme or a test store, checked on real phones, with code in version control.',
    leaves: 'A preview you can click',
  },
  {
    title: 'Launch',
    text: 'Published when you approve, at a quiet hour, with the previous theme kept so we can roll back in a click.',
    leaves: 'The new theme, live',
  },
  {
    title: 'Care',
    text: 'A handover video, and if you want it, a care plan that keeps me on updates, fixes and small changes.',
    leaves: 'A store you understand',
  },
] as const;

export const ABOUT = {
  title: 'A full-stack developer who builds the integration too.',
  paragraphs: [
    // "I’m a full-stack engineer, so when" from config.ts › profession; else "When".
    `I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${PERSON.company}. ${PROFESSION ? `I’m ${withArticle(PROFESSION)}, so when` : 'When'} a store needs something no app does well, I write it instead of adding one more subscription.`,
    ...(yardTerminal
      ? [
          `${yardTerminal.name} is my company’s product, built with my team: listing software that keeps one record per part, is built to list it on a Shopify storefront and on eBay Motors, and ends the other listing when it sells. That is the integration depth I bring to a store.`,
        ]
      : []),
    'Speed work is the same habit: see what actually loads, keep what earns its place, and replace the rest with theme code your team can still edit.',
  ],
} as const;

export const FAQ = [
  {
    q: 'Do I need a new theme, or can you fix the one I have?',
    a: 'Often the current theme can be fixed. The audit tells us which: if the theme is sound, I fix what slows it down; if it has been patched past saving, a rebuild on Online Store 2.0 is usually cheaper over time. We decide together, with the audit in front of us.',
  },
  {
    q: 'Can you speed up my current store?',
    a: 'Usually, yes. The common causes are oversized images, scripts left behind by uninstalled apps, apps doing jobs the theme could do, and third-party widgets that load for everyone. I measure before and after the same way, so you can see what changed.',
  },
  {
    q: 'Will my team be able to edit it?',
    a: 'Yes, that is the point of building with sections and blocks. Copy, images, collections and most layout changes happen in the theme editor. You also get a recorded walkthrough of your own store.',
  },
  {
    q: 'Do you work on Shopify Plus?',
    a: 'Yes. Shopify Plus stores are in scope, including Plus-only work such as checkout customisation and B2B. We check what your plan allows on the scoping call.',
  },
  {
    q: 'Which marketplaces can you sync?',
    a: yardTerminal
      ? `${yardTerminal.name}, my company’s product, is built to list on a Shopify storefront and eBay Motors from one record (eBay runs in its sandbox today; the Shopify channel is not live yet). For your store, other channels, an ERP or a 3PL depend on what their APIs allow; we check your exact setup on the call before anything is promised.`
      : 'For your store, marketplaces, an ERP or a 3PL depend on what their APIs allow; we check your exact setup on the call before anything is promised.',
  },
  {
    q: 'Will the launch disrupt sales?',
    a: 'It should not. Work happens on an unpublished theme or a test store, you approve a preview, and it is published at a quiet hour with the previous theme kept so it can be rolled back in a click.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on the store, the work and any integrations, so I scope it on a free 30-minute call. You know what is involved before anything is agreed.',
  },
  {
    q: 'Who owns the theme and the code?',
    a: 'You do. I work in your store with staff access you grant and can remove, and the theme, any custom app and the code all stay yours.',
  },
] as const;
