/**
 * JSON-LD builders for the `cloud` niche. Pure functions returning plain objects; the layout
 * serialises them. Only verified facts: no prices, ratings, reviews, credentials, clouds the
 * owner has not confirmed, or any metric (case metrics are all baseline TODOs).
 */
import { PROFILE } from '../../data/cloud/profile';
import { FAQ, OFFERS, type Offer } from '../../data/cloud/content';
import type { CloudCase } from '../../data/cloud/cases';
import { isTodo } from '../../data/cloud/todo';
import { CONTACT_EMAIL, MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN, TOOLS_VERIFIED } from '../../data/cloud/site';

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
    address: { '@type': 'PostalAddress', addressLocality: PROFILE.city, addressCountry: PROFILE.countryCode },
    worksFor: { '@type': 'Organization', name: PROFILE.company },
    knowsAbout: ['CI/CD', 'Cloud cost optimization', 'Infrastructure monitoring', ...TOOLS_VERIFIED.map((t) => t.name)],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: cloud & DevOps`,
    url: SITE_ORIGIN + '/',
    description:
      'CI/CD setup, migrations, monitoring and cloud cost optimization for small teams without a dedicated DevOps engineer. Support during business hours, 8AM–5PM EST.',
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
    url: `${SITE_ORIGIN}/#services`,
    provider: { '@id': PERSON_ID },
  };
}

export function faqLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export const homeLd = (): Ld[] => [personLd(), professionalServiceLd(), ...OFFERS.map(serviceLd), faqLd()];

export const caseUrl = (slug: string): string => abs(`work/${slug}/`);

/** CreativeWork rather than Article: there is no publish date to state truthfully. */
export function caseLdGraph(c: CloudCase): Ld[] {
  return [
    personLd(),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${caseUrl(c.slug)}#work`,
      name: c.name,
      headline: c.title,
      description: c.seo.description,
      url: caseUrl(c.slug),
      inLanguage: 'en',
      creator: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      ...(isTodo(c.client) ? {} : { about: c.client }),
      isPartOf: { '@type': 'WebSite', name: 'Faraz Ahmad: Cloud & DevOps', url: SITE_ORIGIN + '/' },
      image: abs(`og/${c.slug}.png`),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN + '/' },
        { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${SITE_ORIGIN}/#work` },
        { '@type': 'ListItem', position: 3, name: c.name, item: caseUrl(c.slug) },
      ],
    },
  ];
}
