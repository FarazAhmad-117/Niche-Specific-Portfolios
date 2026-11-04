/**
 * JSON-LD builders for the `shopify` niche. Pure functions returning plain objects; the layout
 * serialises them. Only facts from decisions.md and the research files: no prices, ratings,
 * reviews, partner status or credentials.
 */
import { PROFILE } from '../../data/shopify/profile';
import { FAQ, OFFERS, type Offer } from '../../data/shopify/content';
import type { ShopifyCase } from '../../data/shopify/cases';
import { CONTACT_EMAIL, MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN, STACK } from '../../data/shopify/site';

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
    knowsAbout: ['Shopify', 'Shopify Plus', ...STACK, 'Core Web Vitals', 'Marketplace inventory sync'],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: Shopify development`,
    url: SITE_ORIGIN + '/',
    description:
      'Shopify speed and app audits, theme builds and rebuilds, custom features, and integrations that keep inventory and orders in sync. Shopify Plus in scope.',
    founder: { '@id': PERSON_ID },
    email: CONTACT_EMAIL,
    // ProfessionalService is a LocalBusiness: it takes an address, not provider/serviceType
    // (those live on the Service nodes below, which point back here).
    address: { '@type': 'PostalAddress', addressLocality: PROFILE.city, addressCountry: PROFILE.countryCode },
    audience: [
      { '@type': 'BusinessAudience', audienceType: 'Brands selling on Shopify' },
      { '@type': 'BusinessAudience', audienceType: 'Multi-channel sellers syncing Shopify with marketplaces' },
    ],
    makesOffer: OFFERS.map((o) => ({ '@type': 'Offer', itemOffered: { '@id': `${SITE_ORIGIN}/#service-${o.id}` } })),
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
    provider: { '@id': SERVICE_ID },
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
export function caseLdGraph(c: ShopifyCase): Ld[] {
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
      isPartOf: { '@type': 'WebSite', name: `${PERSON_NAME}: Shopify`, url: SITE_ORIGIN + '/' },
      image: abs(`og/${c.id}.png`),
      ...(c.example ? { genre: 'Illustrative example' } : {}),
      ...(c.link ? { about: { '@type': 'Thing', name: c.name, url: c.link.href } } : {}),
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
