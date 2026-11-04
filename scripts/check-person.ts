/**
 * Checks the site owner's identity:  npm run check:person
 *
 * 1. Validates src/person/config.ts with the same rules `astro build` applies
 *    (src/person/schema.ts). Exit code 1 on any problem.
 * 2. Scans src/ for literal copies of (a) the current owner's name, emails, domain and links and
 *    (b) the TEMPLATE'S ORIGINAL owner's identifiers (the fixed list in scripts/owner-tokens.ts:
 *    Faraz, farazahmad, Lahore, Indepth, his project display names, …), outside src/person/, so stray
 *    hard-coded copies are found even after `init:person` replaced the config. A token that the
 *    current config itself contains (Faraz's own repo) is skipped. Case and content files
 *    (src/data/<niche>/cases.ts, content.ts) and src/assets/ are not listed line by line: they
 *    hold the owner's own case-study copy, which a new owner rewrites anyway (the original owner's
 *    identifiers in them are only counted). Findings are reported (WARN for the original owner's), not fatal.
 * 3. Prints the first-person claims to review: the claim fields set in config.ts
 *    (stack, profession, credentials, originStories, supportHours, …) and the literal claims from
 *    scripts/owner-claims.json that are still in src/ (details: `npm run review:copy`).
 *    Then WARNS (never fails) for each src/person/projects.ts entry that is not in the ProjectId
 *    union or that no niche refers to (no literal fromProject/getProject/hasProject/
 *    projectOrExample('<id>') or NICHE_PROJECTS entry, and no `niches` entry for a niche whose
 *    cases.ts has a generated-case adapter, `autoCases(`), for `niches` entries that are unknown
 *    slugs or do not render, for `angles` keys missing from `niches`, for `angles.<slug>.modulePicks`
 *    ids the project lacks, and, best effort (a regex, not the
 *    TypeScript), for each fact / module / madeBy a niche angle in src/data/<niche>/cases.ts
 *    reads that the project lacks (fact(), modules() and madeBy() throw at build). It also resolves
 *    modules(p, SOME_CONST) against a same-file const array, and fact(x, '<key>') where x is a
 *    same-file const = getProject('<id>') (e.g. the apps proof strip).
 * 4. TEMPLATE-DEFAULT-ASSETS: WARNS (never fails) for each file in scripts/template-assets.json
 *    (the original owner's portrait, project screenshots) that is still
 *    byte-identical (SHA-256), and for PUBLIC_CONTACT_ENDPOINT / PUBLIC_CONTACT_EMAIL in .env,
 *    .env.production or .env.development that point at a domain other than rootDomain (they
 *    override config.ts). Leak scan of a finished build: `npm run check:leaks`.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PERSON_CONFIG } from '../src/person/config.ts';
import { personConfigProblems, type PersonConfig } from '../src/person/schema.ts';
import { NICHES } from '../src/niches.ts';
import { scanClaims } from './review-copy.ts';
import { ownerTokens } from './owner-tokens.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const src = join(root, 'src');

// 1. Validation.
const problems = personConfigProblems(PERSON_CONFIG, NICHES.map((n) => n.slug));
console.log('check:person › src/person/config.ts');
if (problems.length === 0) {
  console.log(`  PASS  identity is valid (${PERSON_CONFIG.name}, ${PERSON_CONFIG.rootDomain})`);
} else {
  console.log(`  FAIL  ${problems.length} problem(s):`);
  for (const p of problems) console.log(`        - ${p}`);
  console.log('        Fix the value(s) in src/person/config.ts and run this again.');
}

// 2. Stray hard-coded copies.
const cfg: PersonConfig = PERSON_CONFIG;
const needles = [
  ...new Set(
    [
      cfg.name,
      cfg.footerSignature ?? '',
      cfg.email,
      cfg.contactFallbackEmail,
      cfg.rootDomain,
      cfg.bookingUrl,
      cfg.github.replace(/^https:\/\//, ''),
    ].filter((s) => typeof s === 'string' && s.length > 0),
  ),
];

// The template's original owner: a FIXED list (scripts/owner-tokens.ts), not derived from the
// config, so it still finds him after init:person replaced src/person/config.ts. A token that
// the current config (or, for a project display name, src/person/projects.ts) itself contains is
// that person's own value and is skipped: Faraz's own repo does not flag himself.
const configText: string[] = [];
(function collect(v: unknown): void {
  if (typeof v === 'string') configText.push(v);
  else if (Array.isArray(v)) v.forEach(collect);
  else if (v && typeof v === 'object') Object.values(v).forEach(collect);
})(PERSON_CONFIG);
const projectsText = existsSync(join(src, 'person', 'projects.ts')) ? readFileSync(join(src, 'person', 'projects.ts'), 'utf8') : '';
const ownTokens = (list: string[], haystack: string[]): string[] => list.filter((t) => !haystack.some((s) => s.includes(t)));
const rawIdentity = ownTokens(ownerTokens('identity'), configText);
// The config still holds his name and domain: this IS the template owner's repo, nothing to flag.
const isTemplateOwner = !rawIdentity.includes('Faraz') && !rawIdentity.includes('farazahmad');
const identityNeedles = isTemplateOwner ? [] : rawIdentity;
const projectNameNeedles = isTemplateOwner ? [] : ownTokens(ownerTokens('project-name'), [...configText, projectsText]);
const ownerSkippedAll = isTemplateOwner;

const TEXT =/\.(ts|mts|js|mjs|astro|css|md|json|svg|txt|html)$/i;
const skipped = (rel: string): boolean => {
  const p = rel.split(sep).join('/');
  return (
    p.startsWith('person/') ||
    p.startsWith('assets/') ||
    /^data\/[^/]+\/(cases|content)\.ts$/.test(p)
  );
};

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(src, full);
    if (skipped(rel + (entry.isDirectory() ? sep : ''))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT.test(entry.name)) out.push(full);
  }
  return out;
}

/** Every file under `dir`, nothing skipped. */
function walkAll(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkAll(full, out);
    else out.push(full);
  }
  return out;
}

interface Hit {
  file: string;
  line: number;
  needle: string;
  comment: boolean;
}
/** A ::view-transition / view-transition-name rule about a case-<slug> name: renders nothing when that case is absent (the dead-selector exception of check:leaks). */
const deadCaseSelector = (text: string, at: number): boolean => {
  const before = text.slice(0, at);
  return /case-[\w-]*$/.test(before) && /view-transition/.test(before);
};
/** The first match of `needle` that is not a documented exception, else -1. (The portrait file name faraz.jpg never matches: the tokens are case-sensitive and none is a bare "faraz".) */
const find = (text: string, needle: string): number => {
  for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + needle.length)) {
    if (!deadCaseSelector(text, i)) return i;
  }
  return -1;
};
const isComment = (text: string): boolean => {
  const t = text.trim();
  return t.startsWith('*') || t.startsWith('/*') || t.startsWith('//') || t.startsWith('<!--') || t.startsWith('{/*');
};
/**
 * Project ids (yard-terminal, farazahmad-dev, …) are the registry keys the niche angles are written
 * for: they stay in the code on purpose, so they are blanked before the identity tokens are searched.
 */
const ID_TOKENS = [...ownerTokens('project-id').filter((t) => !t.includes(' ')), 'farazahmad-dev'].sort((a, b) => b.length - a.length);
const withoutIds = (text: string): string => ID_TOKENS.reduce((t, id) => t.split(id).join('_'.repeat(id.length)), text);

const hits: Hit[] = [];
const templateOwnerHits: Hit[] = [];
for (const file of walk(src)) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const rel = relative(root, file).split(sep).join('/');
  lines.forEach((text, i) => {
    const comment = isComment(text);
    for (const needle of needles) {
      if (text.includes(needle)) hits.push({ file: rel, line: i + 1, needle, comment });
    }
    const plain = withoutIds(text);
    for (const needle of identityNeedles) {
      if (!needles.includes(needle) && find(plain, needle) >= 0) templateOwnerHits.push({ file: rel, line: i + 1, needle, comment });
    }
    // A project's display name in a comment is history, not a claim; in code it can render.
    if (!comment) {
      for (const needle of projectNameNeedles) {
        if (find(plain, needle) >= 0) templateOwnerHits.push({ file: rel, line: i + 1, needle, comment });
      }
    }
  });
}
// Case and content files are not listed (they are the old owner's case copy); just count his identifiers there.
let copyFileHits = 0;
const copyFiles = walkAll(src).filter((f) => /^data\/[^/]+\/(cases|content)\.ts$/.test(relative(src, f).split(sep).join('/')));
for (const file of copyFiles) {
  for (const text of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const plain = withoutIds(text);
    if (identityNeedles.some((n) => find(plain, n) >= 0)) copyFileHits++;
  }
}

console.log('\ncheck:person › hard-coded owner strings in src/ (outside src/person/, cases.ts, content.ts, assets/)');
if (hits.length === 0) {
  console.log('  PASS  none found');
} else {
  const code = hits.filter((h) => !h.comment);
  const byFile = new Map<string, Hit[]>();
  for (const h of hits) byFile.set(h.file, [...(byFile.get(h.file) ?? []), h]);
  console.log(
    `  NOTE  ${hits.length} occurrence(s) in ${byFile.size} file(s); ${code.length} in code/markup, ` +
      `${hits.length - code.length} in comments. Rewire the code ones to src/person/ when touching that file.`,
  );
  for (const [file, list] of [...byFile].sort(([a], [b]) => a.localeCompare(b))) {
    const summary = list
      .map((h) => `${h.line}${h.comment ? ' (comment)' : ''}: "${h.needle}"`)
      .join(', ');
    console.log(`        ${file}  ${summary}`);
  }
}

// 2b. The template's original owner, searched with a fixed list (scripts/owner-tokens.ts).
console.log("\ncheck:person › the template's original owner (Faraz Ahmad) in src/: fixed list scripts/owner-tokens.ts");
if (ownerSkippedAll) {
  console.log('  PASS  not searched: this config is his own (it contains his name and domain)');
} else if (templateOwnerHits.length === 0 && copyFileHits === 0) {
  console.log(`  PASS  none of his ${identityNeedles.length + projectNameNeedles.length} identifiers found`);
} else {
  const code = templateOwnerHits.filter((h) => !h.comment);
  const byFile = new Map<string, Hit[]>();
  for (const h of templateOwnerHits) byFile.set(h.file, [...(byFile.get(h.file) ?? []), h]);
  if (templateOwnerHits.length > 0) {
    console.log(
      `  WARN  ${templateOwnerHits.length} leftover(s) in ${byFile.size} file(s); ${code.length} in code/markup, ` +
        `${templateOwnerHits.length - code.length} in comments. Code ones may render or ship in a niche; reword them from src/person/ ` +
        `(or drop them) before you launch. Some are gated or documented (e.g. cloud's owner-stack claims show only while your registry backs them: src/lib/cloud/tools.ts).`,
    );
    for (const [file, list] of [...byFile].sort(([a], [b]) => a.localeCompare(b))) {
      console.log(`        ${file}  ${list.map((h) => `${h.line}${h.comment ? ' (comment)' : ''}: "${h.needle}"`).join(', ')}`);
    }
  }
  if (copyFileHits > 0) {
    console.log(
      `  WARN  ${copyFileHits} more line(s) in src/data/<niche>/cases.ts and content.ts (his case copy, not listed here): ` +
        `rewrite or drop those cases (npm run review:copy, npm run check:leaks -- --src --dir <build>).`,
    );
  }
  console.log('        Not scanned here: src/assets/ (images; npm run check:person › template default assets) and src/person/ (yours).');
}

// 3. What is still the current owner's.
const claimFields: [string, unknown][] = [
  ['firstName', cfg.firstName],
  ['shortName', cfg.shortName],
  ['pronouns', cfg.pronouns && `${cfg.pronouns.subject}/${cfg.pronouns.object}/${cfg.pronouns.possessive}`],
  ['stack', cfg.stack.length ? `${cfg.stack.length} tools` : []],
  ['profession', cfg.profession],
  ['seniority', cfg.seniority],
  ['careerLine', cfg.careerLine],
  ['experienceShort', cfg.experienceShort?.value],
  [
    'credentials',
    cfg.credentials && Object.keys(cfg.credentials).length
      ? Object.entries(cfg.credentials)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(', ')
      : undefined,
  ],
  ['originStories', cfg.originStories && Object.keys(cfg.originStories).length ? Object.keys(cfg.originStories).join(', ') : undefined],
  ['contactFeedsCrm', cfg.contactFeedsCrm],
  ['supportHours', cfg.supportHours],
];
console.log('\ncheck:person › first-person claims to review');
console.log('  config.ts claim fields (each renders as a claim on the sites; unset ones drop out or show a TODO):');
for (const [k, v] of claimFields) {
  const shown = v === undefined ? '(unset)' : typeof v === 'string' && v.length > 100 ? `"${v.slice(0, 97)}…"` : JSON.stringify(v);
  console.log(`        ${k.padEnd(16)} ${shown}`);
}
try {
  const remaining = scanClaims().filter((h) => h.files.length > 0);
  const byNiche = new Map<string, number>();
  for (const h of remaining) byNiche.set(h.claim.niche, (byNiche.get(h.claim.niche) ?? 0) + 1);
  console.log(
    `  literal claims still in src/ (scripts/owner-claims.json): ${remaining.length}` +
      (remaining.length
        ? ` (` +
          [...byNiche]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([n, c]) => `${n} ${c}`)
            .join(', ') +
          `). Details: npm run review:copy`
        : ''),
  );
} catch (err) {
  console.log(`  NOTE  could not read scripts/owner-claims.json: ${(err as Error).message}`);
}

// 3b. Projects (src/person/projects.ts) that no niche shows, and keys the niche angles read.
interface ProjectLike {
  readonly id: string;
  readonly facts: Readonly<Record<string, string>>;
  readonly modules?: readonly { readonly id: string }[];
  readonly madeBy?: string;
  readonly niches?: readonly string[];
  readonly angles?: Readonly<Record<string, { readonly modulePicks?: readonly (string | { readonly id: string })[] } | undefined>>;
}
console.log('\ncheck:person › projects (src/person/projects.ts)');
try {
  const projectsFile = join(src, 'person', 'projects.ts');
  const { PROJECTS } = (await import(pathToFileURL(projectsFile).href)) as {
    PROJECTS: Readonly<Record<string, ProjectLike | undefined>>;
  };
  const ids = Object.keys(PROJECTS).filter((k) => PROJECTS[k] !== undefined);
  const union = /export type ProjectId\s*=([^;]*);/.exec(readFileSync(projectsFile, 'utf8'))?.[1] ?? '';
  const unionIds = new Set([...union.matchAll(/'([^']+)'/g)].map((m) => m[1]));

  // Every literal project id the niches refer to (outside src/person).
  const nicheFiles = walkAll(src).filter((f) => !relative(src, f).split(sep).join('/').startsWith('person/') && /\.(ts|astro)$/.test(f));
  const referenced = new Set<string>();
  for (const f of nicheFiles) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/\b(?:fromProject|getProject|hasProject|projectOrExample)\(\s*'([^']+)'/g)) referenced.add(m[1]);
    for (const m of text.matchAll(/NICHE_PROJECTS\s*=\s*\[([^\]]*)\]/g)) for (const q of m[1].matchAll(/'([^']+)'/g)) referenced.add(q[1]);
  }

  // Niches with a generated-case adapter (`autoCases(` in their cases.ts): a project whose
  // `niches` lists one of them renders there with no code (docs/TEMPLATE.md › Add a project with no code).
  const knownSlugs = new Set<string>(NICHES.map((n) => n.slug));
  const casesText = (slug: string): string => {
    const f = join(src, 'data', slug, 'cases.ts');
    return existsSync(f) ? readFileSync(f, 'utf8') : '';
  };
  const adapterNiches = new Set([...knownSlugs].filter((s) => /\bautoCases\(/.test(casesText(s))));

  const warnings: string[] = [];
  for (const id of ids) {
    const p = PROJECTS[id]!;
    const listed = p.niches ?? [];
    if (!unionIds.has(id)) warnings.push(`project '${id}' is not in the ProjectId union (src/person/projects.ts): add it there`);
    for (const s of listed) {
      if (!knownSlugs.has(s)) warnings.push(`project '${id}' lists niche '${s}', which is not in src/niches.ts`);
      else if (!adapterNiches.has(s) && !new RegExp(`\\bfromProject\\(\\s*'${id}'`).test(casesText(s)))
        warnings.push(`project '${id}' lists niche '${s}', but ${s} has no generated-case adapter (autoCases) and no angle for it: it does not render there`);
    }
    for (const s of Object.keys(p.angles ?? {})) {
      if (!listed.includes(s)) warnings.push(`project '${id}' has angles.${s} but '${s}' is not in its niches: the angle is never used`);
    }
    const generatedOn = listed.filter((s) => adapterNiches.has(s));
    if (!referenced.has(id) && generatedOn.length === 0)
      warnings.push(`project '${id}' is registered but no niche shows it: list a niche in its \`niches\` or add an angle (see docs/TEMPLATE.md)`);
  }

  // Best effort: in each src/data/<niche>/cases.ts, the text from `fromProject('<id>'` to the next
  // fromProject / exampleCase / top-level declaration is that id's angle. Collect the keys it reads.
  const reads = new Map<string, { facts: Set<string>; modules: Set<string>; madeBy: Set<string> }>();
  for (const f of nicheFiles.filter((x) => /[\\/]data[\\/][^\\/]+[\\/]cases\.ts$/.test(x))) {
    const text = readFileSync(f, 'utf8');
    const niche = relative(join(src, 'data'), f).split(sep)[0];
    const starts = [...text.matchAll(/\bfromProject\(\s*'([^']+)'/g)];
    starts.forEach((m) => {
      const from = m.index ?? 0;
      const rest = text.slice(from + m[0].length);
      const stop = rest.search(/\bfromProject\(|\bexampleCase\b|\n(?:export )?(?:const|function|let|type|interface) /);
      const block = stop >= 0 ? rest.slice(0, stop) : rest;
      const r = reads.get(m[1]) ?? { facts: new Set<string>(), modules: new Set<string>(), madeBy: new Set<string>() };
      for (const q of block.matchAll(/\bfact\(\s*p\s*,\s*'([^']+)'\s*\)/g)) r.facts.add(`${q[1]} (${niche})`);
      for (const q of block.matchAll(/\bmodules\(\s*p\s*,\s*\[([\s\S]*?)\]\s*\)/g)) {
        // Drop the override wording (title/text values), then every quoted string left is a module id.
        const picks = q[1].replace(/\b(?:title|text):\s*(?:'(?:[^'\\]|\\.)*'|`[^`]*`|"(?:[^"\\]|\\.)*")/g, '');
        for (const pick of picks.matchAll(/'([^']+)'/g)) r.modules.add(`${pick[1]} (${niche})`);
      }
      // modules(p, SOME_CONST): resolve a same-file `const SOME_CONST = [ 'id', ... ]` array literal.
      for (const q of block.matchAll(/\bmodules\(\s*p\s*,\s*([A-Za-z_$][\w$]*)\s*\)/g)) {
        const decl = new RegExp(`\\bconst\\s+${q[1].replace(/\$/g, '\\$')}\\b[^=]*=\\s*\\[([\\s\\S]*?)\\]`).exec(text);
        if (decl) for (const pick of decl[1].matchAll(/'([^']+)'/g)) r.modules.add(`${pick[1]} (${niche})`);
      }
      if (/\bmadeBy\(\s*p\s*\)/.test(block)) r.madeBy.add(niche);
      reads.set(m[1], r);
    });
  }
  // Best effort, outside fromProject blocks: `const x = getProject('<id>')` followed by
  // fact(x, '<key>') in the same file (e.g. fact(ownSite, 'testsCount') in src/data/apps/content.ts)
  // throws at build when that project lacks the key. A variable from findOwnSite() or an imported
  // own-site constant is skipped: the cloud own-stack copy checks its facts itself and drops out.
  for (const f of nicheFiles.filter((x) => /[\\/]data[\\/]/.test(x))) {
    const text = readFileSync(f, 'utf8');
    if (!/\bfact\(/.test(text)) continue;
    const rel = relative(join(src, 'data'), f).split(sep);
    const niche = rel.length > 1 ? rel[0] : rel.join('/');
    for (const d of text.matchAll(/\b(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*getProject\(\s*'([^']+)'\s*\)/g)) {
      if (d[1] === 'p') continue;
      const r = reads.get(d[2]) ?? { facts: new Set<string>(), modules: new Set<string>(), madeBy: new Set<string>() };
      for (const q of text.matchAll(new RegExp(`\\bfact\\(\\s*${d[1].replace(/\$/g, '\\$')}\\s*,\\s*'([^']+)'\\s*\\)`, 'g'))) r.facts.add(`${q[1]} (${niche})`);
      if (r.facts.size) reads.set(d[2], r);
    }
  }
  const missing: string[] = [];
  // angles.<slug>.modulePicks go through modules() at build, which throws on an unknown id.
  for (const id of ids) {
    const p = PROJECTS[id]!;
    for (const [slug, a] of Object.entries(p.angles ?? {})) {
      for (const pick of a?.modulePicks ?? []) {
        const mid = typeof pick === 'string' ? pick : pick.id;
        if (!(p.modules ?? []).some((x) => x.id === mid)) missing.push(`'${id}' has no module "${mid}" (picked in angles.${slug})`);
      }
    }
  }
  for (const id of ids) {
    const p = PROJECTS[id]!;
    const r = reads.get(id);
    if (!r) continue;
    for (const k of r.facts) if (!(k.replace(/ \(.*\)$/, '') in p.facts)) missing.push(`'${id}' has no fact "${k.replace(/ \(/, '" (read in ')}`);
    for (const k of r.modules) {
      const mid = k.replace(/ \(.*\)$/, '');
      if (!(p.modules ?? []).some((x) => x.id === mid)) missing.push(`'${id}' has no module "${k.replace(/ \(/, '" (read in ')}`);
    }
    if (r.madeBy.size && p.madeBy === undefined) missing.push(`'${id}' has no "madeBy" (read in ${[...r.madeBy].join(', ')})`);
  }

  console.log(`  ${ids.length} project(s): ${ids.join(', ') || '(none: Example mode)'}`);
  console.log(`  niches with a generated-case adapter (projects listed in \`niches\` render there with no code): ${[...adapterNiches].join(', ') || '(none)'}`);
  if (warnings.length === 0) console.log('  PASS  every project is in the ProjectId union and shown by at least one niche');
  for (const w of warnings) console.log(`  WARN  ${w}`);
  const count = (pick: (r: { facts: Set<string>; modules: Set<string>; madeBy: Set<string> }) => Set<string>): number =>
    [...reads.values()].reduce((n, r) => n + pick(r).size, 0);
  console.log(
    `  angles read these keys (best effort: a regex over src/data/<niche>/cases.ts and the other src/data files, not the TypeScript): ` +
      `${count((r) => r.facts)} fact, ${count((r) => r.modules)} module and ${count((r) => r.madeBy)} madeBy reads across ${reads.size} id(s)`,
  );
  if (missing.length === 0) console.log('  PASS  every fact / module / madeBy an angle reads exists for the projects present');
  for (const m of missing) console.log(`  WARN  ${m}: the build throws in that angle; add it or drop the case`);
} catch (err) {
  console.log(`  NOTE  could not check src/person/projects.ts: ${(err as Error).message}`);
}

// 4. Template default assets and env overrides that still belong to the template's original owner.
interface TemplateAsset {
  path: string;
  sha256: string;
  what: string;
  fix: string;
}
console.log('\ncheck:person › template default assets (scripts/template-assets.json)');
try {
  const listed = (JSON.parse(readFileSync(join(root, 'scripts', 'template-assets.json'), 'utf8')) as { assets: TemplateAsset[] }).assets;
  const still = listed.filter((a) => {
    const file = join(root, a.path);
    return existsSync(file) && createHash('sha256').update(readFileSync(file)).digest('hex') === a.sha256.toLowerCase();
  });
  if (still.length === 0) {
    console.log(`  PASS  none of the ${listed.length} listed default assets is unchanged`);
  } else {
    console.log(`  WARN  ${still.length} of ${listed.length} file(s) are still the template owner's (byte-identical); replace them, keep the file names:`);
    for (const a of still) console.log(`        ${a.path}  (${a.what}): ${a.fix}`);
  }
} catch (err) {
  console.log(`  NOTE  could not read scripts/template-assets.json: ${(err as Error).message}`);
}

// PUBLIC_CONTACT_* in committed env files override contactEndpoint / contactFallbackEmail.
const ownDomain = (host: string): boolean => host === cfg.rootDomain || host.endsWith(`.${cfg.rootDomain}`);
const envNotes: string[] = [];
for (const name of ['.env', '.env.production', '.env.development']) {
  const file = join(root, name);
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*(PUBLIC_CONTACT_ENDPOINT|PUBLIC_CONTACT_EMAIL)\s*=\s*["']?([^"'#\s]*)/.exec(line);
    if (!m || m[2] === '') continue;
    let host = '';
    if (m[1] === 'PUBLIC_CONTACT_EMAIL') host = m[2].split('@')[1] ?? '';
    else {
      try {
        host = new URL(m[2]).hostname;
      } catch {
        host = m[2];
      }
    }
    if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host) || ownDomain(host)) continue;
    envNotes.push(`${name} › ${m[1]} points at ${host}, not ${cfg.rootDomain}: it overrides config.ts in that build. Change it or remove the line.`);
  }
}
if (envNotes.length) for (const n of envNotes) console.log(`  WARN  ${n}`);
else console.log(`  PASS  PUBLIC_CONTACT_* env values (if any) are on ${cfg.rootDomain}`);

if (problems.length > 0) process.exit(1);
