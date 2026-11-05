/**
 * Which home sections this person's page actually renders. site.ts lists every section the
 * niche has (SECTIONS, NAV_LINKS); every one of them renders for every person today (the
 * Yard Terminal sync map, the only conditional section, was removed on 2026-11-05).
 * Kept as the single place Nav and Footer read their links from.
 * Pure TS (no Astro imports).
 */
import { NAV_LINKS, type SectionId } from '../../data/shopify/site';

export const isSectionShown = (_id: SectionId): boolean => true;

/** NAV_LINKS without links to sections this page does not render. */
export const SHOWN_NAV_LINKS = NAV_LINKS.filter((l) => isSectionShown(l.id));
