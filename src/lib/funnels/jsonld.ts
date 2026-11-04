/**
 * JSON-LD builders for the `funnels` niche. Pure functions returning plain objects; the
 * layout serialises them. Only facts from decisions.md: no prices, ratings, reviews or
 * credentials.
 */
import { PROFILE } from '../../data/funnels/profile';
import { FAQ, OFFERS, type Offer } from '../../data/funnels/content';
import type { FunnelCase } from '../../data/funnels/cases';
import { CONTACT_EMAIL, MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN, TOOLS } from '../../data/funnels/site';

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
    knowsAbout: [...TOOLS, 'Marketing automation', 'Email deliverability', 'Lead attribution', 'CRM automation'],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: marketing automation`,
    url: SITE_ORIGIN + '/',
    description:
      'Email, SMS and CRM follow-up that turns leads into booked calls, built in GoHighLevel, n8n, Make or Zapier, with first-touch attribution on every lead.',
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
export function caseLdGraph(c: FunnelCase): Ld[] {
  return [
    personLd(),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${caseUrl(c.id)}#work`,
      name: c.name,
      headline: c.title,
      description: c.seo.description,
      url: caseUrl(c.id),
      inLanguage: 'en',
      creator: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      isPartOf: { '@type': 'WebSite', name: `${PERSON_NAME}: Marketing Automation`, url: SITE_ORIGIN + '/' },
      image: abs(`og/${c.id}.png`),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN + '/' },
        { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${SITE_ORIGIN}/#work` },
        { '@type': 'ListItem', position: 3, name: c.name, item: caseUrl(c.id) },
      ],
    },
  ];
}
