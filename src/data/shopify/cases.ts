/**
 * Case studies for the shopify niche: the home cards and the /work/<slug>/ pages.
 *
 * The three hand-written cases are EXAMPLES (owner's call, 2026-11-05: Yard Terminal is no
 * longer shown on this niche). Each is labelled as illustrative everywhere it appears and
 * describes a method, never a result. They follow what Shopify clients hire for:
 *  - `launch-sprint`: a new store, live soon (setup, bulk import, payments, test orders)
 *  - `search-ready`: products Google can find (Search Console, canonicals, schema, Merchant Center)
 *  - `sales-teardown`: a product page that sells (the signature section's fixes, ./teardown.ts)
 * Each carries one dashed TODO chip until a real, publishable store replaces it.
 *
 * Real builds come from the shared registry (src/person/projects.ts): every project listed for
 * 'shopify' becomes a generated case (MORE_CASES) in the home "More builds" shelf.
 */
import type { ImageMetadata } from 'astro';
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, exampleCase, type ResolvedAngle } from '../../person/case-helpers';
import { projectShot } from '../../person/shots';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { PERSON_NAME } from './site';
import { STEPS } from './teardown';

/** The registry projects this niche shows through a hand-written angle: none (all generated). */
export const NICHE_PROJECTS = [] as const satisfies readonly ProjectId[];

/**
 * Every slug this niche can have (the type); CASE_SLUGS lists the ones present. Generated cases
 * (MORE_CASES, below) use their project id.
 */
export type CaseSlug = 'launch-sprint' | 'search-ready' | 'sales-teardown' | ProjectId;

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
  /** Caveats from the registry (notes), shown on the case page. */
  readonly notes?: readonly string[];
  /** True for a case generated from the registry (MORE_CASES): registry facts only. */
  readonly generated?: boolean;
  /** Client work: a "Confidential client" mark, never a name. */
  readonly confidential?: boolean;
  /** The verified stack (generated cases). */
  readonly stack?: readonly string[];
  /** A real screenshot from the shared folder (generated cases). */
  readonly screenshot?: { readonly src: ImageMetadata; readonly alt: string };
}

/** Example: a new store launched against a fixed date. */
const launch = exampleCase<ShopifyCase>({
  id: 'launch-sprint',
  name: 'From zero to a live store',
  kicker: 'Example launch · illustrative',
  title: 'A new brand’s Shopify store, planned back from its launch date.',
  text: 'An illustrative launch for a small brand with a few hundred products in a spreadsheet and a launch date already announced. Not a client store; a walk-through of how I run a launch so the date holds and the store is found and selling from its first day.',
  status: null,
  example: true,
  flow: [
    'Launch date set on the call',
    'Theme picked and branded',
    'Products imported in bulk',
    'Payments, shipping, taxes',
    'Search Console and Merchant Center',
    'Test orders, then live',
  ],
  facts: [
    'The launch date is agreed first; the plan works back from it',
    'Products imported in bulk, never typed in one by one',
    'Google set up before launch, not months after',
  ],
  problem: {
    title: 'The date is set. The store isn’t.',
    text: 'The brand has products, photos and a launch date. What it doesn’t have is a store: a theme to choose, hundreds of products to enter, shipping rates, taxes, payments and legal pages, and nobody sure what has to happen in which order.',
  },
  built: [
    {
      title: 'A plan that works back from the date',
      text: 'On the scoping call we fix the launch date and list what has to be true on launch day. Everything is scheduled back from it, and what can wait until after launch is written down too, so it doesn’t creep in.',
    },
    {
      title: 'A proven theme, set up well',
      text: 'An Online Store 2.0 theme, branded and set up with sections your team edits. Custom sections only where the brand needs them, and never on the launch’s critical path.',
    },
    {
      title: 'Products in bulk',
      text: 'The spreadsheet is cleaned and mapped once: variants, options, photos, collections and metafields, then imported in bulk. Descriptions can be drafted with AI and checked by your team.',
    },
    {
      title: 'Store settings done properly',
      text: 'Shop Pay and express checkout, shipping zones and rates, taxes, the domain, customer emails, and the policy pages Shopify asks for.',
    },
    {
      title: 'Found from the first day',
      text: 'The sitemap submitted to Google Search Console, search titles and descriptions from product data, and products sent to Google Merchant Center so they can show in Shopping.',
    },
    {
      title: 'Test, then launch',
      text: 'Test orders paid, fulfilled and refunded, and every customer email checked on a phone. Then the password comes off at a quiet hour, with me on hand.',
    },
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'A live store on your own Shopify account, your catalogue imported, Google set up, a list of what comes after launch, and a recorded walkthrough of how to run it.',
  },
  pending: ['TODO · Replace with a real launch: store type, timeline, what shipped'],
  seo: {
    title: withNameSuffix('Shopify Store Launch: Example Plan', PERSON_NAME),
    description:
      'An illustrative Shopify launch: a plan worked back from the date, products imported in bulk, payments and shipping set up, Google ready, test orders.',
  },
});

/** Example: a live store whose products Google mostly hasn't indexed. */
const search = exampleCase<ShopifyCase>({
  id: 'search-ready',
  name: 'Products Google can find',
  kicker: 'Example audit · illustrative',
  title: 'Why a live store shows only part of its catalogue on Google, and the fixes.',
  text: 'An illustrative store with a few hundred products, where Search Console lists most product pages as not indexed. Not a client store; a walk-through of how I find the causes and fix them.',
  status: null,
  example: true,
  flow: [
    'Read the indexing report',
    'One URL per product',
    'One valid product schema',
    'Titles from product data',
    'Merchant Center feed',
    'Re-submit and watch',
  ],
  facts: [
    'Search Console’s own reasons, worked through one by one',
    'Duplicate URLs folded into one page per product',
    'One product schema, with price and stock that match the page',
  ],
  problem: {
    title: 'Live, but not on Google',
    text: 'The store has been live for months. Search Console lists most product pages as discovered or crawled but not indexed, two apps each add their own product schema, and every product reached through a collection has a second URL. Shoppers searching for the exact product find someone else’s.',
  },
  built: [
    {
      title: 'Read Google’s own reasons',
      text: 'The Pages report in Search Console says why each page is not indexed. The reasons are grouped and fixed in order of how many products each one holds back.',
    },
    {
      title: 'One URL per product',
      text: 'Product links inside collections point at the product’s own URL, so Google sees one page per product, not two. The collection-path URLs keep working and point Google at that main page.',
    },
    {
      title: 'One clean product schema',
      text: 'The theme outputs a single Product block with price, stock and reviews that match the page, and the app-added duplicates are switched off. Checked with Google’s Rich Results Test.',
    },
    {
      title: 'Search titles from product data',
      text: 'Titles and descriptions for search built from each product’s own fields and metafields, so hundreds of pages are not left on the default.',
    },
    {
      title: 'A clean Shopping feed',
      text: 'Products sent to Google Merchant Center through Shopify’s Google channel, with the feed errors cleared, so they can appear in Shopping results and free listings.',
    },
    {
      title: 'Re-submit and watch',
      text: 'The sitemap re-submitted, key pages requested for indexing, and the report read again over the following weeks. Rankings are never promised; being findable is.',
    },
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'Every not-indexed reason with its fix, the fixes made on a staging theme, a clean Merchant Center feed, and the Search Console report read again the same way afterwards.',
  },
  pending: ['TODO · Replace with a real store: indexed product pages before and after'],
  seo: {
    title: withNameSuffix('Shopify Google Indexing: Example Audit', PERSON_NAME),
    description:
      'An illustrative Shopify indexing audit: Search Console reasons, duplicate collection URLs, one product schema, titles from data and a Merchant Center feed.',
  },
});

/** Example: the signature section's product page, as a case. */
const sales = exampleCase<ShopifyCase>({
  id: 'sales-teardown',
  name: 'A product page that sells',
  kicker: 'Example teardown · illustrative',
  title: 'What a sales review finds on a product page, and how the fixes go in.',
  text: 'The example product page from the home page teardown: hard for Google to read, one blurry photo, no reason to add a second item, and delivery and returns nowhere to be found. Not a client store; a walk-through of how I review and fix one.',
  status: null,
  example: true,
  flow: STEPS.filter((s) => s.fix).map((s) => s.short),
  facts: [
    'Tracking set up first, so every change can be measured',
    'Fixes made on an unpublished copy of the theme',
    'Theme sections instead of another monthly app',
  ],
  problem: {
    title: 'Visitors arrive, browse and leave',
    text: 'The ads and the emails bring people to the product page. Then they hit a blurry photo, no word on delivery or returns, and an Add to cart button they have to scroll back up to find. Each one is small; together they decide whether someone buys.',
  },
  built: [
    {
      title: 'Measure first',
      text: 'Add-to-cart, checkout and purchase events checked in analytics, so the before and after are measured the same way. Without that, nobody can say what a change did.',
    },
    ...STEPS.filter((s) => s.fix).map((s) => ({ title: s.title, text: s.text })),
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'A ranked list of what stops people buying, the fixes made on a staging theme, tracking you can trust, and the same numbers read before and after.',
  },
  pending: ['TODO · Replace with a real store: conversion and order value before and after'],
  seo: {
    title: withNameSuffix('Shopify Product Page Review: Example', PERSON_NAME),
    description:
      'An illustrative Shopify product page review: product schema, photos, a free-shipping bar, delivery and returns up front, and sticky add to cart on phones.',
  },
});

export const CASES: readonly ShopifyCase[] = [launch, search, sales];

/**
 * The one adapter: a registry project listed for 'shopify' with no hand-written angle here →
 * a generated case. Registry facts only (angles.shopify or the canonical fields): no pending
 * TODO chips, no numbers. Rendered in the home "More builds" shelf and on its own case page.
 */
const generated = (p: Project, a: ResolvedAngle): ShopifyCase => {
  const shot = projectShot(p);
  return {
    id: p.id,
    name: p.name,
    kicker: a.kicker,
    title: a.line,
    text: p.summary ?? a.line,
    status: p.status ?? null,
    example: false,
    generated: true,
    confidential: a.confidential,
    flow: a.flow,
    facts: a.built.slice(0, 3).map((b) => b.title),
    ...(a.problem ? { problem: a.problem } : { problem: { title: a.title, text: p.summary ?? a.line } }),
    built: a.built,
    runsNow: {
      label: 'Where it is now',
      text: p.status ? `${p.status}.` : a.confidential ? 'Built for a client, who stays confidential.' : 'One of my own builds.',
    },
    pending: [],
    notes: p.notes ?? [],
    stack: p.stack?.items ?? [],
    ...(shot ? { screenshot: shot } : {}),
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}. ${a.line}`, `Case study: ${p.name}.`),
    },
  };
};

/** Generated cases (registry order), minus every project a hand-written case above shows. */
export const MORE_CASES: readonly ShopifyCase[] = autoCases('shopify', CASES.filter((c) => !c.example).map((c) => c.id), generated);

/** Every case with a page: hand-written first, then generated. */
export const ALL_CASES: readonly ShopifyCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.id);

export const getCase = (slug: string): ShopifyCase | undefined => ALL_CASES.find((c) => c.id === slug);

/**
 * Next case in a fixed ring through every case (hand-written, then generated); undefined when the
 * case is the only one (no self-link).
 */
export function nextCase(slug: CaseSlug): ShopifyCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.id === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.id !== slug ? next : undefined;
}
