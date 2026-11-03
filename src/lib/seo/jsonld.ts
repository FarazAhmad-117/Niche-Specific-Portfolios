/**
 * JSON-LD builders for the `seo` niche. Pure functions returning plain objects; the layout
 * serialises them. Only facts from decisions.md and the owner's repo: no prices, ratings,
 * reviews, rankings or credentials, and never a todo() placeholder.
 */
import { PROFILE } from '../../data/seo/profile';
import { FAQ, OFFERS, type Offer } from '../../data/seo/content';
import type { CaseStudy } from '../../data/seo/cases';
import { CONTACT_EMAIL, MAIN_SITE_URL, PERSON_NAME, SITE_ORIGIN } from '../../data/seo/site';

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
    knowsAbout: [
      'Technical SEO',
      'Programmatic SEO',
      'Structured data',
      'Backlink analysis',
      'Core Web Vitals',
      'AI-assisted content pipelines',
      'Next.js',
    ],
  };
}

export function professionalServiceLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${PERSON_NAME}: technical SEO`,
    url: SITE_ORIGIN + '/',
    description:
      'Technical SEO audits and fixes done in the code, programmatic SEO builds, a human-edited AI content engine, and backlink audits and strategy. No paid or spammy link building.',
    founder: { '@id': PERSON_ID },
    provider: { '@id': PERSON_ID },
    email: CONTACT_EMAIL,
    areaServed: 'Worldwide',
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

/** Case page: the study as a CreativeWork by the person, plus its breadcrumb trail. */
export function caseLd(study: CaseStudy): Ld[] {
  const url = abs(`work/${study.slug}/`);
  return [
    personLd(),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${url}#case`,
      name: study.name,
      headline: study.h1,
      description: study.seo.description,
      url,
      author: { '@id': PERSON_ID },
      about: study.angle,
      ...(study.link ? { mentions: { '@type': 'WebSite', name: study.link.label, url: study.link.href } } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
        { '@type': 'ListItem', position: 2, name: 'Case studies', item: abs('/#work') },
        { '@type': 'ListItem', position: 3, name: study.name, item: url },
      ],
    },
  ];
}
