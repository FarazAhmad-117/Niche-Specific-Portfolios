/**
 * The marketplace sync map (decisions.md › shopify › Marketplace sync map: Include, Yard
 * Terminal).
 *
 * Drawn the way Yard Terminal is designed to work (docs/research/ai-web.md, from yardterminal.com,
 * checked against the code scan in project-handoff/projects.json): the Part record is the hub and
 * owns the count; each channel connects to Yard Terminal directly and only holds a listing. The
 * brief asked for "Shopify in the centre"; accuracy wins (noted in docs/todo/shopify.md), so
 * Shopify is the emphasised spoke instead.
 *  - Status today (code scan): the eBay channel runs against eBay's SANDBOX, and the Shopify
 *    channel is built as a library that does NOT run yet. So the map is labelled a simulation of
 *    the designed flow, and each tile says where the channel really is.
 *  - Counter sale: Yard Terminal's own point of sale (not Shopify POS), shown as product design.
 *  - Approval: the AI drafts each listing and a person approves it before anything lists (the
 *    top tile; it is a gate, not a channel).
 *  - Amazon, Google Shopping, Facebook Marketplace: not built. Not drawn.
 * The part is an EXAMPLE (the same illustrative alternator Yard Terminal's own site uses);
 * the events are the designed flow. Counts and sync times are open: TODO chips, never numbers.
 *
 * The whole model is the `yard-terminal` project's. SYNC_PROJECT is undefined when the person
 * does not have it; the home page then omits the sync map (lib/shopify/sections.ts) and no case
 * page uses NODES, so nothing below is shown for someone else.
 */
import { getProject } from '../../person/case-helpers';

/** The project the sync map is drawn from; undefined in Example mode. */
export const SYNC_PROJECT = getProject('yard-terminal');

export type NodeId = 'record' | 'shopify' | 'ebay' | 'counter' | 'approve';

export const NODES = {
  record: { name: 'Part record', sub: 'Owns the count · qty 1', status: 'Qty 1' },
  shopify: { name: 'Shopify', sub: 'The yard’s own storefront · channel built, not live yet', status: 'Not live yet' },
  ebay: { name: 'eBay Motors', sub: 'The yard’s own account · eBay sandbox today', status: 'Sandbox' },
  counter: { name: 'Counter sale', sub: SYNC_PROJECT ? `${SYNC_PROJECT.name}’s own point of sale` : 'Own point of sale', status: 'By design' },
  approve: { name: 'Approval', sub: 'AI drafts, a person approves', status: 'Every listing' },
} as const satisfies Record<NodeId, { name: string; sub: string; status: string }>;

export const EXAMPLE_PART = '2018 Silverado 1500 alternator';

/** Listing state shown on a channel tile. */
export type Listing = 'none' | 'listed' | 'sold' | 'ended' | 'verified';
/** State of the record itself. */
export type RecordState = 'available' | 'sold';

export interface SyncBeat {
  /** What happened, in a few words (the log line). */
  readonly log: string;
  /** Which spoke a packet travels this beat (always record ↔ a channel), or null. */
  readonly packet: readonly [NodeId, NodeId] | null;
  readonly record: RecordState;
  readonly shopify: Listing;
  readonly ebay: Listing;
}

/**
 * One loop, one event per beat (a simulation of the designed flow). A person approves the draft,
 * then two stories: a part sells on eBay Motors (the record marks it
 * sold, the Shopify listing is ended and checked), then a second part sells at the counter
 * (both online listings end).
 */
export const BEATS: readonly SyncBeat[] = [
  { log: 'AI draft approved by a person', packet: ['approve', 'record'], record: 'available', shopify: 'none', ebay: 'none' },
  { log: 'Listed on Shopify', packet: ['record', 'shopify'], record: 'available', shopify: 'listed', ebay: 'none' },
  { log: 'Listed on eBay Motors', packet: ['record', 'ebay'], record: 'available', shopify: 'listed', ebay: 'listed' },
  { log: 'Sold on eBay Motors: the record marks it sold', packet: ['ebay', 'record'], record: 'sold', shopify: 'listed', ebay: 'sold' },
  { log: 'Shopify listing ended', packet: ['record', 'shopify'], record: 'sold', shopify: 'ended', ebay: 'sold' },
  { log: 'End checked against Shopify', packet: null, record: 'sold', shopify: 'verified', ebay: 'sold' },
  { log: 'Next part approved: listed on both', packet: ['record', 'ebay'], record: 'available', shopify: 'listed', ebay: 'listed' },
  { log: 'Sold at the counter: the record marks it sold', packet: ['counter', 'record'], record: 'sold', shopify: 'listed', ebay: 'listed' },
  { log: 'Both online listings ended and checked', packet: ['record', 'shopify'], record: 'sold', shopify: 'verified', ebay: 'verified' },
];

export const LISTING_LABEL: Record<Listing, string> = {
  none: 'Not listed',
  listed: 'Listed · qty 1',
  sold: 'Sold here',
  ended: 'Listing ended',
  verified: 'Ended · checked',
};

export const RECORD_LABEL: Record<RecordState, string> = {
  available: 'Qty 1 · for sale',
  sold: 'Qty 0 · sold',
};

export const SYNC_TODOS = ['TODO · Parts / SKUs synced', 'TODO · Measured sync time', 'TODO · Overselling, before and after'] as const;
