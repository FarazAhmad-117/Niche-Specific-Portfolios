/**
 * JSON-LD builders for the `webflow` niche. Pure functions returning plain objects; the layout
 * serialises them. Only facts from decisions.md: no prices, ratings, reviews, certifications
 * or partner status.
 */
import { PROFILE } from '../../data/webflow/profile';
import { FAQ, OFFERS, type Offer } from '../../data/webflow/content';
import type { WebflowCase } from '../../data/webflow/cases';
import { CONTACT_EMAIL, MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN } from '../../data/webflow/site';

type Ld = Record<string, unknown>;

const PERSON_ID = `${SITE_ORIGIN}/#person`;
const SERVICE_ID = `${SITE_ORIGIN}/#service`;

export const abs = (path: string): string => `${SITE_ORIGIN}/${path.replace(/^\/+/, '')}`;

const address = () => ({ '@type': 'PostalAddress', addressLocality: PROFILE.city, addressCountry: PROFILE.countryCode });

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
    address: address(),
    worksFor: { '@type': 'Organization', name: PROFILE.company },
    knowsAbout: ['Webflow', 'Webflow CMS', 'Figma', 'GSAP', 'Lenis', 'Astro', 'Web animation', 'WordPress migration'],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: Webflow development`,
    url: SITE_ORIGIN + '/',
    description:
      'Figma to Webflow builds, design and build, WordPress to Webflow migrations, custom Webflow integrations and care plans, for teams that want to run their own site.',
    founder: { '@id': PERSON_ID },
    email: CONTACT_EMAIL,
    // ProfessionalService is a LocalBusiness: it takes an address, not provider/serviceType
    // (those live on the Service nodes below, which point back here).
    address: address(),
    audience: [
      { '@type': 'BusinessAudience', audienceType: 'SaaS and B2B marketing teams' },
      { '@type': 'BusinessAudience', audienceType: 'Agencies and designers with Figma designs' },
      { '@type': 'BusinessAudience', audienceType: 'Companies moving from WordPress' },
    ],
    makesOffer: OFFERS.map((o) => ({ '@type': 'Offer', itemOffered: { '@id': `${SITE_ORIGIN}/#service-${o.id}` } })),
  };
}

export function serviceLd(offer: Offer): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_ORIGIN}/#service-${offer.id}`,
    name: offer.name.replace(' → ', ' to '),
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
export function caseLdGraph(c: WebflowCase): Ld[] {
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
      isPartOf: { '@type': 'WebSite', name: 'Faraz Ahmad: Webflow', url: SITE_ORIGIN + '/' },
      image: abs(`og/${c.id}.png`),
      ...(c.example ? { genre: 'Illustrative example' } : { genre: 'Case study' }),
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
