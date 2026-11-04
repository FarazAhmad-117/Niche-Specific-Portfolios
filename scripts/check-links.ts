/**
 * Finds internal links in a build that point at files which do not exist:
 *
 *   npm run check:links                      checks dist/
 *   npm run check:links -- --dir <build dir>  checks another build folder
 *   npm run check:links -- --domain example.dev   root domain (default: src/person/config.ts)
 *
 * Every niche is built under <dir>/<slug>/ and served from the root of https://<slug>.<rootDomain>
 * (vercel.json rewrites everything except /_astro/). So a value is resolved like this:
 *   /_astro/…                         -> <dir>/_astro/…
 *   /path                             -> <dir>/<slug of the page>/path
 *   https://<slug>.<rootDomain>/path  -> <dir>/<slug>/path   (cross-niche links, canonicals, og:url)
 *   relative/path                     -> next to the page
 * A page at the build root (404.html) is served on every host: "/file" there may be a file at the
 * build root (Vercel serves existing files before applying rewrites), otherwise it must exist in
 * every niche folder.
 * Hash and query are stripped; a path ending in "/" (or without an extension) means index.html.
 * External URLs (other hosts, the bare root domain = the main site), mailto:, tel:, data:,
 * javascript: and "#…" are skipped.
 *
 * Checked: href / src / srcset / poster attributes and absolute niche-host URLs in <meta content>
 * of every .html file, <loc> entries of every .xml file (sitemaps) and "Sitemap:" lines of every
 * robots.txt. Prints each missing target with the pages that reference it; exit 1 when any is missing.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const dir = resolve(root, arg('--dir') ?? 'dist');
let domain = arg('--domain');
if (!domain) {
  const { PERSON_CONFIG } = await import('../src/person/config.ts');
  domain = PERSON_CONFIG.rootDomain;
}
if (!existsSync(dir) || !statSync(dir).isDirectory()) {
  console.error(`check:links: build folder not found: ${dir} (run a build first, or pass --dir)`);
  process.exit(2);
}

function walk(d: string, out: string[] = []): string[] {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const full = join(d, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(dir);
const rel = (f: string): string => relative(dir, f).split(sep).join('/');
const escDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NICHE_URL = new RegExp(`^https?://([a-z0-9-]+)\\.${escDomain}(/[^\\s"'<>]*)?$`, 'i');
const SKIP = /^(?:mailto:|tel:|data:|javascript:|blob:|#)/i;

const decode = (s: string): string =>
  s.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/** Niche folders: top-level folders with an index.html (each one is a host's root). */
const nicheDirs = readdirSync(dir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(dir, e.name, 'index.html')))
  .map((e) => join(dir, e.name));

/**
 * The files a URL value points to inside the build (empty when external/skipped). A page at the
 * build root (404.html) is served on every niche host, so "/x" must exist in every niche folder.
 */
function targets(value: string, page: string): string[] {
  let v = decode(value.trim());
  if (v === '' || SKIP.test(v)) return [];
  let bases: string[];
  const m = NICHE_URL.exec(v);
  if (m) {
    bases = [join(dir, m[1].toLowerCase())];
    v = m[2] ?? '/';
  } else if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(v)) {
    return []; // another host (incl. the bare root domain = main site)
  } else if (v.startsWith('/')) {
    const parts = rel(page).split('/');
    if (v.startsWith('/_astro/')) bases = [dir];
    else if (parts.length > 1) bases = [join(dir, parts[0])];
    // A root page (404.html): a file at the build root is served as is (Vercel checks the
    // filesystem before rewrites); otherwise the path is rewritten into each niche folder.
    else if (existsSync(join(dir, v.replace(/[?#].*$/, '').replace(/^\/+/, ''))) && !v.endsWith('/')) bases = [dir];
    else bases = nicheDirs;
  } else {
    bases = [dirname(page)];
  }
  v = v.replace(/[?#].*$/, '');
  try {
    v = decodeURIComponent(v);
  } catch {
    /* keep as is */
  }
  return bases.map((base) => {
    let p = join(base, v.replace(/^\/+/, ''));
    if (v === '' || v.endsWith('/')) p = join(p, 'index.html');
    else if (extname(v) === '') p = existsSync(p) && statSync(p).isFile() ? p : join(p, 'index.html');
    return p;
  });
}

const missing = new Map<string, Set<string>>();
let checked = 0;
function check(value: string, page: string): void {
  for (const t of targets(value, page)) {
    checked++;
    if (!(existsSync(t) && statSync(t).isFile())) {
      const key = `${rel(t)}  (from "${value}")`;
      if (!missing.has(key)) missing.set(key, new Set());
      missing.get(key)!.add(rel(page));
    }
  }
}

let pages = 0;
for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (ext === '.html') {
    pages++;
    const html = readFileSync(f, 'utf8');
    for (const m of html.matchAll(/<[a-z][^>]*>/gi)) {
      const tag = m[0];
      for (const a of tag.matchAll(/\s(href|src|poster|srcset|content)\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
        const name = a[1].toLowerCase();
        const val = a[3] ?? a[4] ?? '';
        if (name === 'srcset') {
          for (const part of val.split(',')) check(part.trim().split(/\s+/)[0] ?? '', f);
        } else if (name === 'content') {
          if (NICHE_URL.test(decode(val.trim()))) check(val, f);
        } else {
          check(val, f);
        }
      }
    }
  } else if (ext === '.xml') {
    for (const m of readFileSync(f, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) check(m[1], f);
  } else if (rel(f).endsWith('robots.txt')) {
    for (const m of readFileSync(f, 'utf8').matchAll(/^Sitemap:\s*(\S+)/gim)) check(m[1], f);
  }
}

console.log(`check:links › ${dir} (root domain ${domain}): ${pages} pages, ${checked} internal references`);
if (missing.size === 0) {
  console.log('  PASS  every internal link, asset, sitemap <loc> and robots Sitemap: target exists');
} else {
  console.log(`  FAIL  ${missing.size} missing target(s):`);
  for (const [t, from] of [...missing].sort(([a], [b]) => a.localeCompare(b))) {
    const list = [...from].sort();
    console.log(`        ${t}`);
    console.log(`          referenced by ${list.slice(0, 5).join(', ')}${list.length > 5 ? ` and ${list.length - 5} more` : ''}`);
  }
  process.exit(1);
}
