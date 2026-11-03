/**
 * Copy for the wp home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › wp):
 *  - no prices anywhere: "Scoped on a call"
 *  - offers: Site health audit; Rescue / fix; Custom build / rebuild; Speed optimization; Care plan
 *  - WooCommerce is in scope; hosting: care plans only, hosts are recommended, never sold
 *  - real numbers per case and a before/after WordPress project are open: visible TODO chips
 *  - no testimonials
 * Case studies live in ./cases.ts, the signature player's model in ./player.ts.
 */

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = 'You’ll leave the call knowing what’s wrong with the site or what to build, and what it involves';

/** One line of the headline: plain runs and the accent (italic ultramarine) run. */
export type HeadRun = { readonly t: string; readonly em?: true };

export const HERO = {
  eyebrow: 'WordPress development',
  /** decisions.md › wp › Hero headline, set over three lines. "yours" carries the accent. */
  headline: [[{ t: 'WordPress that’s fast,' }], [{ t: 'secure, and' }], [{ t: 'yours', em: true }, { t: ' to edit.' }]] as const satisfies readonly (readonly HeadRun[])[],
  headlineText: 'WordPress that’s fast, secure, and yours to edit.',
  lede: 'I rescue, rebuild and look after WordPress sites for businesses, agencies and publishers: fewer plugins, a block theme your team can edit, updates tried on staging first, and pages that load fast on a phone.',
  primary: 'Book a scoping call',
  secondary: 'Get a site health check',
  note: 'Free 30-minute call. No price list: scope and cost are agreed on the call.',
} as const;

/**
 * The hero's proof sheet: a page in the block editor. One block is selected per beat and its
 * margin note is written in, like an editor marking up a proof. Illustrative, and captioned so.
 */
export const HERO_BLOCKS = [
  { kind: 'heading', block: 'Heading', mark: 'Editable', note: 'A real block your team edits, not a page-builder shortcode.' },
  { kind: 'image', block: 'Image', mark: 'Sized', note: 'Resized, compressed, served at the size it’s shown.' },
  { kind: 'query', block: 'Query Loop', mark: 'Cached', note: 'Latest posts, cached once, by one plugin.' },
  { kind: 'buttons', block: 'Buttons', mark: 'Pattern', note: 'A synced pattern: change it once, it changes everywhere.' },
  { kind: 'footer', block: 'Footer', mark: 'Staged', note: 'Updates tried on staging, backed up daily.' },
] as const;
export const HERO_CAPTION = 'Illustrative: what I check on every page before I hand a site over.';

/**
 * Proof strip (brief §4 item 2: sites, speed gains, plugins removed). Those numbers are open
 * in decisions.md, so they are dashed TODO slots. The one filled cell is a verified fact
 * (docs/research/ai-local.md › AI SEO Automator).
 */
export const PROOF = {
  filled: {
    value: 'Publishes',
    label: 'AI SEO Automator, my own product, writes content and publishes it straight to the site.',
  },
  todo: [
    { label: 'WordPress sites rescued or rebuilt', chip: 'TODO · Number of sites' },
    { label: 'Load time, before and after', chip: 'TODO · Real before/after timing' },
    { label: 'Plugins removed on a real site', chip: 'TODO · Plugins before → after' },
  ],
} as const;

export const PROBLEM = {
  title: '47 plugins and a theme nobody dares update.',
  paragraphs: [
    'Sites like this start simple. Then a page builder arrives, then an add-on pack for the page builder, a slider, two SEO plugins because nobody was sure which one was on, and a caching plugin on top of another caching plugin. Every update is a gamble, so nobody updates.',
    'Now it’s slow on a phone, bots hammer the login page every night, the theme’s edits live in its own files so an update would wipe them, and changing a headline means emailing a developer who has moved on.',
  ],
  pull: 'Most slow WordPress sites aren’t slow because of WordPress. They’re slow because of what was piled on top.',
  fears: [
    { k: 'Security', v: 'Hacks, malware and a login page under attack' },
    { k: 'Updates', v: 'Plugin conflicts the moment you click “Update”' },
    { k: 'Speed', v: 'Pages that crawl on a phone' },
    { k: 'Ownership', v: 'A site only the old developer understood' },
    { k: 'Search', v: 'Losing rankings in a rebuild' },
  ],
  resolution: 'I take the pile apart, keep what earns its place, and leave a site your team can run.',
} as const;

export interface Offer {
  readonly id: 'audit' | 'rescue' | 'build' | 'speed' | 'care';
  readonly name: string;
  /** "Pick this if". */
  readonly forWho: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › wp › Offers to show, in the brief's ladder order. No prices. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Site health audit',
    forWho: 'You want to know what’s wrong before paying anyone to fix it.',
    description: 'Speed, security, plugins and hosting checked, and written up as one fix list, ranked by risk.',
    serviceType: 'WordPress site health audit',
    gets: ['Speed and Core Web Vitals check', 'Security, plugin and theme review', 'Hosting review and a ranked fix list'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'rescue',
    name: 'Rescue / fix',
    forWho: 'The site is down, hacked, or broke after an update.',
    description: 'Malware cleanup, a broken or blank site, plugin conflicts. Backed up first, fixed, then hardened so it doesn’t happen again.',
    serviceType: 'WordPress malware cleanup and site repair',
    gets: ['Backup before anything is touched', 'Malware and conflict cleanup', 'Hardening afterwards'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'build',
    name: 'Custom build / rebuild',
    forWho: 'The site needs starting over, or you’re leaving a page builder.',
    description: 'A custom block theme with editable blocks and patterns, your content moved across, and SEO kept with a redirect map.',
    serviceType: 'Custom WordPress block theme build and rebuild',
    gets: ['Custom block theme and patterns', 'Content moved across', 'Redirect map for every old URL'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'speed',
    name: 'Speed optimization',
    forWho: 'It works. It’s just slow, especially on a phone.',
    description: 'A Core Web Vitals pass: plugins trimmed, caching set up once, images resized, scripts deferred, then checked again.',
    serviceType: 'WordPress speed and Core Web Vitals optimization',
    gets: ['Plugins and scripts trimmed', 'Caching set up once', 'Images resized and compressed'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'Care plan',
    forWho: 'You want someone looking after it, so you don’t have to.',
    description: 'Updates tried on staging, daily backups, uptime and security monitoring, and small edits, every month. I recommend a host that fits; I don’t sell hosting.',
    serviceType: 'WordPress maintenance and care plan',
    gets: ['Updates tried on staging first', 'Daily backups and monitoring', 'Small edits each month'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

export const WOO_NOTE = 'WooCommerce stores are in scope for every offer, with checkout and payments tested on staging before anything goes live.';

/** "What every site includes" (brief §4 item 7). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  { icon: 'backup', title: 'Daily backups', text: 'Kept off the server, so a bad day at the host isn’t a bad day for you.' },
  { icon: 'staging', title: 'A staging site', text: 'Every update and change is tried on a copy first, never on the live site.' },
  { icon: 'shield', title: 'Security hardening', text: 'Current software, admin logins kept to who needs them, two-factor for admins, and a firewall.' },
  { icon: 'blocks', title: 'Editable blocks', text: 'Pages built from blocks and patterns your team edits in the editor, without touching code.' },
  { icon: 'redirect', title: 'Redirect map on rebuilds', text: 'Every old URL mapped to its new home before launch, so links and rankings aren’t thrown away.' },
  { icon: 'play', title: 'A handover video', text: 'A recorded walkthrough of your own site: how to edit it, and what not to touch.' },
] as const;

/** Steps in order (brief §4 item 8): Audit → Plan → Build → Launch → Care. */
export const PROCESS = [
  { title: 'Audit', text: 'A free 30-minute scoping call, then a read-only look at the site, the hosting and every plugin.', leaves: 'A ranked fix list' },
  { title: 'Plan', text: 'What stays, what goes, what gets rebuilt, and the redirect map, agreed before anything changes.', leaves: 'A plan you sign off' },
  { title: 'Build', text: 'The work happens on staging, with backups, while the live site keeps running.', leaves: 'A staging site to review' },
  { title: 'Launch', text: 'Go-live in a quiet hour: redirects checked, forms and checkout tested on the live site.', leaves: 'A live, lighter site' },
  { title: 'Care', text: 'Updates, backups and monitoring every month, if you want me to stay on it.', leaves: 'A site that stays that way' },
] as const;

export const ABOUT = {
  title: 'A developer who writes the code, not just the settings.',
  paragraphs: [
    'I’m Faraz, a full-stack engineer and the founder of Indepth Solution, in Lahore. I build web apps and automations, and WordPress is where a lot of businesses keep their website and their writing.',
    'That background is the point. When a plugin can’t do the job, I can write the block, the integration or the fix, instead of adding one more plugin to the pile.',
    'My own product, AI SEO Automator, writes content and publishes it straight to a site, so I care about the publishing side as much as the page itself.',
  ],
} as const;

export const FAQ = [
  {
    q: 'Can you fix my current site, or does it need a rebuild?',
    a: 'Most sites can be fixed. The audit tells us which: if the theme and plugins can be cleaned up, I fix what’s there. If the site sits on a stack that will keep breaking, I’ll say so and we scope a rebuild.',
  },
  {
    q: 'Will I lose my search rankings in a rebuild?',
    a: 'Nobody can honestly promise rankings, but a rebuild shouldn’t throw them away. Before launch every old URL gets a redirect to its new home, titles and descriptions move across, and the sitemap is resubmitted. After launch I check for broken links and crawl errors.',
  },
  {
    q: 'Do you work on Elementor or other page-builder sites?',
    a: 'I can fix and speed up a page-builder site. For a rebuild I recommend the block editor and a block theme instead: it’s built into WordPress, it’s lighter, and your team no longer depends on a builder plugin and its add-ons.',
  },
  {
    q: 'Which hosting do you recommend?',
    a: 'It depends on the traffic, the budget and whether the site runs WooCommerce, so I recommend a host on the call. I don’t sell hosting; a care plan looks after the site wherever it lives.',
  },
  {
    q: 'Can my team edit the content themselves?',
    a: 'That’s the aim of every build. Pages are made of blocks and patterns your team edits in the WordPress editor, and the handover video shows how.',
  },
  {
    q: 'What’s in the care plan?',
    a: 'Updates tried on staging first, daily backups kept off the server, uptime and security monitoring, and small edits each month. The exact scope is agreed on the call.',
  },
  {
    q: 'Do you work on WooCommerce stores?',
    a: 'Yes, WooCommerce is in scope for every offer. Stores get extra care: updates tested against checkout and payments on staging, and changes timed for quiet hours.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on the site and the work, so I scope it on a free 30-minute call. You know what’s involved before anything is agreed.',
  },
] as const;
