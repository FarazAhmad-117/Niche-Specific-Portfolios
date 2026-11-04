/**
 * Generates vercel.json from the niche registry (src/niches.ts).
 * Run via `npm run gen:vercel` (also runs automatically before `npm run build`).
 *
 * One rewrite per enabled niche:
 *   <slug>.<rootDomain>/<anything except _astro/...>  ->  /<slug>/<anything>
 *
 * Node runs this file directly (native TypeScript type stripping).
 */
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { enabledNiches, nicheHost } from '../src/niches.ts';

const root = new URL('../', import.meta.url);

// Fail early if a niche is enabled but its pages folder is missing.
const missing = enabledNiches.filter(
  (n) => !existsSync(fileURLToPath(new URL(`src/pages/${n.slug}/index.astro`, root))),
);
if (missing.length > 0) {
  console.error(
    `gen:vercel: enabled niche(s) without src/pages/<slug>/index.astro: ${missing
      .map((n) => n.slug)
      .join(', ')}`,
  );
  process.exit(1);
}

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  // Matches trailingSlash: 'always' in astro.config.mjs.
  trailingSlash: true,
  rewrites: enabledNiches.map((n) => ({
    source: '/:path((?!_astro/).*)',
    has: [{ type: 'host', value: nicheHost(n.slug) }],
    destination: `/${n.slug}/:path`,
  })),
};

writeFileSync(new URL('vercel.json', root), JSON.stringify(config, null, 2) + '\n');
console.log(`gen:vercel: wrote vercel.json (${enabledNiches.length} niches)`);
