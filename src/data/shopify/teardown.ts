/**
 * The Store teardown (signature section): an EXAMPLE product page and the fixes an audit
 * applies to it, one per step. The store, the product and the scripts are illustrative and
 * labelled as such everywhere. The meter is illustrative too: a position on a Slow → Fast
 * scale, never a score, a Lighthouse number or a load time.
 *
 * Each step applies the fixes before it (cumulative). `fix` is the id the markup and CSS use
 * (`data-fixes~="<id>"`); `meter` is 0..1 along the dial.
 */

export type FixId = 'img' | 'dead' | 'section' | 'chat' | 'sticky';

export interface TeardownStep {
  readonly title: string;
  readonly short: string;
  readonly text: string;
  /** The fix this step applies, or null for the "as found" step. */
  readonly fix: FixId | null;
  /** Illustrative dial position after this step, 0 (slow) to 1 (fast). */
  readonly meter: number;
  /** What kind of fix it is, for the label on the card. */
  readonly kind: 'start' | 'speed' | 'conversion';
}

export const STORE = {
  name: 'Kiln & Co.',
  url: 'kiln-and-co.example/products/speckled-mug',
  product: 'Speckled stoneware mug',
  variants: ['Clay', 'Ash', 'Moss'],
} as const;

export const STEPS: readonly TeardownStep[] = [
  {
    title: 'As found',
    short: 'As found',
    text: 'The example product page as it arrives: a full-size photo, scripts from five apps (one of them uninstalled months ago), and a chat widget that loads for every visitor.',
    fix: null,
    meter: 0.14,
    kind: 'start',
  },
  {
    title: 'Photos sized and lazy-loaded',
    short: 'Photos',
    text: 'The main photo is served at the size it is shown, in a modern format, and loads first. Photos further down wait until they are needed, and every image has its space reserved, so nothing jumps.',
    fix: 'img',
    meter: 0.38,
    kind: 'speed',
  },
  {
    title: 'Leftover app code removed',
    short: 'Leftovers',
    text: 'An uninstalled popup app left its snippet in the theme, still loading on every page. It comes out, along with anything else no installed app still uses.',
    fix: 'dead',
    meter: 0.56,
    kind: 'speed',
  },
  {
    title: 'An app replaced by a section',
    short: 'Section',
    text: 'The countdown bar was a monthly app doing one small job. Now it is a section in the theme: the same bar, edited in the theme editor, with no extra script.',
    fix: 'section',
    meter: 0.71,
    kind: 'speed',
  },
  {
    title: 'Chat loads when asked',
    short: 'Chat',
    text: 'The chat widget stays, but its script waits until a shopper taps the button instead of loading for every visitor.',
    fix: 'chat',
    meter: 0.86,
    kind: 'speed',
  },
  {
    title: 'Sticky add to cart on phones',
    short: 'Add to cart',
    text: 'Not a speed fix, a buying one: on phones, Add to cart stays in reach while shoppers scroll photos and reviews. So the meter does not move for this one.',
    fix: 'sticky',
    meter: 0.86,
    kind: 'conversion',
  },
];

/**
 * Scripts the example page loads, as chips in the "loaded on this page" strip. `fix` is the
 * step that changes the chip; `after` is what it reads once fixed. Names are generic, not
 * real apps.
 */
export const SCRIPTS = [
  { name: 'theme.js', fix: null, after: null },
  { name: 'reviews.js', fix: null, after: null },
  { name: 'popup.js', fix: 'dead', after: 'removed' },
  { name: 'countdown.js', fix: 'section', after: 'now a section' },
  { name: 'chat.js', fix: 'chat', after: 'on tap' },
  { name: 'upsell.js', fix: null, after: null },
] as const satisfies readonly { name: string; fix: FixId | null; after: string | null }[];
