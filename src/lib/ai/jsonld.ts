/**
 * JSON-LD builders for the `ai` niche. Pure functions returning plain objects;
 * the layout serialises them (see Layout `jsonLd` prop).
 *
 * Rules: only facts from decisions.md; no prices or offers with price; no dates,
 * ratings, reviews or credentials we cannot back up; placeholders never leak
 * (case data goes through textOf()).
 */
import type { CaseStudy } from '../../data/ai/cases';
import { PROFILE } from '../../data/ai/profile';
import { FAQ, OFFERS, type Offer } from '../../data/ai/content';
import { MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN, STACK, CONTACT_EMAIL } from '../../data/ai/site';

type Ld = Record<string, unknown>;

const PERSON_ID = `${SITE_ORIGIN}/#person`;
const SERVICE_ID = `${SITE_ORIGIN}/#service`;

export const abs = (path: string): string => `${SITE_ORIGIN}/${path.replace(/^\/+/, '')}`;

export function personLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    jobTitle: PROFILE.jobTitle,
    url: SITE_ORIGIN + '/',
    sameAs: [MAIN_SITE_URL, PROFILE.github],
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PROFILE.city,
      addressCountry: PROFILE.countryCode,
    },
    worksFor: { '@type': 'Organization', name: PROFILE.company },
    knowsAbout: [...STACK, 'AI agents', 'Workflow automation'],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: AI & automation development`,
    url: SITE_ORIGIN + '/',
    description:
      'AI automation developer for n8n, Make, Zapier and custom AI agents. New systems built to a production checklist, and broken automations fixed. Fixed scope, monitored, owned by the client.',
    founder: { '@id': PERSON_ID },
    provider: { '@id': PERSON_ID },
    email: CONTACT_EMAIL,
    serviceType: OFFERS.map((o) => o.serviceType),
  };
}

export function serviceLd(offer: Offer): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_ORIGIN}/#service-${offer.id}`,
    name: offer.name,
    serviceType: offer.serviceType,
    description: offer.description,
    url: `${SITE_ORIGIN}/#offers`,
    provider: { '@id': PERSON_ID },
  };
}

export const servicesLd = (): Ld[] => OFFERS.map(serviceLd);

export function faqLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Everything the home page emits. */
export const homeLd = (): Ld[] => [personLd(), professionalServiceLd(), ...servicesLd(), faqLd()];

export function breadcrumbLd(trail: readonly { name: string; url: string }[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export const caseUrl = (slug: string): string => abs(`work/${slug}/`);

/** CreativeWork rather than Article: there is no publish date to state truthfully. */
export function caseLd(c: CaseStudy): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${caseUrl(c.slug)}#work`,
    name: c.name,
    headline: c.h1,
    description: c.seo.description,
    url: caseUrl(c.slug),
    inLanguage: 'en',
    creator: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    isPartOf: { '@type': 'WebSite', name: 'Faraz Ahmad: AI & Automation', url: SITE_ORIGIN + '/' },
    image: abs(`og/${c.slug}.png`),
  };
}

export const caseBreadcrumb = (c: CaseStudy): Ld =>
  breadcrumbLd([
    { name: 'Home', url: SITE_ORIGIN + '/' },
    { name: 'Work', url: `${SITE_ORIGIN}/#work` },
    { name: c.name, url: caseUrl(c.slug) },
  ]);

/** Person referenced by cases when the person node is not on the page. */
export const caseLdGraph = (c: CaseStudy): Ld[] => [personLd(), caseLd(c), caseBreadcrumb(c)];
