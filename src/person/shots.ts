/**
 * Shared project screenshots, resolved by project id. Astro only (import.meta.glob).
 *
 * Put a screenshot at src/person/assets/projects/<project id>.png (or .jpg / .jpeg / .webp) and
 * set `screenshot.alt` on the project in ./projects.ts. Every niche finds it here, so a new project
 * needs no per-niche copy and no import. Redact client names before a file goes in this folder.
 *
 * Every file is imported eagerly, so Astro emits each original once; a file that no built page
 * renders is removed after the build by the `prune-unused-images` integration (astro.config.mjs).
 * The older per-niche copies (`screenshot.copies`) keep their own imports in their niches.
 */
import type { ImageMetadata } from 'astro';
import type { Project } from './projects.ts';

const FILES = import.meta.glob<{ default: ImageMetadata }>('./assets/projects/*.{png,jpg,jpeg,webp}', { eager: true });

const BY_ID: ReadonlyMap<string, ImageMetadata> = new Map(
  Object.entries(FILES).map(([path, mod]) => [path.replace(/^.*\/([^/]+)\.\w+$/, '$1'), mod.default]),
);

/** The shared screenshot of a project: only when the file exists AND the project has `screenshot.alt`. */
export function projectShot(p: Project): { readonly src: ImageMetadata; readonly alt: string } | undefined {
  const src = BY_ID.get(p.id);
  return src && p.screenshot ? { src, alt: p.screenshot.alt } : undefined;
}
