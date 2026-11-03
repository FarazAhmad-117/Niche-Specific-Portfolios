/**
 * The signature "Build system" player: a visual-builder workspace (navigator, canvas, style
 * panel, CMS panel) drawn in this site's own palette. Everything in it is an ILLUSTRATIVE
 * example (an imaginary SaaS called Lumen), labelled as a mock, not a Webflow screenshot.
 *
 * Story: Figma frame → class structure → CMS binds the cards → an interaction plays → edit it
 * yourself (a real, harmless input that rewrites the canvas headline).
 */

export const STEPS = [
  {
    id: 'figma',
    title: 'Start from the Figma frame',
    text: 'The design as it arrives: frames, groups and layers named by Figma. It looks right, but nothing in it says what repeats or what your team will edit.',
  },
  {
    id: 'classes',
    title: 'Give it a class system',
    text: 'Every layer becomes an element with a class named for what it is: section_hero, heading-style-h1, button is-primary. Styles live on classes, so one change updates every page.',
  },
  {
    id: 'cms',
    title: 'Bind the cards to the CMS',
    text: 'The post cards become a collection list. Name, category and thumbnail are bound to fields, so a new post appears without anyone opening the Designer.',
  },
  {
    id: 'motion',
    title: 'Add the interaction',
    text: 'A page-load interaction: the heading rises, the cards follow 80ms apart. Transform and opacity only, on out-quint, and skipped under reduced motion.',
  },
  {
    id: 'edit',
    title: 'Edit it yourself',
    text: 'Your team works in content mode: text and images change, layout and classes stay locked. Try it: type a new headline and the page updates.',
  },
] as const;
export type StepId = (typeof STEPS)[number]['id'];

/** The example page on the canvas. */
export const PAGE = {
  brand: 'Lumen',
  headline: 'Release notes, written for humans.',
  /** What the autoplay types in the "edit it yourself" step. */
  typed: 'Launch week starts Monday.',
  lede: 'Every release turned into a changelog your customers actually read.',
  button: 'Start free',
  postsLabel: 'Latest posts',
} as const;

export const HEADLINE_MAX = 60;

/**
 * The navigator tree: each row has its Figma layer name (step 1) and its class (step 2+).
 * `target` links a row to the canvas element it selects.
 */
export const TREE = [
  { depth: 0, figma: 'Frame 12', cls: 'body', kind: 'body' },
  { depth: 1, figma: 'Group 7', cls: 'section_hero', kind: 'section' },
  { depth: 2, figma: 'Frame 31', cls: 'container-large', kind: 'box' },
  { depth: 3, figma: 'Text', cls: 'heading-style-h1', kind: 'heading', target: 'h1' },
  { depth: 3, figma: 'Text', cls: 'text-size-medium', kind: 'text' },
  { depth: 3, figma: 'Button / Primary', cls: 'button is-primary', kind: 'link' },
  { depth: 1, figma: 'Group 9', cls: 'section_posts', kind: 'section' },
  { depth: 2, figma: 'Card', cls: 'posts_list', kind: 'cms', target: 'list' },
  { depth: 3, figma: 'Card copy', cls: 'posts_item', kind: 'item' },
] as const;

/** The CMS collection (example items). */
export const COLLECTION = {
  name: 'Posts',
  fields: [
    { field: 'Name', to: 'posts_title' },
    { field: 'Category', to: 'posts_tag' },
    { field: 'Thumbnail', to: 'posts_image' },
  ],
  items: [
    { name: 'Release notes people read', category: 'Product' },
    { name: 'Onboarding on one screen', category: 'Design' },
    { name: 'Our docs moved to the CMS', category: 'Engineering' },
  ],
} as const;

/** Inspector rows per view. Labels only; no claims. */
export const FIGMA_PROPS = [
  ['Frame', '1280 × 900'],
  ['Auto layout', 'Vertical · gap 24'],
  ['Padding', '64 · 48'],
  ['Text style', 'Display / H1'],
  ['Layers', 'Named by Figma'],
] as const;

export const STYLE_PROPS = [
  ['Font', 'Unbounded'],
  ['Weight', '600 · Semibold'],
  ['Size', '3.5rem'],
  ['Line height', '1.05'],
  ['Letter spacing', '-0.03em'],
  ['Colour', 'text/primary'],
] as const;

export const TIMELINE = [
  { label: 'heading-style-h1', detail: 'Move Y 24 → 0 · Fade in', start: 0, len: 0.5 },
  { label: 'text-size-medium', detail: 'Same, 80ms later', start: 0.1, len: 0.5 },
  { label: 'button is-primary', detail: 'Same, 160ms later', start: 0.2, len: 0.5 },
  { label: 'posts_item × 3', detail: 'Stagger 80ms', start: 0.32, len: 0.62 },
] as const;
