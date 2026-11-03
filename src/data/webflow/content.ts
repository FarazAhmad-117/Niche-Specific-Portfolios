/**
 * Copy for the webflow home page. Kept as data so the same text feeds the markup and the
 * JSON-LD (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › webflow, CLAUDE.local.md §2):
 *  - no prices anywhere: "Scoped on a call"
 *  - both Figma builds and design + build
 *  - not Webflow-certified: no certification, partner or "Expert" claims, no Webflow logo
 *  - no calculators or estimators (removed from the Custom integrations offer)
 *  - every missing number is a visible TODO chip; no testimonials
 * Case studies live in ./cases.ts, the signature player's model in ./build.ts.
 */

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE =
  "You'll leave the call knowing what to build, how your team will edit it, and what it involves";

export const HERO = {
  eyebrow: 'Webflow developer · Faraz Ahmad',
  /** decisions.md › webflow › Hero headline. The last line is "selected" on the canvas. */
  headline: ['Webflow sites', 'your team can', 'actually run.'],
  lede: 'I build Webflow sites from your Figma file, or design them with you first: a clean class system, a CMS your marketing team fills on its own, and motion that stays fast. When Webflow runs out, I write the code.',
  primary: 'Book a scoping call',
  secondary: 'See the build system',
  note: 'Free 30-minute call. No price list: scope and cost are agreed on the call.',
} as const;

/**
 * The hero panel: one example design system shown at three breakpoints. Each beat changes
 * ONE variable and every frame follows. Shape-only, labelled illustrative.
 */
export const HERO_VARS = [
  { id: 'brand', name: 'color/brand', from: 'ink', to: 'violet' },
  { id: 'radius', name: 'radius/card', from: '4px', to: '16px' },
  { id: 'surface', name: 'color/surface', from: 'white', to: 'tint' },
  { id: 'weight', name: 'font/heading', from: '500', to: '700' },
] as const;

/** Proof strip (brief §4 item 2). Only one item is a fact today; the rest are owner inputs. */
export const PROOF = [
  {
    value: 'GSAP + Lenis',
    label: 'The motion and page transitions on these niche sites are mine (Astro, not Webflow)',
    todo: null,
  },
  { value: null, label: 'Webflow sites built', todo: 'TODO · count' },
  { value: null, label: 'Average Lighthouse on my Webflow builds', todo: 'TODO · score' },
  { value: null, label: 'WordPress to Webflow migrations, traffic before and after', todo: 'TODO · count + before/after' },
] as const;

/**
 * The problem (brief §4 item 3). The "class soup" navigator is an illustrative example of a
 * typical handoff, labelled as such; the clean one is the naming I use.
 */
export const PROBLEM = {
  title: 'Your site shouldn’t need a developer to change a headline.',
  body: 'It looked right at launch. Then the classes turned into Div Block 27 and Heading copy copy, the CMS was skipped because there wasn’t time, and every change became a ticket. The site still looks good. Nobody dares touch it.',
  resolution: 'I build it so the person changing the headline never needs me.',
  fears: [
    'A beautiful site nobody on your team can edit',
    'A CMS structure that fights every new page',
    'Interactions that make the site slow and heavy',
    'A migration that quietly loses your SEO',
    'Custom needs Webflow “can’t do”',
  ],
  soup: ['Section', 'Div Block 27', 'Div Block 27 copy', 'Heading 2 copy copy', 'Text Block 3', 'Button 4', 'Div Block 31', 'Image 12'],
  clean: ['section_hero', 'container-large', 'hero_component', 'heading-style-h1', 'text-size-medium', 'button is-primary', 'posts_list', 'posts_image'],
} as const;

export interface Offer {
  readonly id: 'figma' | 'design' | 'migration' | 'integrations' | 'care';
  readonly name: string;
  /** Who it is for, one line. */
  readonly forWho: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
}

/** decisions.md › webflow › Offers to show. Order follows the brief's ladder. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'figma',
    name: 'Figma → Webflow build',
    forWho: 'You have a finished Figma file: agencies, designers, in-house teams.',
    description:
      'I build your design in Webflow as drawn, at every breakpoint, with a clean class system, the CMS set up and the interactions you specified.',
    serviceType: 'Figma to Webflow development',
    gets: ['Built to your file, every breakpoint', 'Client-first-style class naming', 'CMS collections and templates'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'design',
    name: 'Design + build',
    forWho: 'No design yet: SaaS and B2B teams who need a marketing site.',
    description:
      'We plan the pages and design the look together in Figma, then I build it in Webflow and train your team to run it.',
    serviceType: 'Webflow website design and development',
    gets: ['Page plan and Figma design', 'Built and connected in Webflow', 'Editor training for your team'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'migration',
    name: 'Migration (from WordPress)',
    forWho: 'Your WordPress site has become hard to change.',
    description:
      'Your content moved into Webflow CMS collections, a redirect for every old URL, and titles, descriptions and alt text carried over.',
    serviceType: 'WordPress to Webflow migration',
    gets: ['Content imported into the CMS', 'Redirect map, old URL to new', 'SEO settings carried over'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'integrations',
    name: 'Custom integrations',
    forWho: 'Webflow is close, but it needs to talk to your own systems.',
    description:
      'Where Webflow stops, I write the code: your data synced into the CMS through the API, forms that land in your CRM, and gated content.',
    serviceType: 'Webflow API and custom code integration',
    gets: ['CMS sync via the API', 'Forms to your CRM', 'Gated content'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'care',
    name: 'Care plan',
    forWho: 'The site is live and you want a developer on hand.',
    description: 'New pages, CMS updates and fixes every month, on sites I built or took over.',
    serviceType: 'Webflow website maintenance',
    gets: ['New pages and sections', 'CMS and content updates', 'Fixes and small changes'],
    priceLine: 'Monthly, scoped on a call',
  },
];

/** "What every site includes" (brief §4 item 8). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'class',
    title: 'Clean class naming',
    text: 'A client-first-style system: classes are named for what a thing is, so your team can find it and reuse it.',
  },
  {
    icon: 'cms',
    title: 'CMS documentation',
    text: 'What each collection and field is for, written for whoever adds the next post, not for me.',
  },
  {
    icon: 'seo',
    title: 'SEO settings',
    text: 'Titles, descriptions, Open Graph images, alt text and the sitemap, set per page and per CMS template.',
  },
  {
    icon: 'redirect',
    title: 'Redirect map',
    text: 'Every old URL pointed at its new home before launch, so old links and bookmarks still land somewhere.',
  },
  {
    icon: 'video',
    title: 'Recorded handover',
    text: 'A Loom walkthrough of your own site: add a page, publish a post, change a headline.',
  },
  {
    icon: 'motion',
    title: 'A motion budget',
    text: 'Interactions animate transform and opacity, pause off screen and respect reduced motion.',
  },
] as const;

/** Steps in order (brief §4 item 9): Scope → Design/Figma → Build → Train → Launch. */
export const PROCESS = [
  {
    title: 'Scope',
    text: 'A free 30-minute call: pages, CMS, integrations, and what your team needs to edit.',
    leaves: 'A written scope',
  },
  {
    title: 'Design / Figma',
    text: 'We design it together in Figma, or I review your file and plan classes and collections before building.',
    leaves: 'An approved file',
  },
  {
    title: 'Build',
    text: 'Built in Webflow on a staging domain: classes, CMS, interactions and integrations, checked on real devices.',
    leaves: 'A staging site to review',
  },
  {
    title: 'Train',
    text: 'Your team edits the staging site with me on a call, then gets the recorded walkthrough.',
    leaves: 'A team that can run it',
  },
  {
    title: 'Launch',
    text: 'Redirects, SEO settings and the domain switched over, then checked again after launch.',
    leaves: 'A live site you own',
  },
] as const;

/** The interaction gallery (decided: 3–4 small demos, each with an honest performance note). */
export const GALLERY = [
  {
    id: 'hover',
    kind: 'Hover',
    title: 'Selection fill',
    text: 'The button gets “selected”: a fill rises, the label flips a beat later, handles snap on.',
    notes: {
      animates: 'transform on the fill, transform and opacity on the handles, and the label colour',
      offscreen: 'nothing runs until you hover or focus it',
      reduced: 'the hover state appears instantly',
    },
  },
  {
    id: 'scroll',
    kind: 'Scroll',
    title: 'Scrubbed reveal',
    text: 'Lines uncover as the card moves through the screen, tied to your scroll, never hijacking it.',
    notes: {
      animates: 'clip-path and transform, scrubbed by GSAP ScrollTrigger on desktop; a one-time reveal elsewhere',
      offscreen: 'ScrollTrigger only works while the card is in view; nothing pins',
      reduced: 'shown complete, no movement',
    },
  },
  {
    id: 'page',
    kind: 'Page transition',
    title: 'Artboard pan',
    text: 'The card zooms into its page. This site does the full version between pages: open a case study.',
    notes: {
      animates: 'clip-path grown from the card’s measured box, plus transform and opacity (View Transitions between real pages)',
      offscreen: 'runs only when you press the button',
      reduced: 'an instant swap, no zoom',
    },
  },
  {
    id: 'cursor',
    kind: 'Cursor',
    title: 'Pointer tilt',
    text: 'The card leans toward your pointer and a light follows it. Mouse and trackpad only.',
    notes: {
      animates: 'transform only, at most once per frame',
      offscreen: 'pointer listeners attach only while the card is on screen',
      reduced: 'static on touch screens and under reduced motion',
    },
  },
] as const;

export const ABOUT = {
  title: 'A developer behind the Designer.',
  paragraphs: [
    'I’m Faraz, a full-stack engineer and founder of Indepth Solution. I build Webflow sites from a Figma file, or design them with you first.',
    'Being a developer changes what “Webflow can’t do” means. Custom code, the CMS API, forms into your CRM: I write those parts instead of working around them.',
    'Motion is the part I enjoy most. The page transitions and scroll effects on these niche sites are mine, built with GSAP and Lenis in Astro, and they are the craft I bring to Webflow interactions.',
  ],
} as const;

export const FAQ = [
  {
    q: 'Do you design, or only build?',
    a: 'Both. Send me a Figma file and I build it, or we design it together in Figma first and then I build it. Agencies and designers usually bring their own design; startups often need both.',
  },
  {
    q: 'Can my team edit the site without you?',
    a: 'That is the point of how I build. Classes are named so they can be found and reused, anything that repeats lives in the CMS, and content editors change text and images without touching the layout. You also get a recorded walkthrough of your own site.',
  },
  {
    q: 'Will a WordPress migration lose my SEO?',
    a: 'A migration is where SEO usually gets lost, so I plan for it: every old URL gets a redirect, titles, descriptions and alt text are carried over, and the sitemap is submitted again after launch. Nobody can promise rankings, but nothing is left to chance on the move.',
  },
  {
    q: 'What do the Webflow plan and hosting cost?',
    a: 'Webflow bills you directly for the site plan and any seats, separately from my work, and its prices are on its own pricing page. Which plan fits depends on your CMS items, traffic and features, so I recommend one on the call.',
  },
  {
    q: 'What are the limits of custom code in Webflow?',
    a: 'Webflow takes custom code per page and site-wide, plus embeds inside the page, and the CMS has an API. When something needs a server, like syncing your own data into the CMS or sending forms to a CRM, I build that part outside Webflow and connect it.',
  },
  {
    q: 'Localization and memberships?',
    a: 'Webflow has its own localization for translated sites, and I can set it up. For memberships and gated content, Webflow’s native options have changed over time, so I check what fits your case on the call; a dedicated membership tool or a custom integration is often the cleaner route.',
  },
  {
    q: 'Are you a certified Webflow partner?',
    a: 'No. I am not in Webflow’s certified partner programme, and I won’t claim otherwise. What I can show you is the work: the build system above, the motion on this site, and a scoping call where you can ask me anything.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on the pages, the CMS, any integrations and whether design is included, so I scope it on a free 30-minute call. You know what is involved before anything is agreed.',
  },
] as const;
