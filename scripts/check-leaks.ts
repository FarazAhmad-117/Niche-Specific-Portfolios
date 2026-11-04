/**
 * Leak scan: finds a previous owner's identity or project names in a build (and optionally src/).
 * Use it after switching src/person/ to a new person, to prove nothing of the old one renders.
 *
 *   npm run check:leaks                                  scan dist/ for the default token list
 *   npm run check:leaks -- --dir <build dir>             scan another build folder
 *   npm run check:leaks -- --src                         also scan src/ (minus src/person/, src/assets/)
 *   npm run check:leaks -- --tokens "Jane,Acme,acme.io"  your own comma-separated list
 *   npm run check:leaks -- --tokens-file leaks.txt       one token per line, "#" starts a comment
 *                                                        (path relative to where npm was run)
 *   npm run check:leaks -- --ignore-case                 case-insensitive matching
 *   npm run check:leaks -- --strict                      exit 1 on any hit that is not a dead CSS selector
 *                                                        or a portrait file name
 *
 * Default tokens = the template's original owner (Faraz Ahmad) and his projects, so a new person
 * can run it with no arguments. Tokens are exact substrings (case-sensitive unless --ignore-case);
 * a purely numeric token ("257") does not match inside a longer number or decimal (SVG coordinates).
 * Random ids (the contact form's cf-<niche>-xxxxxx) can still contain a number by chance.
 *
 * Scanned build files: .html .xml .json .txt .css .js .mjs .svg .webmanifest. Images (OG PNGs,
 * screenshots) cannot be grepped: their file NAMES are checked instead (a token in a file name under
 * the build counts as an "asset-name" hit), and `npm run check:person` warns about template default
 * images that are still byte-identical (scripts/template-assets.json).
 *
 * Each hit is classified by where it sits:
 *   text           visible page text (outside tags, <style> and <script>)
 *   attribute      inside a tag: href, alt, content, title, data-*, … (visible to crawlers / users)
 *   json-ld        inside <script type="application/ld+json">
 *   script         inside another <script>, or a .js/.mjs file
 *   css            CSS outside a view-transition selector (inline <style> or .css file)
 *   dead-selector  a ::view-transition-*(case-<slug>) / view-transition-name: case-<slug> rule in CSS:
 *                  matches nothing when that case is absent, renders nothing (allowed by --strict)
 *   xml / txt / json / svg   sitemaps, robots.txt, other data files
 *   asset-name     a build file whose name contains the token
 *   portrait-name  "asset file name (portrait keeps the source name)": a build file whose name
 *                  contains "faraz" in any case, e.g. _astro/faraz.<hash>.webp (Astro names images
 *                  after src/person/assets/faraz.jpg). Reported, but allowed by --strict.
 *   src-code / src-comment   with --src: a line in src/ (comment = starts with //, *, /*, <!--)
 * Output: per token, per class, each file with a count and a short context snippet.
 *
 * Client blocklist (scripts/client-blocklist.ts): independent of the tokens above and of --strict,
 * every run also scans the build and ALL of src/ (src/person/ included, file names too) for client
 * names, case-insensitive and word-bounded, and exits 1 on any hit.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only, plus the shared
 * token list in scripts/owner-tokens.ts.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_TOKENS } from './owner-tokens.ts';
import { CLIENT_PATTERNS } from './client-blocklist.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

// The token list lives in scripts/owner-tokens.ts (shared with check:person).
export { DEFAULT_TOKENS };

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string): boolean => process.argv.includes(name);

const dir = resolve(root, arg('--dir') ?? 'dist');
const ignoreCase = flag('--ignore-case');
const strict = flag('--strict');
const withSrc = flag('--src');

let tokens: string[] = [...DEFAULT_TOKENS];
if (arg('--tokens')) tokens = arg('--tokens')!.split(',').map((t) => t.trim()).filter(Boolean);
/** npm runs scripts from the package root; resolve user paths against where npm was called. */
const userCwd = process.env.INIT_CWD ?? process.cwd();
if (arg('--tokens-file')) {
  tokens = readFileSync(resolve(userCwd, arg('--tokens-file')!), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean);
}
if (tokens.length === 0) {
  console.error('check:leaks: empty token list');
  process.exit(2);
}
if (!existsSync(dir) || !statSync(dir).isDirectory()) {
  console.error(`check:leaks: build folder not found: ${dir} (run a build first, or pass --dir)`);
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

type Kind =
  | 'text' | 'attribute' | 'json-ld' | 'script' | 'css' | 'dead-selector'
  | 'xml' | 'txt' | 'json' | 'svg' | 'asset-name' | 'portrait-name' | 'src-code' | 'src-comment';

/** Labels printed for a class (default: the class name itself). */
const KIND_LABEL: Partial<Record<Kind, string>> = {
  'portrait-name': 'asset file name (portrait keeps the source name)',
};

/**
 * The portrait's source file is src/person/assets/faraz.jpg on purpose (profile.ts imports it by
 * that name until a rename step exists), and Astro names the built images after it:
 * _astro/faraz.<hash>.webp. Any build file whose name contains "faraz" in any case is reported in
 * its own class, which does not fail --strict by itself.
 */
const PORTRAIT_NAME = /faraz/i;
const PORTRAIT_TOKEN = 'faraz (file name, any case)';
interface Hit { token: string; kind: Kind; file: string; snippet: string }
const hits: Hit[] = [];

const norm = (s: string): string => (ignoreCase ? s.toLowerCase() : s);
/** A purely numeric token ("257") only counts when it is not part of a longer number (257.5, 1257). */
function* positions(text: string, token: string): Generator<number> {
  const t = norm(text);
  const k = norm(token);
  const numeric = /^\d+$/.test(k);
  for (let i = t.indexOf(k); i >= 0; i = t.indexOf(k, i + k.length)) {
    if (numeric && (/[\d.]/.test(t.charAt(i - 1)) || /[\d.]/.test(t.charAt(i + k.length)))) continue;
    yield i;
  }
}
const snippet = (text: string, i: number, len: number): string =>
  text.slice(Math.max(0, i - 50), i + len + 50).replace(/\s+/g, ' ').trim();

/** Ranges [start, end, kind] of <style>, <script> blocks in an HTML document. */
function htmlRegions(html: string): [number, number, Kind][] {
  const out: [number, number, Kind][] = [];
  for (const m of html.matchAll(/<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const start = m.index!;
    const kind: Kind = m[1].toLowerCase() === 'style' ? 'css' : /application\/ld\+json/i.test(m[2]) ? 'json-ld' : 'script';
    out.push([start, start + m[0].length, kind]);
  }
  return out;
}

/** True when position i in CSS text sits in a view-transition rule about a case-<slug> name. */
function isDeadSelector(css: string, i: number): boolean {
  const before = css.slice(Math.max(0, i - 300), i);
  // The token must be part of a case-<slug> identifier ...
  if (!/case-[\w-]*$/.test(before)) return false;
  // ... inside a view-transition pseudo-element selector or a view-transition-name declaration.
  return /::view-transition-[\w-]+\(\s*case-[\w-]*$/.test(before) || /view-transition-name\s*:\s*case-[\w-]*$/.test(before);
}

function classifyHtml(html: string, i: number, regions: [number, number, Kind][]): Kind {
  for (const [s, e, k] of regions) {
    if (i >= s && i < e) return k === 'css' && isDeadSelector(html, i) ? 'dead-selector' : k;
  }
  const lt = html.lastIndexOf('<', i);
  const gt = html.lastIndexOf('>', i);
  return lt > gt ? 'attribute' : 'text';
}

const TEXT_EXT = new Set(['.html', '.xml', '.json', '.txt', '.css', '.js', '.mjs', '.svg', '.webmanifest']);
const files = walk(dir);
for (const f of files) {
  const r = relative(dir, f).split(sep).join('/');
  const name = basename(f);
  // The portrait's own outputs (faraz.<hash>.<ext>): every token hit on the name is the portrait class.
  const portraitOutput = /^faraz\.[^.]+\.\w+$/i.test(name);
  let named = false;
  for (const token of tokens) {
    if ([...positions(name, token)].length) {
      hits.push({ token: portraitOutput ? PORTRAIT_TOKEN : token, kind: portraitOutput ? 'portrait-name' : 'asset-name', file: r, snippet: name });
      named = true;
    }
  }
  if (!named && PORTRAIT_NAME.test(name)) hits.push({ token: PORTRAIT_TOKEN, kind: 'portrait-name', file: r, snippet: name });
  const ext = extname(f).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  const text = readFileSync(f, 'utf8');
  const regions = ext === '.html' ? htmlRegions(text) : [];
  for (const token of tokens) {
    for (const i of positions(text, token)) {
      let kind: Kind;
      if (ext === '.html') kind = classifyHtml(text, i, regions);
      else if (ext === '.css') kind = isDeadSelector(text, i) ? 'dead-selector' : 'css';
      else if (ext === '.js' || ext === '.mjs') kind = 'script';
      else if (ext === '.xml') kind = 'xml';
      else if (ext === '.svg') kind = 'svg';
      else if (ext === '.txt') kind = 'txt';
      else kind = 'json';
      hits.push({ token, kind, file: r, snippet: snippet(text, i, token.length) });
    }
  }
}

if (withSrc) {
  const src = join(root, 'src');
  const SRC_EXT = /\.(ts|mts|js|mjs|astro|css|json|svg|txt|html)$/i;
  for (const f of walk(src)) {
    const r = relative(root, f).split(sep).join('/');
    if (r.startsWith('src/person/') || r.startsWith('src/assets/') || !SRC_EXT.test(f)) continue;
    readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, n) => {
      for (const token of tokens) {
        if ([...positions(line, token)].length === 0) continue;
        const t = line.trim();
        const comment = /^(\/\/|\*|\/\*|<!--)/.test(t);
        hits.push({ token, kind: comment ? 'src-comment' : 'src-code', file: `${r}:${n + 1}`, snippet: t.slice(0, 160) });
      }
    });
  }
}

console.log(`check:leaks › ${dir}${withSrc ? ' + src/' : ''}: ${files.length} files, ${tokens.length} tokens${ignoreCase ? ' (ignore case)' : ''}`);
if (hits.length === 0) {
  console.log('  PASS  no token found');
} else {
  for (const token of [...tokens, PORTRAIT_TOKEN]) {
    const mine = hits.filter((h) => h.token === token);
    if (!mine.length) continue;
    console.log(`\n"${token}": ${mine.length} hit(s)`);
    const kinds = [...new Set(mine.map((h) => h.kind))];
    for (const kind of kinds) {
      const byFile = new Map<string, Hit[]>();
      for (const h of mine.filter((x) => x.kind === kind)) byFile.set(h.file, [...(byFile.get(h.file) ?? []), h]);
      console.log(`  [${KIND_LABEL[kind] ?? kind}] ${byFile.size} file(s)`);
      for (const [file, list] of [...byFile].sort(([a], [b]) => a.localeCompare(b)).slice(0, 25)) {
        console.log(`      ${file}${list.length > 1 ? ` ×${list.length}` : ''}  …${list[0].snippet}…`);
      }
      if (byFile.size > 25) console.log(`      … and ${byFile.size - 25} more file(s)`);
    }
  }
}
const blocking = hits.filter((h) => h.kind !== 'dead-selector' && h.kind !== 'portrait-name');
const dead = hits.filter((h) => h.kind === 'dead-selector').length;
const portrait = hits.filter((h) => h.kind === 'portrait-name').length;
console.log(
  `\nSummary: ${hits.length} hit(s): ${blocking.length} that render or ship, ${dead} in dead view-transition selectors, ` +
    `${portrait} portrait file name(s) (the portrait keeps its source name faraz.jpg; not a failure by itself).`,
);

// ---- Client blocklist (scripts/client-blocklist.ts): always on, always fatal. ----
// Scans the build (text files and every file name) and ALL of src/ (src/person/ and src/assets/
// included: a client name must not sit in the registry or in an image file name either).
const clientHits: { token: string; where: string; snippet: string }[] = [];
const scanClient = (text: string, where: string): void => {
  for (const { token, re } of CLIENT_PATTERNS) {
    for (const m of text.matchAll(re)) clientHits.push({ token, where, snippet: snippet(text, m.index ?? 0, m[0].length) });
  }
};
const srcRoot = join(root, 'src');
const CLIENT_TEXT = /\.(ts|mts|js|mjs|astro|css|json|svg|txt|html|md|xml|webmanifest)$/i;
for (const f of files) {
  const r = relative(dir, f).split(sep).join('/');
  scanClient(basename(f), `build file name ${r}`);
  if (TEXT_EXT.has(extname(f).toLowerCase())) scanClient(readFileSync(f, 'utf8'), `build ${r}`);
}
for (const f of walk(srcRoot)) {
  const r = relative(root, f).split(sep).join('/');
  if (r.includes('/.backup/')) continue;
  scanClient(basename(f), `src file name ${r}`);
  if (CLIENT_TEXT.test(f)) {
    readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, n) => scanClient(line, `${r}:${n + 1}`));
  }
}
if (clientHits.length === 0) {
  console.log(`client blocklist: PASS (${CLIENT_PATTERNS.length} names, build + all of src/)`);
} else {
  console.log(`\nclient blocklist: FAIL, ${clientHits.length} hit(s) of a client name (scripts/client-blocklist.ts)`);
  for (const h of clientHits.slice(0, 60)) console.log(`  "${h.token}"  ${h.where}  …${h.snippet}…`);
  process.exit(1);
}

if (strict && blocking.length > 0) {
  console.log('--strict: failing because tokens were found outside dead CSS selectors and portrait file names.');
  process.exit(1);
}
