/**
 * Scaffold a niche:  npm run new:niche <slug> ["Display Name"]
 *
 * - Slug already in src/niches.ts: sets enabled: true (name arg is ignored).
 * - New slug: appends it to src/niches.ts (enabled, noindex ON); a display name is required.
 * - Creates src/pages/<slug>/, src/layouts/<slug>/ and src/assets/<slug>/ from
 *   scripts/templates/*.tpl (the shared 404 is src/pages/404.astro, not per niche).
 * - Never overwrites: aborts if any target already exists.
 *
 * Node runs this file directly (native TypeScript type stripping).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NICHES, nicheHost } from '../src/niches.ts';

const root = new URL('../', import.meta.url);
const path = (rel: string) => fileURLToPath(new URL(rel, root));
const fail = (msg: string): never => {
  console.error(`new:niche: ${msg}`);
  process.exit(1);
};

const [slug, ...nameParts] = process.argv.slice(2);
if (!slug) fail('usage: npm run new:niche <slug> ["Display Name"]');
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  fail(`invalid slug "${slug}": lowercase letters, digits and dashes, starting with a letter`);
}

const known = NICHES.some((n) => n.slug === slug);
const name = nameParts.join(' ').trim();
if (!known && !name) fail(`"${slug}" is not in the registry yet: pass a display name too`);

const targets = {
  [`src/pages/${slug}/index.astro`]: 'index.astro.tpl',
  [`src/pages/${slug}/robots.txt.ts`]: 'robots.txt.ts.tpl',
  [`src/pages/${slug}/sitemap.xml.ts`]: 'sitemap.xml.ts.tpl',
  [`src/layouts/${slug}/Layout.astro`]: 'Layout.astro.tpl',
  [`src/assets/${slug}/hero.svg`]: 'hero.svg.tpl',
};
const clash = Object.keys(targets).filter((rel) => existsSync(path(rel)));
if (clash.length > 0) fail(`refusing to overwrite:\n  ${clash.join('\n  ')}`);

// 1. Registry.
const registryFile = path('src/niches.ts');
let registry = readFileSync(registryFile, 'utf8');
if (known) {
  const line = new RegExp(`(\\{ slug: '${slug}',[^\\n]*?enabled: )false`);
  registry = registry.replace(line, '$1true');
} else {
  const entry = `  { slug: '${slug}', name: ${JSON.stringify(name)}, enabled: true, noindex: true },\n`;
  registry = registry.replace('] as const satisfies', `${entry}] as const satisfies`);
}
writeFileSync(registryFile, registry);

// 2. Files. Hue is derived from the slug so each niche gets a distinct placeholder colour.
const hue = [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
for (const [rel, tpl] of Object.entries(targets)) {
  const body = readFileSync(path(`scripts/templates/${tpl}`), 'utf8')
    .replaceAll('{{slug}}', slug)
    .replaceAll('{{hue}}', String(hue));
  mkdirSync(path(rel.slice(0, rel.lastIndexOf('/'))), { recursive: true });
  writeFileSync(path(rel), body);
}

console.log(`new:niche: created "${slug}" (${known ? 'enabled in registry' : 'added to registry'}, noindex ON)`);
console.log(Object.keys(targets).map((r) => `  + ${r}`).join('\n'));
console.log(`
Next:
  1. npm run build            (regenerates vercel.json)
  2. Vercel: add domain ${nicheHost(slug)}, then a CNAME for "${slug}" at your DNS provider
  3. When the niche goes live, set noindex: false for it in src/niches.ts`);
