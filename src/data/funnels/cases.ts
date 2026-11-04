/**
 * Case studies for the funnels niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - decisions.md › funnels › Real numbers per case (Lead Drift status; the pipeline's
 *    first-touch capture and GoHighLevel mapping) and › ghl (MongoDB first, upsert by email,
 *    tags incl. niche:<slug>, note, opportunity, retry from admin)
 *  - the ai niche's verified case copy (src/data/ai/cases.ts) for Lead Drift and AI SEO Automator
 *  - README › Contact form for the ft_* fields every niche form sends
 * Lead Drift numbers are not cleared for publication yet, so there are none: a visible chip says so.
 *
 * Project-owned values (name, status, problem, module texts, the byok / retry facts, the
 * screenshot alt) come from the shared registry (src/person/projects.ts); everything else below
 * is this niche's angle, verbatim. Owner identity (company, name, hosts) comes from src/person
 * via ./site.ts. When the person lacks one of the three projects its case is omitted (Example
 * mode): no card, page, OG image or sitemap entry; the home page fills the gap with dashed
 * slots (OWN_PROJECT_SLOT, CASE_SLOT).
 */
import type { Project, ProjectId } from '../../person/projects';
import { autoCases, fact, fromProject, getProject, modules, present, type ResolvedAngle } from '../../person/case-helpers';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../../lib/shared/seo-title';
import { nicheHost } from '../../niches';
import { AI_SITE_URL, BRAND_COMPANY, MAIN_SITE_URL, PERSON_NAME } from './site';

/** The registry projects this niche shows, in card order (the first is the main card). */
export const NICHE_PROJECTS = ['lead-drift', 'lead-pipeline', 'ai-seo-automator'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'lead-drift' | 'lead-pipeline' | 'ai-seo-automator' | ProjectId;

export interface FunnelCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's h1 line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** The real flow, in order. */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly runsNow: string;
  /** Something the owner still has to supply (rendered as a dashed chip). */
  readonly pending?: string;
  /** The longer, engineering-angle write-up, when one exists elsewhere. */
  readonly more?: { readonly label: string; readonly href: string };
  /**
   * The project's internal tool, shown as a screenshot on the case page. Only Lead Drift has
   * one, and only when the registry says a screenshot exists (the image is imported by the page).
   */
  readonly screenshot?: { readonly tool: string; readonly alt: string };
  /** The project's public link, when it has one. */
  readonly link?: { readonly label: string; readonly href: string };
  /** True for a case built by the adapter from the registry (`niches` lists funnels): the More builds section. */
  readonly generated?: boolean;
  /** Client work: shown with the Confidential client treatment, never a name. */
  readonly confidential?: boolean;
  /** Caveats from the registry, printed on the case page. */
  readonly notes?: readonly string[];
  readonly stack?: readonly string[];
  readonly seo: { readonly title: string; readonly description: string };
}

/** The engineering write-up of the same project on the ai niche (same registry, so present with it). */
const aiWriteUp = (slug: CaseSlug) => ({ label: `The engineering write-up on ${nicheHost('ai')}`, href: `${AI_SITE_URL}/work/${slug}/` });

/** Lead Drift from the registry, with the funnels angle (outbound engine, main case). */
const leadDrift = fromProject(
  'lead-drift',
  (p): FunnelCase => ({
    id: 'lead-drift',
    name: p.name,
    kicker: 'Outbound engine · main case',
    title: 'Prospecting that does not depend on someone remembering to do it.',
    text: `${p.name} is ${p.madeBy ?? BRAND_COMPANY}’s own growth engine. A browser extension collects leads from Google Maps and Apollo, job posts become leads, and every lead moves through one pipeline (raw, queued, crawled, emailed, replied, closed) with reminders. Email sequences are built in; sending is switched off in production for now.`,
    status: p.status ?? null,
    flow: ['Extension collects leads', 'Job posts become leads', 'Company site crawled', 'Pipeline stage set', 'Reminder or reply'],
    facts: [
      'Leads from Google Maps and Apollo, through a browser extension',
      'One pipeline: raw, queued, crawled, emailed, replied, closed',
      'Built and run by the same engineer who would build yours',
    ],
    problem: { title: fact(p, 'problemTitle'), text: fact(p, 'problemText') },
    // Canonical texts; funnels words two titles (and one text) its own way.
    built: modules(p, [
      { id: 'scrape', title: 'Collect from where buyers already are' },
      'outreach',
      'sequences',
    ]),
    runsNow: `Running in production as ${p.madeBy ?? BRAND_COMPANY}’s own growth engine, built and maintained by the same engineer who runs it. Email sending is switched off for now.`,
    pending: 'Reply and meeting numbers: published once cleared',
    more: aiWriteUp('lead-drift'),
    ...(p.screenshot ? { screenshot: { tool: p.toolName ?? p.name, alt: p.screenshot.alt } } : {}),
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Lead Capture and Outreach Pipeline`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name}, ${p.madeBy ?? BRAND_COMPANY}'s own outbound engine, running in production. Leads from Google Maps and Apollo, one pipeline.`,
        `Case study: ${p.name}, ${p.madeBy ?? BRAND_COMPANY}'s own outbound engine, running in production. Lead capture and pipeline.`,
        `Case study: ${p.name}, an outbound engine running in production: leads from Google Maps and Apollo, one pipeline.`,
      ),
    },
  }),
);

/**
 * The lead pipeline of the person's own site (a `system` of the own-site project, see `partOf`),
 * with the funnels angle (attribution, instant CRM delivery). Its runsNow names the site it
 * lives on: the parent project's link label, else the main site's host.
 */
const leadPipeline = fromProject('lead-pipeline', (p): FunnelCase => {
  const parent = p.partOf ? getProject(p.partOf) : undefined;
  const site = parent?.link?.label ?? parent?.name ?? new URL(MAIN_SITE_URL).host;
  return {
    id: 'lead-pipeline',
    name: p.name,
    kicker: 'Attribution · instant CRM delivery',
    title: 'Every lead arrives knowing where it came from.',
    text: 'Landing page, referrer and UTM source, medium and campaign are captured at first touch and stored with every lead, then mapped onto GoHighLevel custom fields. The form at the bottom of this page runs through it.',
    status: p.status ?? null,
    flow: ['First touch captured', 'Saved to the database', 'GoHighLevel contact', 'Tags, note, opportunity'],
    facts: [
      'Saved to MongoDB first, then sent to GoHighLevel through its API',
      'Contact upserted by email, tagged (including the site it came from), with a note and an open opportunity',
      fact(p, 'retry'),
    ],
    problem: {
      title: 'A lead that arrives without its story',
      text: 'A form that only sends an email loses where the visitor came from, and a CRM filled by hand collects duplicates. Then nobody can say which page or campaign actually brought the call in.',
    },
    built: [
      {
        title: 'First touch, captured once',
        text: 'On a visitor’s first page view, the landing page, referrer and UTM source, medium and campaign are kept for the session and sent with the form.',
      },
      {
        title: 'Saved before anything else',
        text: 'Every lead is written to MongoDB first, then sent on to GoHighLevel through its API.',
      },
      {
        title: 'One contact, properly labelled',
        text: 'The contact is upserted by email, tagged (including which site it came from), given a note and an open opportunity, with the source fields mapped to GoHighLevel custom fields.',
      },
      {
        title: 'Nothing silently lost',
        text: 'If a send to GoHighLevel fails, it can be retried from the admin.',
      },
    ],
    runsNow: `Live on ${site} and on these niche sites: the contact form at the bottom of this page sends its first-touch fields through it.`,
    seo: {
      title: withNameSuffix('Lead Attribution Pipeline to GoHighLevel', PERSON_NAME),
      description:
        'Case study: landing page, referrer and UTMs captured on every lead, saved to MongoDB, then upserted into GoHighLevel with tags and an opportunity.',
    },
  };
});

/** AI SEO Automator from the registry, with the funnels angle (top of the funnel). */
const automator = fromProject(
  'ai-seo-automator',
  (p): FunnelCase => ({
    id: 'ai-seo-automator',
    name: p.name,
    kicker: 'Top of the funnel',
    title: 'Content that brings the leads in the first place.',
    text: 'A multi-tenant SEO platform for agencies and freelancers: it audits a site, plans content, writes it with AI and publishes it to WordPress once the approval gates you set are passed, on each organisation’s own AI provider. It fills the top of the funnel that the follow-up then works.',
    status: p.status ?? null,
    flow: ['Audit', 'Plan', 'AI draft', 'Approve', 'Publish'],
    facts: [fact(p, 'byok'), 'Human approval gates before anything publishes', 'WordPress publishing built; Webflow and Shopify planned'],
    problem: {
      title: fact(p, 'problemTitle'),
      text: fact(p, 'problemText'),
    },
    built: modules(p, ['crawl', 'competitors', 'keywords', { id: 'publish', title: 'Written and published' }, 'approvals', 'byok']),
    runsNow: 'Built for agencies and freelancers: each organisation connects its own AI provider and sets its own approval gates.',
    more: aiWriteUp('ai-seo-automator'),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, `${p.name}: Top-of-Funnel Content`, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(
        SEO_DESCRIPTION_MAX,
        `Case study: ${p.name} audits a site, plans content, then writes and publishes it to WordPress behind human approval gates.`,
        `Case study: ${p.name} audits a site, plans content, then writes and publishes it behind approval gates.`,
      ),
    },
  }),
);

/** The hand-written cases, in authored order (the main card and the pair beside it). */
export const CASES: readonly FunnelCase[] = present([leadDrift, leadPipeline, automator]);

/** Registry facts fit for the hero bubbles (keyed problem copy is shown elsewhere). */
const HERO_FACT_SKIP = new Set(['problemTitle', 'problemText', 'oneLiner']);

/**
 * The funnels adapter: a registry project whose `niches` lists funnels, as a FunnelCase. Only
 * registry values: the angle's wording (src/person/projects.ts › angles.funnels), summary,
 * modules, flow, stack, notes and keyed facts. No numbers of its own, no TODO chips.
 */
function generatedCase(p: Project, a: ResolvedAngle): FunnelCase {
  const stack = p.stack?.items ?? [];
  return {
    id: p.id,
    name: a.title,
    kicker: a.kicker,
    title: a.line,
    text: p.summary ?? a.line,
    status: p.status ?? null,
    flow: a.flow,
    facts: [
      ...(a.confidential ? ['Confidential client: no names, brands or figures shown'] : []),
      ...Object.entries(p.facts)
        .filter(([k]) => !HERO_FACT_SKIP.has(k))
        .map(([, v]) => v),
      ...(p.notes ?? []),
      ...(stack.length ? [`Built with ${stack.slice(0, 3).join(', ')}`] : []),
    ],
    problem: a.problem ?? { title: a.title, text: p.summary ?? a.line },
    built: a.built,
    runsNow: p.status ?? (a.confidential ? 'A client build, shown anonymised: no client names, brands or figures.' : a.line),
    generated: true,
    confidential: a.confidential,
    notes: p.notes ?? [],
    stack,
    ...(p.link ? { link: p.link } : {}),
    seo: {
      title: withNameSuffix(fitDescription(SEO_TITLE_MAX, a.seoTitle, `${p.name}: Case Study`), PERSON_NAME),
      description: fitDescription(SEO_DESCRIPTION_MAX, a.seoDescription, `Case study: ${p.name}, a marketing automation build.`),
    },
  };
}

/**
 * Registry projects listed for funnels that no hand-written case shows, in registry order.
 * farazahmad-dev is shown through its lead-pipeline system (nicheProjects skips the parent).
 */
export const MORE_CASES: readonly FunnelCase[] = autoCases(
  'funnels',
  CASES.map((c) => c.id),
  generatedCase,
);

/** Every case with a page: routes, OG images, JSON-LD and the sitemap read this. */
export const ALL_CASES: readonly FunnelCase[] = [...CASES, ...MORE_CASES];
export const CASE_SLUGS: readonly CaseSlug[] = ALL_CASES.map((c) => c.id);

/** The main (wide) home card: Lead Drift. Picked by id, never by position. */
export const MAIN_CASE: FunnelCase | undefined = CASES.find((c) => c.id === 'lead-drift');
/** The compact cards beside it, in authored order. */
export const SIDE_CASES: readonly FunnelCase[] = CASES.filter((c) => c !== MAIN_CASE);
/** True when at least one case is the person's own lead flow (the section heading says so). */
export const HAS_OWN_PIPELINE: boolean = CASES.some((c) => c.id === 'lead-drift' || c.id === 'lead-pipeline');

/**
 * Example mode: the main card when the person has no `lead-drift` project. A dashed
 * placeholder, never someone else's project.
 */
export const OWN_PROJECT_SLOT = {
  kicker: 'Own project · outbound or nurture system',
  title: 'A lead or follow-up system you built and run.',
  text: 'This slot stays empty until a real project is added to src/person/projects.ts. Nothing is shown in its place.',
  chips: ['TODO · Add your own project to src/person/projects.ts', 'TODO · What it automates, and its status'],
} as const;

/** Example mode: a compact placeholder card, so the row of two beside the main card stays full. */
export const CASE_SLOT = {
  kicker: 'Case study · placeholder',
  title: 'Another funnel, pipeline or attribution build.',
  chip: 'TODO · Add a real project to src/person/projects.ts',
} as const;

export const getCase = (slug: string): FunnelCase | undefined => ALL_CASES.find((c) => c.id === slug);

/** Next case in a fixed ring over every case; undefined when the case is the only one (no self-link). */
export function nextCase(slug: CaseSlug): FunnelCase | undefined {
  const i = ALL_CASES.findIndex((c) => c.id === slug);
  const next = ALL_CASES[(i + 1) % ALL_CASES.length];
  return next && next.id !== slug ? next : undefined;
}

/** Related reading for a generated case: the hand-written cases, skipping `exclude` (already the next case). */
export function relatedCases(slug: CaseSlug, exclude?: CaseSlug, max = 2): readonly FunnelCase[] {
  return CASES.filter((c) => c.id !== slug && c.id !== exclude).slice(0, max);
}

/** Example record built from the real field names the shared form sends (README › Contact form). */
export const ATTRIBUTION_RECORD = [
  ['ft_landing', '/audit/'],
  ['ft_referrer', 'google.com'],
  ['ft_utm_source', 'google'],
  ['ft_utm_medium', 'cpc'],
  ['ft_utm_campaign', 'spring-audit'],
] as const;
