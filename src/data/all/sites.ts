/**
 * Copy for the `all` hub (all.<rootDomain>). Display labels and one-liners per niche slug.
 *
 * Hard-coded on purpose: importing other niches' data modules would let their refactors break
 * this page. Every headline is quoted verbatim from that niche's own hero (source noted per
 * entry) and every description is condensed from its HOME_SEO description. Never add a claim
 * that is not on the niche's own site.
 *
 * Which niches show, and whether they are live, comes from the registry (src/niches.ts).
 * A slug missing here still renders, with the registry name and no headline.
 *
 * The owner's name and main site come from src/person/config.ts (not another niche's data).
 */
import { PERSON } from '../../person/person';
import { withNameSuffix } from '../../lib/shared/seo-title';

export const PERSON_NAME = PERSON.name;
/** The main site with a trailing slash (config.ts › mainSiteUrl has none). */
export const MAIN_SITE_URL = `${PERSON.mainSiteUrl}/`;

export interface SiteCopy {
  /** Short display label (the registry `name` is sometimes branded, e.g. ghl). */
  readonly label: string;
  /** The niche's own hero headline, quoted. */
  readonly headline?: string;
  /** One factual line about what the site covers. */
  readonly description?: string;
}

export const SITES: Readonly<Record<string, SiteCopy>> = {
  // src/components/ai/Hero.astro h1; src/data/ai/seo.ts HOME_SEO
  ai: {
    label: 'AI & Automation',
    headline: 'AI automations that survive production.',
    description: 'n8n, Make, Zapier and custom AI agents: new systems and fixes for broken ones.',
  },
  // src/data/ghl/content.ts HERO.headline; src/data/ghl/seo.ts HOME_SEO
  ghl: {
    label: 'GoHighLevel',
    headline: 'GoHighLevel, built by a developer.',
    description: 'Account audits and cleanup, system builds, snapshots, and API and webhook integrations.',
  },
  // src/data/apps/content.ts HERO.headline; src/data/apps/seo.ts HOME_SEO
  apps: {
    label: 'App Development',
    headline: 'Products that ship — and keep shipping.',
    description: 'MVPs, SaaS and APIs taken from spec to production, with tests, CI and weekly demos.',
  },
  // src/data/cloud/content.ts HERO.headline; src/data/cloud/seo.ts HOME_SEO
  cloud: {
    label: 'Cloud & DevOps',
    headline: 'Infrastructure that stays up and costs less.',
    description: 'CI/CD, migrations, monitoring and cloud cost cuts for teams without a DevOps hire.',
  },
  // src/data/funnels/content.ts HERO.headline; src/data/funnels/seo.ts HOME_SEO
  funnels: {
    label: 'Marketing Automation',
    headline: 'Follow-up that never forgets a lead.',
    description: 'Email, SMS and CRM follow-up in GoHighLevel, n8n, Make or Zapier, with lead sources tracked.',
  },
  // src/data/ads/content.ts HERO.headline; src/data/ads/seo.ts HOME_SEO
  ads: {
    label: 'Ad Automation',
    headline: 'Ads that watch their own budget.',
    description: 'Spend caps, CPA guards, tracking checks and reporting for Meta, Google, TikTok and LinkedIn.',
  },
  // src/data/shopify/content.ts HERO.headline; src/data/shopify/seo.ts HOME_SEO
  shopify: {
    label: 'Shopify',
    headline: 'A faster Shopify store with fewer apps.',
    description: 'Speed and app audits, theme builds, custom features and marketplace sync.',
  },
  // src/data/seo/content.ts HERO.headline; src/data/seo/seo.ts HOME_SEO
  seo: {
    label: 'Technical SEO',
    headline: 'SEO built into your code, not bolted on.',
    description: 'Technical fixes in code, programmatic pages and a human-edited content engine.',
  },
  // src/data/wp/seo.ts HOME_SEO (headline = its hero h1)
  wp: {
    label: 'WordPress',
    headline: 'WordPress that’s fast, secure, and yours to edit.',
    description: 'Site health audits, rescues and fixes, custom block-theme rebuilds, speed work and care plans.',
  },
  // src/data/webflow/seo.ts HOME_SEO (headline = its hero h1)
  webflow: {
    label: 'Webflow',
    headline: 'Webflow sites your team can actually run.',
    description: 'Figma to Webflow builds, design and build, WordPress migrations, CMS and API integrations.',
  },
};

export const HERO = {
  eyebrow: PERSON_NAME,
  title: 'Every site, one place.',
  lede: 'I keep a specialised site for each kind of work I do. Pick the one that fits, or start at my main site,',
} as const;

export const MAIN_SITE = {
  label: 'Main site',
  title: new URL(MAIN_SITE_URL).host,
  description: 'My main portfolio. The specialised sites above each go deeper on one kind of work.',
} as const;

const DESCRIPTION_LIST =
  'AI automation, GoHighLevel, apps, cloud, marketing automation, ads, Shopify, SEO, WordPress and Webflow.';

/**
 * Meta description that survives long person names (Layout.astro asserts <= 155). Pure TS,
 * deterministic; first variant that fits wins, never truncated:
 *  1. `Every specialised site by ${name}: …`       the full name.
 *  2. `Every specialised site by ${firstName}: …`  first word only, if shorter than the name.
 *  3. `Every specialised site: …`                   no name at all.
 * Nothing fits (impossible with the fixed list above): variant 3 is returned and the layout's
 * guard fails the build with its normal message.
 */
export function describeAllSites(name: string, max = 155): string {
  const trimmed = name.trim();
  const full = `Every specialised site by ${trimmed}: ${DESCRIPTION_LIST}`;
  if (full.length <= max) return full;

  const firstName = trimmed.split(/\s+/)[0] ?? '';
  if (firstName && firstName.length < trimmed.length) {
    const short = `Every specialised site by ${firstName}: ${DESCRIPTION_LIST}`;
    if (short.length <= max) return short;
  }

  return `Every specialised site: ${DESCRIPTION_LIST}`;
}

export const PAGE_SEO = {
  title: withNameSuffix('All Sites: Every Specialised Portfolio', PERSON_NAME),
  description: describeAllSites(PERSON_NAME),
} as const;
