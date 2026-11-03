/**
 * Case studies for the webflow niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - decisions.md › webflow › Case studies: "These niche sites (GSAP motion demo)" is real.
 *    Its facts are verifiable in this repo: Astro static output, one project with a
 *    subdomain per niche (README.md), Lenis + GSAP ScrollTrigger loaded lazily behind a
 *    desktop/fine-pointer/motion-allowed gate (components/shared/Motion.astro), cross-document
 *    View Transitions with a morphing case card (this niche's base.css), a global
 *    reduced-motion switch and off-screen pausing (lib/webflow/base.ts). It is NOT Webflow,
 *    and every mention says so.
 *  - "Any Webflow build" and "Migration (traffic kept)" are OPEN: they render as dashed
 *    placeholder slots on the home page, never as cases.
 *  - `figma-to-cms` is an EXAMPLE (method, not results), labelled illustrative everywhere:
 *    the card, the page, the OG image and the JSON-LD genre.
 */

export const CASE_SLUGS = ['niche-sites', 'figma-to-cms'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export interface WebflowCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** True for an illustrative case: labelled "Example" everywhere. */
  readonly example: boolean;
  /** The method or the stack, in order (OG panel and the case page rail). */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly runsNow: { readonly label: string; readonly text: string };
  /** Something the owner still has to supply (rendered as a dashed chip). */
  readonly pending?: string;
  readonly seo: { readonly title: string; readonly description: string };
}

export const CASES: readonly WebflowCase[] = [
  {
    id: 'niche-sites',
    name: 'These niche sites',
    kicker: 'Motion capability · Astro, not Webflow',
    title: 'Page transitions and scroll motion, built to stay fast.',
    text: 'The site you are on is one of a set of niche portfolios I built in one Astro project, each served on its own subdomain. The motion is GSAP and Lenis, loaded only where it helps, and the page transitions are cross-document View Transitions. It isn’t Webflow; it is the motion craft I bring to Webflow interactions.',
    status: 'Running on this site',
    example: false,
    flow: ['Astro, static output', 'Lenis + GSAP ScrollTrigger', 'Lazy, desktop-only gate', 'View Transitions', 'Reduced-motion switch'],
    facts: [
      'Astro static site: one project, one subdomain per niche',
      'Lenis + GSAP ScrollTrigger, lazy-loaded on desktop only',
      'Cross-document View Transitions: the card morphs into its page',
      'Reduced motion turns it all off; loops pause off screen',
    ],
    problem: {
      title: 'Motion usually costs speed, or gets cut',
      text: 'Interactions are where marketing sites get heavy: a scroll library on every device, animations that keep running off screen, effects that ignore reduced motion. Teams either ship the weight or cut the motion. I wanted both: expressive, and cheap to run.',
    },
    built: [
      {
        title: 'Motion only where it pays',
        text: 'Lenis and GSAP ScrollTrigger load after the page is idle, and only on desktop with a fine pointer and motion allowed. Phones never download them.',
      },
      {
        title: 'Transform and opacity first',
        text: 'Reveals, hovers and players animate transform, opacity and clip-path, so the browser keeps layout still while things move.',
      },
      {
        title: 'Page transitions without a framework',
        text: 'Cross-document View Transitions: the case card you clicked morphs into the page hero, the pages pan like artboards on a canvas, and going back plays it mirrored.',
      },
      {
        title: 'Paused when unseen',
        text: 'Every loop stops off screen and in background tabs, players wait until a third of them is visible, and reduced motion gets the finished state.',
      },
    ],
    runsNow: {
      label: 'Where it runs',
      text: 'On this page. Open the other case study, then come back: that pan and morph is the page transition, and the build system on the home page is the in-place player.',
    },
    pending: 'TODO · Lighthouse scores for these niche sites (production build)',
    seo: {
      title: 'Motion Case Study: Astro, GSAP, Lenis | Faraz Ahmad',
      description:
        'How the motion on these Astro niche sites stays fast: GSAP and Lenis lazy-loaded on desktop, transform-first animation, cross-document View Transitions.',
    },
  },
  {
    id: 'figma-to-cms',
    name: 'Figma file to editable CMS',
    kicker: 'Example build · illustrative',
    title: 'How a Figma file becomes a site the team can run.',
    text: 'An illustrative build, not a client project: the method I use to turn a finished Figma file into Webflow, with a class system, CMS collections and a handover. It is the same story the build system on the home page plays, step by step.',
    status: null,
    example: true,
    flow: ['Read the file', 'Plan classes + CMS', 'Build and bind', 'Interactions', 'Train + hand over'],
    facts: [
      'Anything that repeats becomes a CMS collection',
      'Classes named for what they are, not where they sit',
      'Editors change text and images, never the layout',
    ],
    problem: {
      title: 'A design file is not a system',
      text: 'Figma frames are drawn one screen at a time. Built literally, they become one-off classes and copy-pasted sections that only a developer can change. The real work is deciding, before building, what repeats, what is content and what is style.',
    },
    built: [
      {
        title: 'Read the file for patterns',
        text: 'Components, text styles and colours mapped first: what becomes a class, a variable or a CMS field.',
      },
      {
        title: 'Plan classes and collections',
        text: 'Class names in a client-first style, and a CMS collection for anything there is more than one of: posts, team, case studies.',
      },
      {
        title: 'Build and bind',
        text: 'Pages built from the plan, collection lists bound to fields, and a template page for every collection.',
      },
      {
        title: 'Interactions with a budget',
        text: 'Page-load and scroll interactions on transform and opacity, checked on a mid-range phone, skipped under reduced motion.',
      },
      {
        title: 'Train, then hand over',
        text: 'Your team edits the staging site with me, then gets the documentation and a recorded walkthrough.',
      },
    ],
    runsNow: {
      label: 'What you get at the end',
      text: 'A Webflow site built from your file, CMS collections your team fills, the documentation, and a recorded walkthrough.',
    },
    pending: 'TODO · Replace with a real Webflow build: pages, collections, time to publish, Lighthouse',
    seo: {
      title: 'Figma to Webflow CMS: Example Build | Faraz Ahmad',
      description:
        'An illustrative Figma to Webflow build: how a design file becomes client-first classes, CMS collections and a site a marketing team can edit.',
    },
  },
];

export const getCase = (slug: string): WebflowCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): WebflowCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[webflow] no case after ${slug}`);
  return next;
}

/** The two OPEN proof slots (decisions: keep placeholder). Rendered as dashed bays, never links. */
export const OPEN_SLOTS = [
  {
    id: 'webflow-build',
    kicker: 'Webflow build · design + CMS',
    title: 'A real Webflow build',
    text: 'Pages, CMS collections, time to publish a page, and Lighthouse, once a project is cleared to show.',
    todo: 'TODO · Webflow project, numbers and screenshots',
  },
  {
    id: 'migration',
    kicker: 'Migration · traffic before/after',
    title: 'WordPress to Webflow',
    text: 'Traffic and rankings before and after a migration, measured, not promised.',
    todo: 'TODO · Migration case: traffic before / after',
  },
] as const;
