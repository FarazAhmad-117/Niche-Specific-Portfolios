/**
 * The Store teardown (signature section): an EXAMPLE product page and the fixes a sales and
 * search review applies to it, one per step. The store, the product and its signals are
 * illustrative and labelled as such everywhere. The meter is illustrative too: a position on a
 * Not yet → Ready scale, never a score, a conversion rate or a ranking.
 *
 * Each step applies the fixes before it (cumulative). `fix` is the id the markup and CSS use
 * (`data-fixes~="<id>"`); `meter` is 0..1 along the dial.
 */

export type FixId = 'schema' | 'img' | 'ship' | 'trust' | 'sticky';

export interface TeardownStep {
  readonly title: string;
  readonly short: string;
  readonly text: string;
  /** The fix this step applies, or null for the "as found" step. */
  readonly fix: FixId | null;
  /** Illustrative dial position after this step, 0 (not yet) to 1 (ready to sell). */
  readonly meter: number;
  /** What kind of fix it is, for the label on the card. */
  readonly kind: 'start' | 'search' | 'conversion';
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
    text: 'The example product page as it arrives: Google can’t read its price or stock, there is one blurry photo, the top bar gives no reason to buy more, and nothing says when it arrives or how returns work.',
    fix: null,
    meter: 0.12,
    kind: 'start',
  },
  {
    title: 'Google can read the product',
    short: 'Google',
    text: 'One product schema with price, stock and reviews, one canonical URL, and a sitemap Google has been given. The product can now show with its price and stars in search, and in Shopping.',
    fix: 'schema',
    meter: 0.32,
    kind: 'search',
  },
  {
    title: 'Photos that sell',
    short: 'Photos',
    text: 'One sharp main photo that loads first, plus the angles shoppers look for: close up, in the hand, in use. Every image has its space reserved, so nothing jumps.',
    fix: 'img',
    meter: 0.5,
    kind: 'conversion',
  },
  {
    title: 'A reason to add one more',
    short: 'Free shipping',
    text: 'The top bar now says something useful: free shipping over a threshold, set where it nudges a second item into the cart. A theme section your team edits, not another app.',
    fix: 'ship',
    meter: 0.68,
    kind: 'conversion',
  },
  {
    title: 'Delivery and returns up front',
    short: 'Delivery',
    text: 'Next to Add to cart: when it ships and how returns work. The questions shoppers would otherwise leave the page to find answered.',
    fix: 'trust',
    meter: 0.84,
    kind: 'conversion',
  },
  {
    title: 'Add to cart in reach on phones',
    short: 'Add to cart',
    text: 'On phones, Add to cart stays in reach while shoppers scroll photos and reviews, so the decision to buy never has to scroll back up.',
    fix: 'sticky',
    meter: 0.96,
    kind: 'conversion',
  },
];

/**
 * What Google reads from the example page, as chips in the "What Google sees" strip. `fix` is
 * the step that changes the chip; `after` is what it reads once fixed.
 */
export const SIGNALS = [
  { name: 'Title', fix: null, after: null },
  { name: 'Price', fix: 'schema', after: 'read' },
  { name: 'Stock', fix: 'schema', after: 'read' },
  { name: 'Reviews', fix: 'schema', after: 'stars' },
  { name: 'Canonical', fix: 'schema', after: 'one URL' },
  { name: 'Sitemap', fix: 'schema', after: 'submitted' },
] as const satisfies readonly { name: string; fix: FixId | null; after: string | null }[];
