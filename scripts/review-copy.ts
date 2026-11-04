/**
 * Lists the owner's first-person claims that are still written literally in the niche copy:
 *
 *   npm run review:copy             report, exit 0
 *   npm run review:copy -- --strict exit 1 while any registered phrase is still present (CI)
 *
 * The phrases live in scripts/owner-claims.json (niche, phrase, kind, reason, fix). Each one is
 * searched as an exact substring in every text file under src/. Per niche it prints:
 *   STILL PRESENT  the phrase is in src/: a new owner must check it, then rewrite or delete it
 *   STALE          the phrase is nowhere in src/: the copy changed, so update or remove the entry
 * Claims already moved to src/person/config.ts are not in the registry (see check:person), and
 * src/person/ itself (config, projects, .backup/) is not scanned. A phrase found only in comments
 * is flagged "[only in comments]" (it renders nowhere; reword the comment).
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export interface OwnerClaim {
  readonly niche: string;
  readonly phrase: string;
  readonly kind: 'claim' | 'tools' | 'stance' | 'positioning' | 'metric' | 'project-wording';
  readonly reason: string;
  readonly fix: string;
}

export interface ClaimHit {
  readonly claim: OwnerClaim;
  /** Repo-relative files (forward slashes) that contain the phrase; empty = stale entry. */
  readonly files: readonly string[];
  /** True when every line that contains the phrase is a comment (it renders nowhere). */
  readonly commentOnly: boolean;
}

/** A line that is only a comment (// …, * …, /* …, <!-- …, {/* … in .astro markup). */
const isCommentLine = (line: string): boolean => /^(\/\/|\*|\/\*|<!--|\{\/\*)/.test(line.trim());

const root = fileURLToPath(new URL('../', import.meta.url));
const REGISTRY = join(root, 'scripts', 'owner-claims.json');
const TEXT = /\.(ts|mts|js|mjs|astro|css|md|json|svg|txt|html)$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT.test(entry.name)) out.push(full);
  }
  return out;
}

/** Reads scripts/owner-claims.json; throws with the file name on a malformed entry. */
export function loadClaims(): OwnerClaim[] {
  const data = JSON.parse(readFileSync(REGISTRY, 'utf8')) as { claims?: unknown };
  if (!Array.isArray(data.claims)) throw new Error(`${REGISTRY}: "claims" must be an array`);
  return data.claims.map((c: Record<string, unknown>, i: number) => {
    for (const k of ['niche', 'phrase', 'kind', 'reason', 'fix']) {
      if (typeof c[k] !== 'string' || (c[k] as string).trim() === '') {
        throw new Error(`${REGISTRY}: claims[${i}].${k} must be a non-empty string`);
      }
    }
    return c as unknown as OwnerClaim;
  });
}

/**
 * Every registered claim with the src/ files that still contain it. src/person/ (config, projects,
 * their .backup/ copies) is skipped: it is the owner's own data, edited there on purpose.
 */
export function scanClaims(claims: readonly OwnerClaim[] = loadClaims()): ClaimHit[] {
  const files = walk(join(root, 'src'))
    .map((f) => ({ rel: relative(root, f).split(sep).join('/'), full: f }))
    .filter((f) => !f.rel.startsWith('src/person/'))
    .map((f) => ({ rel: f.rel, text: readFileSync(f.full, 'utf8') }));
  return claims.map((claim) => {
    const mine = files.filter((f) => f.text.includes(claim.phrase));
    const lines = mine.flatMap((f) => f.text.split(/\r?\n/).filter((l) => l.includes(claim.phrase)));
    return {
      claim,
      files: mine.map((f) => f.rel),
      commentOnly: lines.length > 0 && lines.every(isCommentLine),
    };
  });
}

function main(): void {
  const strict = process.argv.includes('--strict');
  const hits = scanClaims();
  const present = hits.filter((h) => h.files.length > 0);
  const stale = hits.filter((h) => h.files.length === 0);

  console.log(`review:copy › scripts/owner-claims.json (${hits.length} registered phrases)`);
  const niches = [...new Set(hits.map((h) => h.claim.niche))].sort();
  for (const niche of niches) {
    const mine = hits.filter((h) => h.claim.niche === niche);
    const left = mine.filter((h) => h.files.length > 0);
    console.log(`\n[${niche}] ${left.length} of ${mine.length} still present`);
    for (const h of mine) {
      if (h.files.length > 0) {
        console.log(`  STILL PRESENT  (${h.claim.kind}) "${h.claim.phrase}"${h.commentOnly ? '  [only in comments: reword the comment]' : ''}`);
        console.log(`                 in ${h.files.join(', ')}`);
        console.log(`                 why: ${h.claim.reason}`);
        console.log(`                 fix: ${h.claim.fix}`);
      } else {
        console.log(`  STALE          "${h.claim.phrase}" is no longer in src/: update or remove this entry`);
      }
    }
  }

  console.log(`\nSummary: ${present.length} still present, ${stale.length} stale.`);
  if (strict && present.length > 0) {
    console.log('--strict: failing because registered owner claims are still present.');
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
