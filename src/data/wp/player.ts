/**
 * Model for the signature "Before / after" player: an example WordPress site shown in an admin
 * mock (Plugins → Site Health → the fix → the block editor → a before/after compare).
 *
 * EVERYTHING here is illustrative and labelled so on the page: the site ("Northwind Journal"),
 * the plugin names (invented, so no real product is singled out), the counts (the brief's
 * "47 plugins") and the page-weight meter (a relative bar with no units, never a score or a
 * timing). No Lighthouse scores, no load times.
 */

export const EXAMPLE_SITE = 'Northwind Journal';

export type Screen = 'plugins' | 'health' | 'editor' | 'compare';
export type Mode = 'before' | 'fix' | 'after';

export interface PluginRow {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly active: boolean;
  /** An update is waiting. */
  readonly update?: boolean;
  /** Fault tag shown from step 2. */
  readonly flag?: string;
  /** What happens to it in the fix (step 4). */
  readonly fix?: 'remove' | 'replace' | 'reactivate' | 'keep';
  readonly fixNote?: string;
}

/** The visible slice of the 47 (the rest are summarised as "+ N more"). */
export const PLUGINS: readonly PluginRow[] = [
  { id: 'builder', name: 'Builder Pro', desc: 'Page builder', active: true, update: true, fix: 'replace', fixNote: 'Block theme' },
  { id: 'addons', name: 'Builder Addons Pack', desc: '90+ extra widgets', active: true, update: true, fix: 'remove', fixNote: 'Removed' },
  { id: 'cache-a', name: 'PageCache Plus', desc: 'Page caching', active: true, flag: 'Conflict', fix: 'keep', fixNote: 'Kept, set once' },
  { id: 'cache-b', name: 'TurboCache Lite', desc: 'Page caching', active: true, update: true, flag: 'Conflict', fix: 'remove', fixNote: 'Removed' },
  { id: 'guard', name: 'Guardwall Security', desc: 'Firewall and login limits', active: false, flag: 'Switched off', fix: 'reactivate', fixNote: 'Back on' },
  { id: 'seo-a', name: 'Meta Tags Kit', desc: 'Titles and sitemaps', active: true, update: true, fix: 'keep', fixNote: 'Kept' },
  { id: 'seo-b', name: 'Title Tag Helper', desc: 'Titles and sitemaps', active: true, flag: 'Duplicate', fix: 'remove', fixNote: 'Removed' },
  { id: 'slider', name: 'Hero Slider Deluxe', desc: 'Homepage slider', active: true, update: true, fix: 'replace', fixNote: 'Cover block' },
];

export const COUNTS = {
  before: { plugins: 47, updates: 9 },
  after: { plugins: 12, updates: 0 },
} as const;

/** The homepage's assets on the Site Health step, heaviest first. `w` is a relative bar (0–1), no units. */
export const ASSETS = [
  { file: 'builder-frontend.css', from: 'Builder Pro', w: 0.62, blocking: true },
  { file: 'addons-widgets.js', from: 'Builder Addons Pack', w: 0.78, blocking: true },
  { file: 'slider.min.js', from: 'Hero Slider Deluxe', w: 0.55, blocking: true },
  { file: 'pagecache.js + turbocache.js', from: 'Two caching plugins', w: 0.34, blocking: false },
  { file: 'hero.jpg · camera original', from: 'Media Library', w: 1, blocking: false },
  { file: 'share-bar.js', from: 'Share Bar', w: 0.28, blocking: false },
] as const;

/** The block editor step: the patterns the builder layouts become. */
export const PATTERNS = [
  { name: 'Hero', blocks: 'Cover, Heading, Buttons' },
  { name: 'Services', blocks: 'Columns ×3' },
  { name: 'Latest posts', blocks: 'Query Loop' },
  { name: 'Call to action', blocks: 'Group, Buttons' },
] as const;

export const SETTINGS = [
  { k: 'Page cache', v: 'One plugin, set once' },
  { k: 'Images', v: 'Resized, WebP, srcset' },
  { k: 'Scripts', v: 'Deferred, only where used' },
] as const;

export interface Step {
  readonly mode: Mode;
  readonly screen: Screen;
  readonly title: string;
  readonly text: string;
  /** Extra line shown only when the script runs (it describes a control). */
  readonly hint?: string;
  /** Fault tags shown on the plugin rows. */
  readonly flags: boolean;
  /** The plugin list shows the fix (struck rows, new notes, the lean count). */
  readonly fixed: boolean;
  /** Which admin menu item is current. */
  readonly menu: 'plugins' | 'tools' | 'appearance' | 'pages';
}

export const STEPS: readonly Step[] = [
  {
    mode: 'before',
    screen: 'plugins',
    flags: false,
    fixed: false,
    menu: 'plugins',
    title: '47 plugins, 9 updates waiting',
    text: 'The Plugins screen of an example site. Nine updates have waited for months, because the last one broke the homepage.',
  },
  {
    mode: 'before',
    screen: 'plugins',
    flags: true,
    fixed: false,
    menu: 'plugins',
    title: 'Two caches, a guard switched off',
    text: 'Two caching plugins fight over the same pages, two SEO plugins print two sets of tags, and the security plugin was switched off “to test something”.',
  },
  {
    mode: 'before',
    screen: 'health',
    flags: true,
    fixed: false,
    menu: 'tools',
    title: 'One page, carrying everything',
    text: 'The homepage loads every plugin’s scripts, needed or not. The builder, its add-ons and the slider hold up the first paint; the hero image is the camera original.',
  },
  {
    mode: 'fix',
    screen: 'plugins',
    flags: true,
    fixed: true,
    menu: 'plugins',
    title: 'Remove, replace, keep one of each',
    text: 'Backed up and copied to staging first. The second cache and the second SEO plugin go, the slider becomes a core Cover block, and the security plugin is back on.',
  },
  {
    mode: 'fix',
    screen: 'editor',
    flags: false,
    fixed: true,
    menu: 'appearance',
    title: 'A block theme your team can edit',
    text: 'The builder layouts become a block theme with patterns your team edits in the editor. Caching is set once; images are served at the size they’re shown.',
  },
  {
    mode: 'after',
    screen: 'compare',
    flags: false,
    fixed: true,
    menu: 'pages',
    title: 'Drag to compare',
    text: 'The same homepage, before and after, split down the middle: the old page on the left, the new one on the right.',
    hint: 'Drag the handle, or use the arrow keys on it; the plugin count and the meter follow.',
  },
];

export const MENU = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'posts', label: 'Posts' },
  { id: 'media', label: 'Media' },
  { id: 'pages', label: 'Pages' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'tools', label: 'Tools' },
  { id: 'settings', label: 'Settings' },
] as const;
