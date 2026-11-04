/**
 * Niche registry: the single source of truth.
 *
 * vercel.json (npm run gen:vercel), the per-niche sitemaps/robots, the SEO
 * canonical host and the link() helper all derive from this file.
 *
 * Adding a niche = flip `enabled` (or add a line) here + create its folders
 * (see README). scripts/gen-vercel.ts and scripts/new-niche.ts load this file
 * directly with Node, so: no non-erasable TS syntax (enums, namespaces), and
 * import only Node-loadable modules (no Astro/Vite-only imports such as images
 * or import.meta.env), with an explicit `.ts` extension.
 */
import { PERSON_CONFIG } from './person/config.ts';

/** The owner's root domain (src/person/config.ts › rootDomain). */
export const ROOT_DOMAIN = PERSON_CONFIG.rootDomain;

export interface Niche {
  /** URL slug. Also the subdomain (<slug>.<rootDomain>) and folder name. */
  readonly slug: string;
  /** Display name (placeholder copy until real designs land). */
  readonly name: string;
  /** Only enabled niches are built/routed. */
  readonly enabled: boolean;
  /**
   * Keep the niche out of search engines. While true: every page gets
   * <meta name="robots" content="noindex"> and robots.txt says Disallow: /.
   * Default ON for every niche; set to false when the niche goes live.
   */
  readonly noindex: boolean;
}

// One niche per line: scripts/new-niche.ts edits and appends lines in this format.
export const NICHES = [
  { slug: 'ai', name: 'AI & Automation', enabled: true, noindex: true },
  { slug: 'ghl', name: `${PERSON_CONFIG.name} · GoHighLevel`, enabled: true, noindex: true },
  { slug: 'apps', name: 'App Development', enabled: true, noindex: true },
  { slug: 'cloud', name: 'Cloud & DevOps', enabled: true, noindex: true },
  { slug: 'funnels', name: 'Marketing Automation', enabled: true, noindex: true },
  { slug: 'ads', name: 'Paid Ads', enabled: true, noindex: true },
  { slug: 'shopify', name: 'Shopify', enabled: true, noindex: true },
  { slug: 'wp', name: 'WordPress', enabled: true, noindex: true },
  { slug: 'webflow', name: 'Webflow', enabled: true, noindex: true },
  { slug: 'seo', name: 'SEO', enabled: true, noindex: true },
  { slug: 'all', name: "All sites", enabled: true, noindex: true },
] as const satisfies readonly Niche[];

export type NicheSlug = (typeof NICHES)[number]['slug'];

export const enabledNiches: readonly Niche[] = NICHES.filter((n) => n.enabled);

export function getNiche(slug: NicheSlug): Niche {
  const niche = NICHES.find((n) => n.slug === slug);
  if (!niche) throw new Error(`Unknown niche: ${slug}`);
  return niche;
}

export const nicheHost = (slug: string): string => `${slug}.${ROOT_DOMAIN}`;
export const nicheOrigin = (slug: string): string => `https://${nicheHost(slug)}`;
