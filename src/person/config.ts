/**
 * THE SITE OWNER. The one file to edit for a new person's identity and contact details.
 *
 * Every niche reads these values through src/person/person.ts (Node-safe helpers) and
 * src/person/profile.ts (adds the portrait). The portrait itself is src/person/assets/faraz.jpg.
 * Check your edit with `npm run check:person`; `astro build` runs the same validation.
 *
 * Node loads this file directly (src/niches.ts imports it, scripts run it with native type
 * stripping), so keep it import-free apart from `import type`, with no enums/namespaces.
 * Only state facts the owner has confirmed: never invent a value to fill a field.
 */
import type { PersonConfig } from './schema.ts';

export const PERSON_CONFIG = {
  /** Feeds JSON-LD Person.name, page/OG title suffixes, bylines, nav marks and footers. */
  name: 'Faraz Ahmad',
  /** As the copy introduces you: "I’m Faraz, …", "Me (Faraz)". */
  firstName: 'Faraz',
  // shortName: '…',  (optional; defaults to firstName)
  /** Third-person copy ("runs his own funnel"). Leave out for they/them/their. */
  pronouns: { subject: 'he', object: 'him', possessive: 'his' },
  /** Feeds every niche's CONTACT_EMAIL: mailto links, contact sections, JSON-LD email. */
  email: 'hello@farazahmad.dev',
  /** Base booking link. Each niche's bookingUrl() adds utm_source=<slug> (+ utm_content). */
  bookingUrl: 'https://calendly.com/farazahmad1/30min',
  /** Feeds BRAND_COMPANY, PROFILE.company and JSON-LD worksFor. */
  company: 'Indepth Solution',
  /** Feeds PROFILE.companyRole. */
  companyRole: 'Founder',
  /** Owner-stated start year. Feeds PROFILE.sinceYear and yearsBuilding(). */
  sinceYear: 2022,
  /** Owner's own wording, shown by apps instead of a start year (PROFILE.experience). */
  experience: '3+ years of full-stack engineering',
  /** Feeds PROFILE.city and JSON-LD address. */
  city: 'Lahore',
  /** Feeds PROFILE.country (ai). */
  country: 'Pakistan',
  /** ISO code. Feeds JSON-LD addressCountry. */
  countryCode: 'PK',
  /** Feeds PROFILE.location. */
  location: 'Lahore, Pakistan',
  /** Feeds PROFILE.timeZone. */
  timeZone: 'PKT (UTC+5)',
  /** Feeds PROFILE.github and JSON-LD sameAs. */
  github: 'https://github.com/FarazAhmad-117',
  // linkedin: 'https://www.linkedin.com/in/…',  (optional; nothing renders it yet)
  /** Every niche lives at https://<slug>.<rootDomain>. Feeds src/niches.ts ROOT_DOMAIN. */
  rootDomain: 'farazahmad.dev',
  /** Main site, no trailing slash. Feeds MAIN_SITE_URL and footer links. */
  mainSiteUrl: 'https://farazahmad.dev',
  /** Contact form POST target when PUBLIC_CONTACT_ENDPOINT is not set (see .env.example). */
  contactEndpoint: 'https://www.farazahmad.dev/api/contact',
  /** Contact form mailto fallback when PUBLIC_CONTACT_EMAIL is not set (see .env.example). */
  contactFallbackEmail: 'hello@farazahmad.dev',
  /*
   * footerSignature (optional, left out on purpose): the name text of the big display
   * signature in the `all` footer. When absent it is `name` (src/person/person.ts ›
   * FOOTER_SIGNATURE), so changing `name` updates the signature too. Set it only when the
   * signature must differ from `name`, e.g. a shorter form of a long name that reads better
   * at display size:   footerSignature: '<short form of your name>',
   */
  /** Short title wording from the owner's main site. Feeds PROFILE.roleLine (ai). */
  roleLine: 'Automation expert · Full-stack engineer',
  /** Default job title. Feeds PROFILE.jobTitle and JSON-LD jobTitle. */
  jobTitle: 'Automation Expert & Full-Stack Engineer',
  /** Per-niche job titles (niche slug -> title). Niches not listed use `jobTitle`. */
  jobTitleByNiche: {
    apps: 'Full-Stack Engineer & Founder, Indepth Solution',
    shopify: 'Shopify & Full-Stack Developer',
    wp: 'Full-Stack Engineer & Automation Expert',
    webflow: 'Full-Stack Engineer & Webflow developer',
    seo: 'Full-Stack Engineer, Technical SEO',
  },
  /** Alt text of the portrait (src/person/assets/). Describe the actual photo. */
  portraitAlt: 'Faraz Ahmad, black and white studio portrait',

  /* ---- First-person claims. Leave a field out when it is not true for you: the copy then
   * drops that clause, uses neutral wording or shows a TODO chip. `npm run review:copy` lists
   * the claims that are still literal in the niche copy. ---- */

  /**
   * Every tool you really use. Each niche shows only the items of its own list that are also here
   * (About "Works with"/"Builds in", stack marks, JSON-LD knowsAbout, tool-naming sentences).
   */
  stack: [
    'n8n',
    'Make',
    'Zapier',
    'GoHighLevel',
    'GoHighLevel API',
    'Webhooks',
    'APIs and webhooks',
    'Claude',
    'OpenAI',
    'Python',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'MongoDB',
    'Next.js',
    'React',
    'Tailwind CSS',
    'NestJS',
    'Vercel',
    'Astro',
    'Webflow',
    'Figma',
    'GSAP',
    'Lenis',
    'Liquid',
    'Online Store 2.0',
    'Shopify Admin API',
  ],
  /** Lowercase, mid-sentence: "I’m a full-stack engineer, so …". */
  profession: 'full-stack engineer',
  /** Lowercase adjective: "I’m a senior full-stack engineer", "The senior engineer you talk to". */
  seniority: 'senior',
  /** One sentence of career history (apps About). */
  careerLine: 'I’ve worked in full-stack engineering across three roles in three offices, including as a senior full-stack team lead.',
  /** The apps proof strip's experience cell. */
  experienceShort: { value: '3+ yrs', label: 'Of full-stack engineering, including as a senior full-stack team lead' },
  /** true = holds it, false = does not (the copy says so), left out = unknown (the FAQ entry is dropped). */
  credentials: {
    googleAdsPartner: false,
    metaPartner: false,
    webflowCertifiedPartner: false,
  },
  /** How you came to each niche's work, one sentence (About copy). Niches left out drop the sentence. */
  originStories: {
    ads: 'I’m a full-stack engineer who found automation through GoHighLevel and never stopped connecting platforms so nobody has to copy numbers between them.',
    cloud:
      'I came to infrastructure from full-stack work, so when a deploy breaks or a bill jumps I can read the application code that caused it, not only the dashboard that shows it.',
    funnels:
      'I came to automation through GoHighLevel and have been connecting platforms ever since: forms to CRMs, CRMs to inboxes, inboxes to calendars.',
    ghl: {
      title: 'A developer who found automation through GoHighLevel.',
      text: 'A friend showed me GoHighLevel, and it’s where I found the thing I’d been circling for years: connecting platforms so nobody has to copy data between them.',
    },
    seo: 'I build software for a living, and I came to SEO from the code side: most of what holds a site back in search lives in its templates, its rendering and its URLs.',
  },
  /** The contact form posts into your own CRM (funnels success message). */
  contactFeedsCrm: true,
  /** Support hours as the copy prints them (cloud: nav, footer, About, FAQ, JSON-LD). Leave out to drop them. */
  supportHours: '8AM–5PM EST',
} satisfies PersonConfig;
