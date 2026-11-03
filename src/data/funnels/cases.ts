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
 */
import { AI_SITE_URL } from './site';

export const CASE_SLUGS = ['lead-drift', 'lead-pipeline', 'ai-seo-automator'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

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
  readonly seo: { readonly title: string; readonly description: string };
}

export const CASES: readonly FunnelCase[] = [
  {
    id: 'lead-drift',
    name: 'Lead Drift',
    kicker: 'Outbound engine · main case',
    title: 'Outreach that runs whether or not anyone remembers to.',
    text: 'Lead Drift is Indepth Solution’s own growth engine. A browser extension collects leads from where buyers already are; automated outreach and email sequences then follow up until a lead replies, books or drops out.',
    status: 'Running in production',
    flow: ['Extension collects leads', 'Outreach workflow', 'Email sequences', 'Reply or booking', 'Converted work'],
    facts: [
      'Four lead sources: Google Maps, Yellow Pages, eBay and Apollo',
      'First touch and follow-ups are sent by the workflow, not a person',
      'Built and run by the same engineer who would build yours',
    ],
    problem: {
      title: 'Growth that depended on someone remembering to do it',
      text: 'Finding prospects, writing to them and following up were separate chores in separate tools. Leads cooled while the next batch was still being copied into a sheet.',
    },
    built: [
      {
        title: 'Collect from where buyers already are',
        text: 'A browser extension pulls leads from Google Maps, Yellow Pages, eBay and Apollo into one place.',
      },
      {
        title: 'Outreach that runs itself',
        text: 'Automated workflows send the first touch and the follow-ups, so nothing waits on a person.',
      },
      {
        title: 'Sequences that nurture',
        text: 'Leads move through email sequences until they reply, book or drop out, and the result feeds back into the system.',
      },
    ],
    runsNow: 'Running in production as Indepth Solution’s own growth engine. Outreach and sequences run unattended, built and maintained by the same engineer who runs it.',
    pending: 'Reply and meeting numbers: published once cleared',
    more: { label: 'The engineering write-up on ai.farazahmad.dev', href: `${AI_SITE_URL}/work/lead-drift/` },
    seo: {
      title: 'Lead Drift: Outbound Outreach Automation | Faraz Ahmad',
      description:
        "Case study: Lead Drift, Indepth Solution's own outbound engine, running in production. Lead collection, outreach workflows and nurture sequences.",
    },
  },
  {
    id: 'lead-pipeline',
    name: 'farazahmad.dev lead pipeline',
    kicker: 'Attribution · instant CRM delivery',
    title: 'Every lead arrives knowing where it came from.',
    text: 'Landing page, referrer and UTM source, medium and campaign are captured at first touch and stored with every lead, then mapped onto GoHighLevel custom fields. The form at the bottom of this page runs through it.',
    status: 'Live on every form',
    flow: ['First touch captured', 'Saved to the database', 'GoHighLevel contact', 'Tags, note, opportunity'],
    facts: [
      'Saved to MongoDB first, then sent to GoHighLevel through its API',
      'Contact upserted by email, tagged (including the site it came from), with a note and an open opportunity',
      'Failed sends can be retried from the admin',
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
    runsNow: 'Live on farazahmad.dev and on these niche sites: the contact form at the bottom of this page sends its first-touch fields through it.',
    seo: {
      title: 'Lead Attribution Pipeline to GoHighLevel | Faraz Ahmad',
      description:
        'Case study: landing page, referrer and UTMs captured on every lead, saved to MongoDB, then upserted into GoHighLevel with tags and an opportunity.',
    },
  },
  {
    id: 'ai-seo-automator',
    name: 'AI SEO Automator',
    kicker: 'Top of the funnel',
    title: 'Content that brings the leads in the first place.',
    text: 'A self-serve platform that audits a site, researches competitors and keywords, writes AI content and publishes it straight to the site, on the owner’s own AI key. It fills the top of the funnel that the follow-up then works.',
    status: null,
    flow: ['Audit', 'Competitors and keywords', 'AI content', 'Publish', 'Health score'],
    facts: ['Runs on the owner’s own AI API key', 'Alerts when a competitor publishes', 'A live health score keeps it honest'],
    problem: {
      title: 'SEO is a weekly chore nobody has time for',
      text: 'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop.',
    },
    built: [
      { title: 'Deep scrape and audit', text: 'Crawls the site and flags what is hurting it.' },
      {
        title: 'Competitors and alerts',
        text: 'Discovers competitors, researches their backlinks and alerts when they publish.',
      },
      { title: 'Keyword research', text: 'Finds the terms worth writing for.' },
      { title: 'Written and published', text: 'AI generates the content and publishes it straight to the site.' },
      { title: 'A live health score', text: 'One number that shows how the site is doing, kept current.' },
      { title: 'Bring your own AI key', text: 'Runs on the owner’s own AI API key, so costs and data stay theirs.' },
    ],
    runsNow: 'Self-serve: site owners sign up, connect their own AI key and let it run. Alerts tell them when a competitor publishes.',
    more: { label: 'The engineering write-up on ai.farazahmad.dev', href: `${AI_SITE_URL}/work/ai-seo-automator/` },
    seo: {
      title: 'AI SEO Automator: Top-of-Funnel Content | Faraz Ahmad',
      description:
        'Case study: AI SEO Automator audits a site, researches keywords and competitors, then writes and publishes content on the owner’s own AI key.',
    },
  },
];

export const getCase = (slug: string): FunnelCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): FunnelCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[funnels] no case after ${slug}`);
  return next;
}

/** Example record built from the real field names the shared form sends (README › Contact form). */
export const ATTRIBUTION_RECORD = [
  ['ft_landing', '/audit/'],
  ['ft_referrer', 'google.com'],
  ['ft_utm_source', 'google'],
  ['ft_utm_medium', 'cpc'],
  ['ft_utm_campaign', 'spring-audit'],
] as const;
