/**
 * Shape and validation of the site owner's identity (src/person/config.ts).
 *
 * Node-loadable on purpose: no imports, no enums/namespaces,
 * nothing Astro- or Vite-only. scripts/check-person.ts runs it directly with Node;
 * src/person/person.ts runs it at build time, so a bad value fails `npm run check:person` and
 * `astro build` with the same message.
 */
/** Pronouns the copy uses for the owner in the third person ("runs his own funnel"). */
export interface Pronouns {
  /** "he", "she", "they" */
  readonly subject: string;
  /** "him", "her", "them" */
  readonly object: string;
  /** "his", "her", "their" */
  readonly possessive: string;
}

/**
 * Programmes a niche's copy talks about (an FAQ "Are you a … partner?" or an About note).
 * Only the ones some niche actually mentions are listed; add a key here when a niche adds one.
 */
export const CREDENTIAL_KEYS = ['googleAdsPartner', 'metaPartner', 'webflowCertifiedPartner'] as const;
export type CredentialKey = (typeof CREDENTIAL_KEYS)[number];

/**
 * A biographical sentence for one niche's About copy (how the owner came to this work).
 * A plain string is the sentence. The object form also replaces the About title where that
 * niche's title tells the same story (ghl: "A developer who found automation through …").
 */
export type OriginStory = string | { readonly text: string; readonly title?: string };

/** A short experience figure for a proof cell, e.g. { value: '3+ yrs', label: 'Of full-stack …' }. */
export interface ExperienceShort {
  readonly value: string;
  readonly label: string;
}

/** Everything about the owner that the niche sites render. Edit the values in config.ts. */
export interface PersonConfig {
  /** Full name. Feeds JSON-LD Person.name, <title>/OG suffixes, bylines, nav marks, footers. */
  readonly name: string;
  /**
   * First name, as the copy introduces the owner ("I’m <firstName>, …", "Me (<firstName>)").
   * Required: names are not split automatically (many names don't start with the given name).
   */
  readonly firstName: string;
  /**
   * Optional shorter form for tight spots (the ai comparison column "Me (<shortName>)").
   * Defaults to `firstName`.
   */
  readonly shortName?: string;
  /**
   * Pronouns for third-person copy (funnels About: "runs <possessive> own funnel").
   * Optional: defaults to they/them/their.
   */
  readonly pronouns?: Pronouns;
  /**
   * The owner's real tools, in any order. Each niche keeps its own ordered tool list (STACK /
   * TOOLS in src/data/<niche>/site.ts) and shows only the items that are also in this list
   * ("Works with", "Builds in", stack marks, JSON-LD knowsAbout, and prose that names tools).
   * Empty = no tool claims: the lists turn into TODO chips and tool-naming sentences drop out.
   * A niche's own platform (Webflow on webflow, the GoHighLevel API on ghl, …) always shows.
   */
  readonly stack: readonly string[];
  /**
   * What the owner is, as a lowercase noun phrase used mid-sentence, e.g. "full-stack engineer"
   * ("I’m a full-stack engineer, so …", "a full-stack engineer and founder of …", seo's
   * "Full-stack engineer · technical SEO"). Optional: when unset those clauses are left out.
   */
  readonly profession?: string;
  /**
   * Seniority adjective, lowercase, e.g. "senior" ("I’m a senior full-stack engineer", "The
   * senior engineer you talk to", "needs a senior engineer every month"). Optional: when unset
   * the adjective is left out ("an engineer").
   */
  readonly seniority?: string;
  /**
   * One sentence of career history in the owner's words (apps About, after the intro).
   * Optional: when unset the sentence is left out.
   */
  readonly careerLine?: string;
  /**
   * The apps proof strip's experience cell. Optional: when unset the cell is a TODO chip.
   */
  readonly experienceShort?: ExperienceShort;
  /**
   * Partner / certification status per programme a niche mentions:
   *   true  = holds it (neutral "Yes" wording), false = does not (the "No, I hold no …" wording),
   *   absent = unknown: the FAQ entry (and its FAQPage JSON-LD entry) and any About note about it
   *   are left out. Never set true without proof.
   */
  readonly credentials?: Readonly<Partial<Record<CredentialKey, boolean>>>;
  /**
   * Per-niche biographical sentence (see OriginStory), keyed by niche slug (src/niches.ts; checked
   * by the validation, not by the type, which would make config.ts and niches.ts circular).
   * Optional per niche: when absent the
   * sentence is left out of that niche's About copy and the title uses neutral wording.
   */
  readonly originStories?: Readonly<Partial<Record<string, OriginStory>>>;
  /**
   * True when the contact form posts into the owner's own CRM (funnels' success message
   * "it’s on its way into my CRM, source and all"). Optional: unset or false uses a plain
   * "on its way" message.
   */
  readonly contactFeedsCrm?: boolean;
  /**
   * Hours you offer support in, as the copy prints them, e.g. "9AM–5PM CET" (cloud: nav, footer,
   * About, contact form reply, care-plan offer, on-call FAQ, JSON-LD). Optional: when unset the
   * hours lines are left out and the copy says "business hours" without a time.
   */
  readonly supportHours?: string;
  /** Public contact address. Feeds every niche's CONTACT_EMAIL (mailto links, JSON-LD email). */
  readonly email: string;
  /** Base booking link (https). Each niche adds utm_source=<slug> via bookingUrl(). */
  readonly bookingUrl: string;
  /** Company or studio name. Feeds BRAND_COMPANY, PROFILE.company, JSON-LD worksFor. */
  readonly company: string;
  /** Role at that company, e.g. "Founder". Feeds PROFILE.companyRole. */
  readonly companyRole: string;
  /** Year the owner started (owner-stated). Feeds PROFILE.sinceYear and yearsBuilding(). */
  readonly sinceYear: number;
  /**
   * Experience in the owner's own words, for niches that state it instead of a start year
   * (currently apps: PROFILE.experience). Optional.
   */
  readonly experience?: string;
  /** City. Feeds PROFILE.city and JSON-LD address. */
  readonly city: string;
  /** Country name. Feeds PROFILE.country (ai). Optional. */
  readonly country?: string;
  /** ISO 3166-1 alpha-2 code, e.g. "PK". Feeds JSON-LD addressCountry. */
  readonly countryCode: string;
  /** Human-readable location line, e.g. "Lahore, Pakistan". Feeds PROFILE.location. */
  readonly location: string;
  /** Working time zone as shown on the sites, e.g. "PKT (UTC+5)". Feeds PROFILE.timeZone. */
  readonly timeZone: string;
  /** GitHub profile URL (https). Feeds PROFILE.github and JSON-LD sameAs. */
  readonly github: string;
  /** LinkedIn profile URL (https). Optional; nothing renders it yet. */
  readonly linkedin?: string;
  /**
   * Root domain without protocol, e.g. "example.dev". Every niche is served from
   * https://<slug>.<rootDomain>: feeds src/niches.ts ROOT_DOMAIN (canonicals, sitemaps,
   * robots, vercel.json rewrites, SITE_ORIGIN).
   */
  readonly rootDomain: string;
  /** The owner's main site (https, no trailing slash). Feeds MAIN_SITE_URL and footer links. */
  readonly mainSiteUrl: string;
  /**
   * Default POST target of the shared contact form (https). The env var
   * PUBLIC_CONTACT_ENDPOINT (see .env.example) overrides it.
   */
  readonly contactEndpoint: string;
  /**
   * Default address of the contact form's mailto fallback. The env var PUBLIC_CONTACT_EMAIL
   * overrides it.
   */
  readonly contactFallbackEmail: string;
  /**
   * The name text of the big display signature in the footer (src/components/all/Footer.astro).
   * Optional: defaults to `name`.
   */
  readonly footerSignature?: string;
  /** Short title wording, e.g. "Automation expert · Full-stack engineer". Feeds PROFILE.roleLine (ai). Optional. */
  readonly roleLine?: string;
  /** Default job title. Feeds PROFILE.jobTitle and JSON-LD jobTitle unless overridden per niche. */
  readonly jobTitle: string;
  /** Per-niche job title overrides, keyed by niche slug (src/niches.ts). */
  readonly jobTitleByNiche?: Readonly<Record<string, string>>;
  /** Alt text of the portrait in src/person/assets/. Describe the actual photo. */
  readonly portraitAlt: string;
}

const FILE = 'src/person/config.ts';

const REQUIRED_STRINGS = [
  'name',
  'firstName',
  'email',
  'bookingUrl',
  'company',
  'companyRole',
  'city',
  'countryCode',
  'location',
  'timeZone',
  'github',
  'rootDomain',
  'mainSiteUrl',
  'contactEndpoint',
  'contactFallbackEmail',
  'jobTitle',
  'portraitAlt',
] as const;

const OPTIONAL_STRINGS = [
  'experience',
  'country',
  'linkedin',
  'roleLine',
  'footerSignature',
  'shortName',
  'profession',
  'seniority',
  'careerLine',
  'supportHours',
] as const;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const isNonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** Problems in the claim fields (pronouns, stack, credentials, originStories, …). */
function claimProblems(c: Record<string, unknown>, knownNicheSlugs?: readonly string[]): string[] {
  const problems: string[] = [];

  const pr = c.pronouns;
  if (pr !== undefined) {
    if (!isPlainObject(pr)) {
      problems.push('"pronouns" must be { subject, object, possessive }, e.g. { subject: \'they\', object: \'them\', possessive: \'their\' } (or remove it for they/them/their)');
    } else {
      for (const k of ['subject', 'object', 'possessive'] as const) {
        const v = pr[k];
        if (!isNonEmpty(v) || v !== v.toLowerCase() || /\s/.test(v.trim())) {
          problems.push(`"pronouns.${k}" must be one lowercase word like "they" / "them" / "their" (got ${JSON.stringify(v)})`);
        }
      }
      for (const k of Object.keys(pr)) {
        if (!['subject', 'object', 'possessive'].includes(k)) problems.push(`"pronouns.${k}" is not a known key (use subject, object, possessive)`);
      }
    }
  }

  const stack = c.stack;
  if (!Array.isArray(stack)) {
    problems.push('"stack" is required: an array of the tool names you really use, e.g. [\'n8n\', \'Python\'] ([] for none)');
  } else {
    const seen = new Set<string>();
    stack.forEach((t, i) => {
      if (!isNonEmpty(t)) problems.push(`"stack[${i}]" must be a non-empty tool name (got ${JSON.stringify(t)})`);
      else if (seen.has(t)) problems.push(`"stack" lists "${t}" twice`);
      else seen.add(t);
    });
  }

  const xp = c.experienceShort;
  if (xp !== undefined && (!isPlainObject(xp) || !isNonEmpty(xp.value) || !isNonEmpty(xp.label))) {
    problems.push('"experienceShort" must be { value: \'3+ yrs\', label: \'Of …\' } with both non-empty (or remove it)');
  }

  const cr = c.credentials;
  if (cr !== undefined) {
    if (!isPlainObject(cr)) {
      problems.push(`"credentials" must be an object like { ${CREDENTIAL_KEYS[0]}: false } (or remove it)`);
    } else {
      for (const [k, v] of Object.entries(cr)) {
        if (!(CREDENTIAL_KEYS as readonly string[]).includes(k)) {
          problems.push(`"credentials.${k}" is not a known programme (known: ${CREDENTIAL_KEYS.join(', ')})`);
        } else if (v !== undefined && typeof v !== 'boolean') {
          problems.push(`"credentials.${k}" must be true, false, or left out when unknown (got ${JSON.stringify(v)})`);
        }
      }
    }
  }

  const os = c.originStories;
  if (os !== undefined) {
    if (!isPlainObject(os)) {
      problems.push('"originStories" must be an object of { <niche slug>: "<sentence>" } (or remove it)');
    } else {
      for (const [slug, story] of Object.entries(os)) {
        if (knownNicheSlugs && !knownNicheSlugs.includes(slug)) {
          problems.push(`"originStories.${slug}": "${slug}" is not a niche slug in src/niches.ts`);
        }
        const ok =
          isNonEmpty(story) ||
          (isPlainObject(story) && isNonEmpty(story.text) && (story.title === undefined || isNonEmpty(story.title)));
        if (!ok) {
          problems.push(`"originStories.${slug}" must be a non-empty sentence, or { text: '…', title?: '…' }`);
        }
      }
    }
  }

  if (c.contactFeedsCrm !== undefined && typeof c.contactFeedsCrm !== 'boolean') {
    problems.push(`"contactFeedsCrm" must be true or false (got ${JSON.stringify(c.contactFeedsCrm)})`);
  }

  for (const key of ['profession', 'seniority'] as const) {
    const v = c[key];
    if (isNonEmpty(v) && v.charAt(0) !== v.charAt(0).toLowerCase()) {
      problems.push(`"${key}" is used mid-sentence, so start it lowercase (got "${v}")`);
    }
  }

  return problems;
}

const HTTPS_URLS = ['bookingUrl', 'github', 'mainSiteUrl', 'contactEndpoint'] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSTNAME_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns every problem found, as one line each (empty array = valid).
 * `knownNicheSlugs`, when given, also checks the keys of jobTitleByNiche.
 */
export function personConfigProblems(cfg: unknown, knownNicheSlugs?: readonly string[]): string[] {
  const problems: string[] = [];
  if (cfg === null || typeof cfg !== 'object') return ['PERSON_CONFIG is not an object'];
  const c = cfg as Record<string, unknown>;

  for (const key of REQUIRED_STRINGS) {
    const v = c[key];
    if (typeof v !== 'string' || v.trim() === '') problems.push(`"${key}" is required and must be a non-empty string`);
  }
  for (const key of OPTIONAL_STRINGS) {
    const v = c[key];
    if (v !== undefined && (typeof v !== 'string' || v.trim() === '')) {
      problems.push(`"${key}" is optional, but when set it must be a non-empty string (or remove the line)`);
    }
  }

  for (const key of ['email', 'contactFallbackEmail'] as const) {
    const v = c[key];
    if (typeof v === 'string' && v.trim() !== '' && !EMAIL_RE.test(v)) {
      problems.push(`"${key}" must be an email address like name@example.com (got "${v}")`);
    }
  }

  for (const key of HTTPS_URLS) {
    const v = c[key];
    if (typeof v === 'string' && v.trim() !== '' && !isHttpsUrl(v)) {
      problems.push(`"${key}" must be a full https:// URL (got "${v}")`);
    }
  }
  if (c.linkedin !== undefined && typeof c.linkedin === 'string' && !isHttpsUrl(c.linkedin)) {
    problems.push(`"linkedin" must be a full https:// URL (got "${c.linkedin}")`);
  }
  if (typeof c.mainSiteUrl === 'string' && c.mainSiteUrl.endsWith('/')) {
    problems.push(`"mainSiteUrl" must not end with "/" (got "${c.mainSiteUrl}")`);
  }

  const domain = c.rootDomain;
  if (typeof domain === 'string' && domain.trim() !== '' && !HOSTNAME_RE.test(domain)) {
    problems.push(
      `"rootDomain" must be a bare lowercase hostname like "example.dev": no protocol, path, port or trailing dot (got "${domain}")`,
    );
  }

  const year = c.sinceYear;
  const thisYear = new Date().getFullYear();
  if (typeof year !== 'number' || !Number.isInteger(year) || year < 1950 || year > thisYear) {
    problems.push(`"sinceYear" must be a whole year between 1950 and ${thisYear} (got ${JSON.stringify(year)})`);
  }

  if (typeof c.countryCode === 'string' && c.countryCode !== '' && !/^[A-Z]{2}$/.test(c.countryCode)) {
    problems.push(`"countryCode" must be a two-letter uppercase ISO code like "PK" (got "${c.countryCode}")`);
  }

  const byNiche = c.jobTitleByNiche;
  if (byNiche !== undefined) {
    if (byNiche === null || typeof byNiche !== 'object') {
      problems.push('"jobTitleByNiche" must be an object of { <niche slug>: "<job title>" }');
    } else {
      for (const [slug, title] of Object.entries(byNiche)) {
        if (typeof title !== 'string' || title.trim() === '') {
          problems.push(`"jobTitleByNiche.${slug}" must be a non-empty string`);
        }
        if (knownNicheSlugs && !knownNicheSlugs.includes(slug)) {
          problems.push(`"jobTitleByNiche.${slug}": "${slug}" is not a niche slug in src/niches.ts`);
        }
      }
    }
  }

  problems.push(...claimProblems(c, knownNicheSlugs));

  return problems;
}

/** Throws one actionable Error listing every problem, or returns the config unchanged. */
export function validatePersonConfig<T extends PersonConfig>(cfg: T, knownNicheSlugs?: readonly string[]): T {
  const problems = personConfigProblems(cfg, knownNicheSlugs);
  if (problems.length > 0) {
    throw new Error(
      `Invalid owner identity in ${FILE} (PERSON_CONFIG):\n` +
        problems.map((p) => `  - ${p}`).join('\n') +
        `\nFix the value(s) in ${FILE}, then run \`npm run check:person\`.`,
    );
  }
  return cfg;
}
