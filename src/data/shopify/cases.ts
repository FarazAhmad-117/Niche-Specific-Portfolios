/**
 * Case studies for the shopify niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - docs/research/ai-web.md (Yard Terminal's own public site): one record per part with a
 *    quantity of one; BUILT to list on eBay Motors and a Shopify storefront and to connect to the
 *    yard's OWN eBay and Shopify accounts (code scan: eBay runs in its sandbox today, the Shopify
 *    channel does not run yet); the other listing is ended when it sells, each ended
 *    listing verified against its channel and failed writes retried; a counter (POS) sale ends
 *    the listings too; fitment from the donor VIN; AI drafts, a person approves; pre-launch,
 *    opening to founding yards; no published customer count
 *  - src/data/ai/cases.ts (the same facts, already reviewed for the ai niche)
 * NOT built in Yard Terminal, so never stated: Amazon, Google Shopping, Facebook Marketplace. Real numbers per case are open: one dashed TODO chip per number.
 *
 * `speed-teardown` is an EXAMPLE (decisions: storefront work is open). It is labelled as
 * illustrative everywhere it appears and describes method, never results.
 *
 * Project-owned values (name, status, link, module titles) come from the shared registry
 * (src/person/projects.ts); everything else below is this niche's angle, verbatim. When the
 * person has no `yard-terminal` project the case is omitted (Example mode): the home page shows
 * OWN_PROJECT_SLOT in its place, and no page, OG image or sitemap entry is generated for it.
 */
import type { ImageMetadata } from 'astro';
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, exampleCase, fromProject, modules, present, type ResolvedAngle } from '../../person/case-helpers';
import { projectShot } from '../../person/shots';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { PERSON_NAME } from './site';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['yard-terminal'] as const satisfies readonly ProjectId[];

/**
 * Every slug this niche can have (the type); CASE_SLUGS lists the ones present. Generated cases
 * (MORE_CASES, below) use their project id.
 */
export type CaseSlug = 'yard-terminal' | 'speed-teardown' | ProjectId;

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
  /** Caveats from the registry (
otes), shown on the case page. */
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

/** Yard Terminal from the registry, with the shopify angle (marketplace sync). */
const yardTerminal = fromProject(
  'yard-terminal',
  (p): ShopifyCase => ({
    id: 'yard-terminal',
    name: p.name,
    kicker: 'Marketplace sync · main case',
    title: 'One record per part, built to list on Shopify and eBay Motors and end everywhere when it sells.',
    text: `${p.name} is listing software for auto salvage yards, built by my team at ${p.madeBy ?? 'my company'}. Every part is one record with a quantity of one. It is built to list on the yard’s own Shopify storefront and on eBay Motors, and when it sells on one, to end the other listing. Today the eBay channel runs in eBay’s sandbox and the Shopify channel is not live yet.`,
    status: p.status ?? null,
    example: false,
    flow: ['VIN decoded once', 'One record per part', 'AI draft, human approval', 'Shopify listing (not live yet)', 'eBay Motors listing (sandbox)', 'Sold once, ended everywhere'],
    facts: [
      'Built to connect to the yard’s own Shopify and eBay accounts',
      'One record owns the count; channels only hold listings',
      'Designed so a sale at the counter ends the online listings too',
      'Built to check each ended listing and retry a failed write',
    ],
    problem: {
      title: 'One part, two shop windows, sold twice',
      text: 'A salvage yard sells one-off parts on more than one channel. Listing each part by hand in each place is slow, and a part sold on eBay Motors can still be for sale on the Shopify store until someone remembers to take it down.',
    },
    // The canonical module titles; shopify words every module's text its own way (and the VIN
    // module's title too), so those are overrides. The last item is shopify-only.
    built: [
      ...modules(p, [
        {
          id: 'record',
          text: 'Every part is a single record with a quantity of one. The record owns the count; Shopify and eBay Motors only hold listings of it.',
        },
        {
          id: 'vin',
          title: 'Fitment from the donor VIN',
          text: 'A VIN is decoded once and every part from that vehicle inherits its year, make, model and engine, so nobody types fitment twice.',
        },
        {
          id: 'approve',
          text: 'An AI agent drafts each listing. Nothing publishes until a person approves it; there is no auto-publish mode.',
        },
        {
          id: 'delist',
          text: 'Built so that when a part sells on one channel, or at the counter, its other listings are ended when the sale is recorded, not at the next scheduled run. Each ended listing is checked against its channel, and a failed write is retried until the end is confirmed.',
        },
      ]),
      {
        title: 'Their accounts, not mine',
        text: `${p.name} is built to connect to each yard’s own Shopify and eBay accounts and never list under its own. The store stays the yard’s.`,
      },
    ],
    runsNow: {
      label: 'Where it is now',
      text: `Pre-launch: opening to founding yards, with a waitlist and demo booking on ${p.link?.label ?? 'its own site'}. There is no published customer count yet, so there are no results on this page either.`,
    },
    pending: [
      'TODO · Parts / SKUs synced',
      'TODO · Measured sync time',
      'TODO · Overselling incidents, before and after',
      'TODO · Screenshots of the Shopify channel',
      ...(p.status ? [] : ['TODO · Status: live? customers?']),
    ],
    ...(p.link ? { link: p.link } : {}),
    ...(p.notes?.length ? { notes: p.notes } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Shopify and eBay Motors Sync`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name} keeps one record per part, is built to list it on a Shopify storefront and eBay Motors, and ends the other listing when it sells.`,
        `Case study: ${p.name} keeps one record per part and is built to list it on a Shopify storefront and eBay Motors.`,
      ),
    },
  }),
);

/** Niche-only illustrative case: no project behind it, always labelled Example. */
const teardown = exampleCase<ShopifyCase>({
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
    title: withNameSuffix('Shopify Speed Audit: Example Teardown', PERSON_NAME),
    description:
      'An illustrative Shopify product page teardown: oversized photos, leftover app code, an app doing a theme’s job, and how a speed and app audit fixes them.',
  },
});

export const CASES: readonly ShopifyCase[] = present([yardTerminal, teardown]);

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

/**
 * Example mode: the home page's main card when the person has no `yard-terminal` project. A
 * dashed placeholder, never someone else's project.
 */
export const OWN_PROJECT_SLOT = {
  kicker: 'Own project · integration or sync',
  title: 'A Shopify integration or store you built.',
  text: 'This slot stays empty until a real project is added to src/person/projects.ts. Nothing is shown in its place.',
  chips: ['TODO · Add your own project to src/person/projects.ts', 'TODO · What it connects to Shopify, and its status'],
} as const;

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
