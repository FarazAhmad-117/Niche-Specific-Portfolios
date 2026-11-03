/**
 * Case studies for the shopify niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - docs/research/ai-web.md (Yard Terminal's own public site): one record per part with a
 *    quantity of one; listed on eBay Motors and a Shopify storefront; connects to the yard's
 *    OWN eBay and Shopify accounts; the other listing is ended when it sells, each ended
 *    listing verified against its channel and failed writes retried; a counter (POS) sale ends
 *    the listings too; fitment from the donor VIN; AI drafts, a person approves; pre-launch,
 *    opening to founding yards; no published customer count
 *  - src/data/ai/cases.ts (the same facts, already reviewed for the ai niche)
 * NOT supported in Yard Terminal, so never stated: Amazon, Google Shopping. Facebook
 * Marketplace is "coming soon" on its home page and "not supported" on /limits: shown as
 * coming soon at most. Real numbers per case are open: one dashed TODO chip per number.
 *
 * `speed-teardown` is an EXAMPLE (decisions: storefront work is open). It is labelled as
 * illustrative everywhere it appears and describes method, never results.
 */

export const CASE_SLUGS = ['yard-terminal', 'speed-teardown'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export interface ShopifyCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** True for an illustrative case: shown with an "Example" tag everywhere. */
  readonly example: boolean;
  /** The flow, in order. */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly runsNow: { readonly label: string; readonly text: string };
  /** Numbers and assets the owner still has to supply (each rendered as a dashed chip). */
  readonly pending: readonly string[];
  readonly link?: { readonly label: string; readonly href: string };
  readonly seo: { readonly title: string; readonly description: string };
}

export const CASES: readonly ShopifyCase[] = [
  {
    id: 'yard-terminal',
    name: 'Yard Terminal',
    kicker: 'Marketplace sync · main case',
    title: 'One record per part, listed on Shopify and eBay Motors, ended everywhere when it sells.',
    text: 'Yard Terminal is listing software I built for auto salvage yards. Every part is one record with a quantity of one. It is listed on the yard’s own Shopify storefront and on eBay Motors, and when it sells on one, the other listing is ended.',
    status: 'Opening to founding yards',
    example: false,
    flow: ['VIN decoded once', 'One record per part', 'AI draft, human approval', 'Listed on Shopify', 'Listed on eBay Motors', 'Sold once, ended everywhere'],
    facts: [
      'Connects to the yard’s own Shopify and eBay accounts',
      'One record owns the count; channels only hold listings',
      'A sale at the counter ends the online listings too',
      'Each ended listing is checked; a failed write is retried',
    ],
    problem: {
      title: 'One part, two shop windows, sold twice',
      text: 'A salvage yard sells one-off parts on more than one channel. Listing each part by hand in each place is slow, and a part sold on eBay Motors can still be for sale on the Shopify store until someone remembers to take it down.',
    },
    built: [
      {
        title: 'One record per part',
        text: 'Every part is a single record with a quantity of one. The record owns the count; Shopify and eBay Motors only hold listings of it.',
      },
      {
        title: 'Fitment from the donor VIN',
        text: 'A VIN is decoded once and every part from that vehicle inherits its year, make, model and engine, so nobody types fitment twice.',
      },
      {
        title: 'AI drafts, a person approves',
        text: 'An AI agent drafts each listing. Nothing publishes until a person approves it; there is no auto-publish mode.',
      },
      {
        title: 'Sold once, ended everywhere',
        text: 'When a part sells on one channel, or at the counter, its other listings are ended when the sale is recorded, not at the next scheduled run. Each ended listing is checked against its channel, and a failed write is retried until the end is confirmed.',
      },
      {
        title: 'Their accounts, not mine',
        text: 'Yard Terminal connects to each yard’s own Shopify and eBay accounts and never lists under its own. The store stays the yard’s.',
      },
    ],
    runsNow: {
      label: 'Where it is now',
      text: 'Pre-launch: opening to founding yards, with a waitlist and demo booking on yardterminal.com. There is no published customer count yet, so there are no results on this page either.',
    },
    pending: [
      'TODO · Parts / SKUs synced',
      'TODO · Measured sync time',
      'TODO · Overselling incidents, before and after',
      'TODO · Screenshots of the Shopify channel',
    ],
    link: { label: 'yardterminal.com', href: 'https://yardterminal.com' },
    seo: {
      title: 'Yard Terminal: Shopify and eBay Motors Sync | Faraz Ahmad',
      description:
        'Case study: Yard Terminal keeps one record per part, lists it on a Shopify storefront and eBay Motors, and ends the other listing when it sells.',
    },
  },
  {
    id: 'speed-teardown',
    name: 'Anatomy of a slow product page',
    kicker: 'Example teardown · illustrative',
    title: 'What a speed and app audit finds, and how the fixes go in.',
    text: 'An illustrative product page built from the problems that come up most on Shopify stores: oversized photos, code left behind by uninstalled apps, an app doing a theme’s job, a chat widget loading for everyone. Not a client store; a walk-through of how I audit and fix one.',
    status: null,
    example: true,
    flow: ['Measure what loads', 'A verdict per app', 'Fix on a staging theme', 'Check on real phones', 'Publish and hand over'],
    facts: [
      'Every app and script on the page listed, with a verdict',
      'Fixes made on an unpublished copy of the theme',
      'Nothing removed until we agree the list',
    ],
    problem: {
      title: 'Nobody knows what the page is loading',
      text: 'Every app adds a little: a script, a stylesheet, a widget. Some were uninstalled and left their code in the theme. Each one is small; together they decide how long a shopper waits before they can tap Add to cart.',
    },
    built: [
      {
        title: 'Measure what loads',
        text: 'The real product, collection and home pages measured on a phone profile, with every request listed, before anything changes.',
      },
      {
        title: 'A verdict for every app',
        text: 'Each app and script gets one: keep it, replace it with theme code, load it only when needed, or remove what an uninstalled app left behind.',
      },
      {
        title: 'Fix on a staging theme',
        text: 'Images sized and lazy-loaded, leftover code removed, small app jobs moved into sections, widgets deferred. All on an unpublished copy of the theme.',
      },
      {
        title: 'Check it on real phones',
        text: 'The preview checked on phones and measured the same way as before, so the comparison is fair.',
      },
      {
        title: 'Publish and hand over',
        text: 'Published when you approve, the old theme kept for a one-click rollback, and a recorded walkthrough of what changed.',
      },
    ],
    runsNow: {
      label: 'What you get at the end',
      text: 'A list of every app and script with a verdict, a ranked fix list, the fixes made on a staging theme, and before and after measurements taken the same way.',
    },
    pending: ['TODO · Replace with a real store teardown, with before and after numbers'],
    seo: {
      title: 'Shopify Speed Audit: Example Teardown | Faraz Ahmad',
      description:
        'An illustrative Shopify product page teardown: oversized photos, leftover app code, an app doing a theme’s job, and how a speed and app audit fixes them.',
    },
  },
];

export const getCase = (slug: string): ShopifyCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): ShopifyCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[shopify] no case after ${slug}`);
  return next;
}
