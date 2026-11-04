// @ts-check
import { readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { PERSON_CONFIG } from './src/person/config.ts';

/**
 * Removes image files that Astro emitted for an `import shot from '…png'` but that no built page,
 * stylesheet or script ever uses. Astro deletes an original only after it rendered resized copies
 * of it; an image that is imported but never rendered (a project screenshot whose project is absent
 * from src/person/projects.ts) would otherwise ship as a public, unlinked file.
 * Only an original with no resized copies (`<name>.<hash>_<variant>.<ext>`) that no text file of
 * the build mentions is removed, so a build that renders every import is left exactly as it was.
 */
function pruneUnusedImages() {
  let assetsDir = '_astro';
  return {
    name: 'prune-unused-images',
    hooks: {
      /** @param {{ config: import('astro').AstroConfig }} opts */
      'astro:config:done': ({ config }) => {
        assetsDir = config.build.assets;
      },
      /** @param {{ dir: URL, logger: import('astro').AstroIntegrationLogger }} opts */
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        /** @type {string[]} */
        const all = [];
        const walk = (/** @type {string} */ d) => {
          for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = join(d, e.name);
            if (e.isDirectory()) walk(p);
            else all.push(p);
          }
        };
        walk(out);
        const text = all
          .filter((p) => /\.(html|css|js|mjs|json|xml|txt|webmanifest|svg)$/i.test(p))
          .map((p) => readFileSync(p, 'utf8'))
          .join('\n');
        const assets = join(out, assetsDir);
        const names = all.filter((p) => p.startsWith(assets)).map((p) => p.slice(assets.length + 1));
        for (const name of names) {
          const m = /^(.+\.[\w-]{8})\.(png|jpe?g|webp|avif|gif)$/i.exec(name);
          if (!m) continue;
          const hasVariants = names.some((n) => n.startsWith(`${m[1]}_`));
          if (hasVariants || text.includes(name)) continue;
          unlinkSync(join(assets, name));
          logger.info(`removed unused image ${assetsDir}/${name} (imported, never rendered)`);
        }
      },
    },
  };
}

// Static output. Every niche lives under /<slug>/ in the build; on production
// Vercel rewrites <slug>.<rootDomain>/* to /<slug>/* (see vercel.json,
// generated from src/niches.ts; rootDomain is set in src/person/config.ts).
export default defineConfig({
  output: 'static',
  // Keep in sync with "trailingSlash" in the generated vercel.json.
  trailingSlash: 'always',
  // Inline CSS: the stylesheet is a render-blocking request on the LCP path, and each
  // niche is only a handful of pages, so there is no shared-cache benefit to lose.
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [pruneUnusedImages()],
  // Contact form defaults from src/person/config.ts, inlined as plain strings so the client
  // script does not bundle the config object. PUBLIC_CONTACT_* (see .env.example) still win.
  vite: {
    define: {
      __CONTACT_ENDPOINT__: JSON.stringify(PERSON_CONFIG.contactEndpoint),
      __CONTACT_FALLBACK_EMAIL__: JSON.stringify(PERSON_CONFIG.contactFallbackEmail),
    },
  },
});
