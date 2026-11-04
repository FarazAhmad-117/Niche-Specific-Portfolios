/**
 * Which home sections this person's page actually renders. site.ts lists every section the
 * niche can have (SECTIONS, NAV_LINKS); the sync map is drawn from the `yard-terminal` project,
 * so without that project (Example mode) the section is omitted and its nav / footer links go
 * with it. For the current owner every section shows, so the lists are unchanged.
 * Pure TS (no Astro imports).
 */
import { hasProject } from '../../person/case-helpers';
import { NAV_LINKS, type SectionId } from '../../data/shopify/site';

/** The sync map renders only when its project is in src/person/projects.ts. */
export const SHOW_SYNC_MAP: boolean = hasProject('yard-terminal');

export const isSectionShown = (id: SectionId): boolean => id !== 'sync' || SHOW_SYNC_MAP;

/** NAV_LINKS without links to sections this page does not render. */
export const SHOWN_NAV_LINKS = NAV_LINKS.filter((l) => isSectionShown(l.id));
