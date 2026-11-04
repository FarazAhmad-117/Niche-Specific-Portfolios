/**
 * Makes the site yours: writes src/person/config.ts from your answers.
 *
 *   npm run init:person                                   ask the questions, write src/person/config.ts
 *   npm run init:person -- --from answers.json            no questions: read the answers from a JSON file
 *   npm run init:person -- --out my-config.ts             write there instead (dry run / testing)
 *   npm run init:person -- --print                        print the generated file, write nothing
 *   npm run init:person -- --force                        replace an existing src/person/config.ts
 *                                                         (a backup goes to src/person/.backup/ first)
 *   npm run init:person -- --reset-projects               also write an empty src/person/projects.ts
 *                                                         (Example mode; needs --force when it exists)
 *   npm run init:person -- --reset-projects --projects-out <path>   ... written there instead
 *
 * Without --force it never overwrites: an existing target file stops the run with exit code 1.
 * The file is generated from scripts/templates/person-config.ts.tpl. Every value is validated
 * with the same rules `npm run check:person` and `astro build` use (src/person/schema.ts), and
 * the generated file is loaded back and validated again before anything is written.
 *
 * answers.json uses the PERSON_CONFIG field names (see README › Config reference), e.g.
 *   { "name": "Ada Lovelace", "email": "ada@example.dev", "sinceYear": 2019, "pronouns": "she",
 *     "stack": ["Python", "Node.js"], ... }
 * "pronouns" is "he" | "she" | "they" | "subject/object/possessive" | an object | omitted
 * (omitted = they/them/their); "stack" is an array or a comma-separated string.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import { deepStrictEqual } from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { personConfigProblems } from '../src/person/schema.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const CONFIG_FILE = join(root, 'src', 'person', 'config.ts');
const PROJECTS_FILE = join(root, 'src', 'person', 'projects.ts');
const CONFIG_TPL = join(root, 'scripts', 'templates', 'person-config.ts.tpl');
const PROJECTS_TPL = join(root, 'scripts', 'templates', 'person-projects.ts.tpl');
/** npm runs scripts from the package root; resolve user paths against where npm was called. */
const userCwd = process.env.INIT_CWD ?? process.cwd();

const fail = (msg: string, code = 1): never => {
  console.error(`init:person: ${msg}`);
  process.exit(code);
};
const rel = (p: string): string => relative(root, p).split('\\').join('/') || p;

// ---------------------------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------------------------
interface Options {
  from?: string;
  out?: string;
  projectsOut?: string;
  print: boolean;
  force: boolean;
  resetProjects: boolean;
}

function parseArgs(argv: readonly string[]): Options {
  const opts: Options = { print: false, force: false, resetProjects: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = (): string => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) fail(`${a} needs a value`, 2);
      return v;
    };
    if (a === '--from') opts.from = value();
    else if (a === '--out') opts.out = value();
    else if (a === '--projects-out') opts.projectsOut = value();
    else if (a === '--print') opts.print = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--reset-projects') opts.resetProjects = true;
    else if (a === '--help' || a === '-h') {
      const header = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0];
      console.log(header.replace(/^\/\*\*\n?/, '').replace(/^ \* ?/gm, ''));
      process.exit(0);
    } else fail(`unknown argument "${a}" (see --help)`, 2);
  }
  if (opts.projectsOut && !opts.resetProjects) fail('--projects-out only makes sense with --reset-projects', 2);
  return opts;
}

// ---------------------------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------------------------
type Answers = Record<string, unknown>;

interface Question {
  readonly key: string;
  readonly ask: string;
  /** Shown under the question. */
  readonly hint?: string;
  /** Default from earlier answers; undefined = no default. */
  readonly def?: (a: Answers) => string | undefined;
  /** Blank answer = leave the field out. */
  readonly optional?: boolean;
  readonly parse?: (raw: string) => unknown;
}

const trimmed = (s: string): string => s.trim();
const csv = (s: string): string[] =>
  s
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '');

const PRONOUN_SETS: Readonly<Record<string, { subject: string; object: string; possessive: string }>> = {
  he: { subject: 'he', object: 'him', possessive: 'his' },
  she: { subject: 'she', object: 'her', possessive: 'her' },
  they: { subject: 'they', object: 'them', possessive: 'their' },
};

/** "he" | "she" | "they" | "xe/xem/xyr" | object | blank → a pronouns object, undefined (left out) or the raw value (invalid). */
function parsePronouns(v: unknown): unknown {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') return v; // object form: the schema checks it
  const s = v.trim().toLowerCase();
  if (s === '' || s === 'skip' || s === '-') return undefined;
  if (PRONOUN_SETS[s]) return PRONOUN_SETS[s];
  const parts = s.split('/').map((p) => p.trim());
  if (parts.length === 3) return { subject: parts[0], object: parts[1], possessive: parts[2] };
  return { subject: v, object: v, possessive: v }; // fails validation with a clear message
}

const QUESTIONS: readonly Question[] = [
  { key: 'name', ask: 'Full name', hint: 'As it should appear in titles, bylines and footers.', parse: trimmed },
  {
    key: 'firstName',
    ask: 'First name (how the copy introduces you: "I’m …")',
    def: (a) => (typeof a.name === 'string' ? a.name.trim().split(/\s+/)[0] : undefined),
    parse: trimmed,
  },
  { key: 'email', ask: 'Public contact email', parse: trimmed },
  { key: 'bookingUrl', ask: 'Booking link (https), e.g. a Calendly URL', parse: trimmed },
  {
    key: 'rootDomain',
    ask: 'Root domain (no https://), e.g. example.dev',
    hint: 'Every niche is served from https://<slug>.<rootDomain>.',
    parse: (s) => s.trim().toLowerCase(),
  },
  {
    key: 'mainSiteUrl',
    ask: 'Your main site (https, no trailing slash)',
    def: (a) => (typeof a.rootDomain === 'string' && a.rootDomain ? `https://${a.rootDomain}` : undefined),
    parse: trimmed,
  },
  { key: 'company', ask: 'Company or studio name', parse: trimmed },
  { key: 'companyRole', ask: 'Your role there, e.g. Founder', parse: trimmed },
  { key: 'jobTitle', ask: 'Default job title, e.g. Full-Stack Engineer', parse: trimmed },
  {
    key: 'roleLine',
    ask: 'Short title line (ai niche), e.g. "Automation expert · Full-stack engineer"',
    def: (a) => (typeof a.jobTitle === 'string' ? a.jobTitle : undefined),
    parse: trimmed,
  },
  {
    key: 'sinceYear',
    ask: 'Year you started doing this work',
    parse: (s) => (/^\d{4}$/.test(s.trim()) ? Number(s.trim()) : s.trim()),
  },
  {
    key: 'experience',
    ask: 'Experience in your own words (apps niche About)',
    def: (a) => (typeof a.sinceYear === 'number' ? `Since ${a.sinceYear}` : undefined),
    parse: trimmed,
  },
  { key: 'city', ask: 'City', parse: trimmed },
  {
    key: 'country',
    ask: 'Country',
    hint: 'Optional (nothing renders it yet): blank leaves it out, and you type the location line yourself.',
    optional: true,
    parse: trimmed,
  },
  { key: 'countryCode', ask: 'Two-letter country code (ISO 3166-1), e.g. DE', parse: (s) => s.trim().toUpperCase() },
  {
    key: 'location',
    ask: 'Location line',
    def: (a) => (typeof a.city === 'string' && typeof a.country === 'string' ? `${a.city}, ${a.country}` : undefined),
    parse: trimmed,
  },
  { key: 'timeZone', ask: 'Time zone label as shown on the sites, e.g. "CET (UTC+1)"', parse: trimmed },
  { key: 'github', ask: 'GitHub profile URL (https)', parse: trimmed },
  { key: 'linkedin', ask: 'LinkedIn profile URL (https)', hint: 'Optional: blank leaves it out (nothing renders it yet).', optional: true, parse: trimmed },
  {
    key: 'pronouns',
    ask: 'Pronouns for third-person copy: he, she, they, or subject/object/possessive',
    hint: 'Optional: blank leaves the field out, and the copy uses they/them/their.',
    optional: true,
    parse: parsePronouns,
  },
  {
    key: 'stack',
    ask: 'Tools you really use, comma-separated (exact names, e.g. "n8n, Python, Next.js")',
    hint: 'Optional: blank = no tool claims (tool lists become TODO chips). See src/data/<niche>/site.ts for the names each niche lists.',
    optional: true,
    parse: csv,
  },
  {
    key: 'contactEndpoint',
    ask: 'Contact form endpoint (https URL that accepts the form POST)',
    hint: 'PUBLIC_CONTACT_ENDPOINT in .env overrides it at build time.',
    parse: trimmed,
  },
  {
    key: 'contactFallbackEmail',
    ask: 'Email for the form’s mailto fallback',
    def: (a) => (typeof a.email === 'string' ? a.email : undefined),
    parse: trimmed,
  },
  {
    key: 'portraitAlt',
    ask: 'Alt text for your portrait (describe the actual photo)',
    def: (a) => (typeof a.name === 'string' ? `${a.name}, portrait` : undefined),
    parse: trimmed,
  },
];

const KNOWN_KEYS = new Set(QUESTIONS.map((q) => q.key));

/** Niche slugs, read from src/niches.ts as text (importing it would load the current config.ts). */
function nicheSlugs(): string[] | undefined {
  try {
    const text = readFileSync(join(root, 'src', 'niches.ts'), 'utf8');
    const slugs = [...text.matchAll(/\{\s*slug:\s*'([a-z][a-z0-9-]*)'/g)].map((m) => m[1]);
    return slugs.length ? slugs : undefined;
  } catch {
    return undefined;
  }
}

/** The config object in template order, defaults applied, optional blanks removed. */
function buildConfig(a: Answers): Answers {
  const out: Answers = {};
  const filled: Answers = { ...a };
  for (const q of QUESTIONS) {
    let v = filled[q.key];
    if ((v === undefined || v === '') && q.def) v = q.def(filled);
    if (q.key === 'stack') v = v === undefined ? [] : v;
    if (v === undefined || (q.optional && v === '')) continue;
    filled[q.key] = v;
    out[q.key] = v;
  }
  out.jobTitleByNiche = {};
  return out;
}

/** The schema's problems that concern `key`. */
function problemsFor(key: string, a: Answers): string[] {
  return personConfigProblems(buildConfig(a)).filter((p) => p.startsWith(`"${key}"`) || p.startsWith(`"${key}.`));
}

async function interactive(): Promise<Answers> {
  const rl = createInterface({ input: process.stdin });
  const lines = rl[Symbol.asyncIterator]();
  const read = async (): Promise<string | undefined> => {
    const r = await lines.next();
    return r.done ? undefined : String(r.value);
  };

  console.log('init:person › answer each question; [brackets] show the default, Enter accepts it.\n');
  const a: Answers = {};
  for (const q of QUESTIONS) {
    for (;;) {
      const def = q.def?.(buildConfig(a));
      if (q.hint) console.log(`  ${q.hint}`);
      process.stdout.write(`${q.ask}${def !== undefined ? ` [${def}]` : q.optional ? ' [leave out]' : ''}: `);
      const raw = await read();
      if (raw === undefined) {
        process.stdout.write('\n');
        if (def === undefined && !q.optional) {
          rl.close();
          fail(`input ended before "${q.key}" was answered`);
        }
      }
      const text = (raw ?? '').trim();
      if (text === '') {
        if (def !== undefined) a[q.key] = q.parse ? q.parse(def) : def;
        else if (!q.optional) {
          console.log(`  "${q.key}" is required.`);
          continue;
        } else delete a[q.key];
      } else {
        a[q.key] = q.parse ? q.parse(text) : text;
        if (a[q.key] === undefined) delete a[q.key];
      }
      const problems = problemsFor(q.key, a);
      if (problems.length === 0) break;
      for (const p of problems) console.log(`  ! ${p}`);
      if (raw === undefined) {
        rl.close();
        fail('input ended with an invalid answer');
      }
    }
  }
  rl.close();
  return a;
}

function fromFile(file: string): Answers {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    return fail(`could not read ${file}: ${(err as Error).message}`);
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) fail(`${file} must contain one JSON object`);
  const a: Answers = {};
  const unknown: string[] = [];
  for (const [key, raw] of Object.entries(data as Record<string, unknown>)) {
    if (key.startsWith('$')) continue; // "$comment" and the like
    if (!KNOWN_KEYS.has(key)) {
      unknown.push(key);
      continue;
    }
    const q = QUESTIONS.find((x) => x.key === key)!;
    let v: unknown = raw;
    if (key === 'pronouns') v = parsePronouns(raw);
    else if (key === 'stack') v = typeof raw === 'string' ? csv(raw) : raw;
    else if (key === 'sinceYear' && typeof raw === 'string') v = q.parse!(raw);
    else if (typeof raw === 'string' && q.parse) v = q.parse(raw);
    if (v !== undefined && !(q.optional && v === '')) a[key] = v;
  }
  if (unknown.length) {
    fail(
      `${file}: unknown field(s) ${unknown.map((k) => `"${k}"`).join(', ')}. ` +
        `Known: ${[...KNOWN_KEYS].join(', ')}. Claim fields (profession, credentials, originStories, …) ` +
        'are edited in the generated file by hand.',
    );
  }
  return a;
}

// ---------------------------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------------------------
const today = (): string => new Date().toISOString().slice(0, 10);
const js = (v: unknown): string => JSON.stringify(v);

function renderConfig(cfg: Answers): string {
  const pronouns = cfg.pronouns as { subject: string; object: string; possessive: string } | undefined;
  const stack = cfg.stack as string[];
  const tokens: Record<string, string> = {
    generatedOn: today(),
    pronounsLine: pronouns
      ? `  pronouns: { subject: ${js(pronouns.subject)}, object: ${js(pronouns.object)}, possessive: ${js(pronouns.possessive)} },`
      : "  // pronouns: { subject: 'she', object: 'her', possessive: 'her' },  (left out: the copy uses they/them/their)",
    linkedinLine:
      cfg.linkedin !== undefined
        ? `  /** LinkedIn profile URL. Optional; nothing renders it yet. */\n  linkedin: ${js(cfg.linkedin)},`
        : "  // linkedin: 'https://www.linkedin.com/in/…',  (optional; nothing renders it yet)",
    stack: stack.length ? `[\n${stack.map((t) => `    ${js(t)},`).join('\n')}\n  ]` : '[]',
    countryLine:
      cfg.country !== undefined
        ? `  /** Feeds PROFILE.country (ai). */\n  country: ${js(cfg.country)},`
        : "  // country: '…',  (optional; nothing renders it yet; location is set directly)",
  };
  for (const key of KNOWN_KEYS) {
    if (!(key in tokens) && cfg[key] !== undefined) tokens[key] = js(cfg[key]);
  }
  let text = readFileSync(CONFIG_TPL, 'utf8');
  text = text.replace(/\{\{(\w+)\}\}/g, (whole, key: string) => {
    if (!(key in tokens)) fail(`template token ${whole} has no value (scripts/templates/person-config.ts.tpl)`);
    return tokens[key];
  });
  return text;
}

const renderProjects = (): string => readFileSync(PROJECTS_TPL, 'utf8').replaceAll('{{generatedOn}}', today());

/** Loads the generated source with Node and checks it round-trips and validates. */
async function verifyGenerated(source: string, expected: Answers, slugs: string[] | undefined): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), 'init-person-'));
  let error: string | undefined;
  try {
    const file = join(dir, 'config.ts');
    writeFileSync(file, source);
    const mod = (await import(pathToFileURL(file).href)) as { PERSON_CONFIG?: unknown };
    const problems = personConfigProblems(mod.PERSON_CONFIG, slugs);
    if (problems.length) error = `the generated file does not validate:\n  - ${problems.join('\n  - ')}`;
    else deepStrictEqual(mod.PERSON_CONFIG, expected);
  } catch (err) {
    error = `could not verify the generated file: ${(err as Error).message}`;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  if (error) fail(error);
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------
const opts = parseArgs(process.argv.slice(2));
const answers = opts.from ? fromFile(resolve(userCwd, opts.from)) : await interactive();
const cfg = buildConfig(answers);
const slugs = nicheSlugs();

let problems = personConfigProblems(cfg, slugs);
if (cfg.location === undefined && cfg.country === undefined) {
  // location defaults to "<city>, <country>": without a country there is nothing to derive it from.
  problems = [
    '"location" has no value: it defaults to "<city>, <country>", so give "country" too, or set "location" yourself (e.g. "Berlin, Germany")',
    ...problems.filter((p) => !p.startsWith('"location"')),
  ];
}
if (problems.length) {
  fail(`${problems.length} problem(s) in the answers:\n  - ${problems.join('\n  - ')}\nNothing was written.`);
}

const configSource = renderConfig(cfg);
await verifyGenerated(configSource, cfg, slugs);
const projectsSource = opts.resetProjects ? renderProjects() : undefined;

if (opts.print) {
  process.stdout.write(configSource);
  if (projectsSource) process.stdout.write(`\n// ---- projects.ts ----\n${projectsSource}`);
  process.exit(0);
}

const configTarget = opts.out ? resolve(userCwd, opts.out) : CONFIG_FILE;
let projectsTarget: string | undefined;
if (opts.resetProjects) {
  if (opts.projectsOut) projectsTarget = resolve(userCwd, opts.projectsOut);
  else if (opts.out) fail('with --out, --reset-projects also needs --projects-out <path> (a dry run never writes src/)', 2);
  else projectsTarget = PROJECTS_FILE;
}

// Refuse before touching anything.
const targets = [configTarget, ...(projectsTarget ? [projectsTarget] : [])];
const existing = targets.filter((t) => existsSync(t));
if (existing.length && !opts.force) {
  fail(
    `refusing to overwrite ${existing.map(rel).join(' and ')}.\n` +
      '  Re-run with --force to replace it (the current file is backed up to a .backup/ folder next to it first),\n' +
      '  or use --out <path> / --print to write the result somewhere else.',
  );
}

// Back up, then write.
const stamp = new Date().toISOString().replace(/\.\d+Z$/, '').replace(/:/g, '-');
for (const t of existing) {
  const backupDir = join(dirname(t), '.backup');
  mkdirSync(backupDir, { recursive: true });
  const ext = extname(t);
  const backup = join(backupDir, `${basename(t, ext)}.${stamp}${ext}`);
  copyFileSync(t, backup);
  console.log(`init:person: backed up ${rel(t)} -> ${rel(backup)}`);
}
mkdirSync(dirname(configTarget), { recursive: true });
writeFileSync(configTarget, configSource);
console.log(`init:person: wrote ${rel(configTarget)} (${cfg.name as string}, ${cfg.rootDomain as string})`);
if (projectsTarget && projectsSource) {
  mkdirSync(dirname(projectsTarget), { recursive: true });
  writeFileSync(projectsTarget, projectsSource);
  console.log(`init:person: wrote ${rel(projectsTarget)} (empty registry: Example mode)`);
}

console.log(`
Next steps (README › Make it yours):
  1. Replace the portrait src/person/assets/faraz.jpg with your photo (keep the file name).
  2. Add your projects to src/person/projects.ts (list the niches each appears on in \`niches\`:
     no code needed), or reset it with --reset-projects (Example mode).
  3. Replace or delete the previous owner's screenshots in src/person/assets/projects/ (shared,
     one file per project id) and src/assets/<niche>/ (older per-niche copies).
  4. Fill the optional claim fields in the generated config (profession, credentials, originStories, …).
  5. npm run check:person      validate the identity, list what is still the previous owner's
  6. npm run review:copy       first-person claims still written literally in the niche copy
  7. DNS + Vercel: add <slug>.${cfg.rootDomain as string} per niche (README › DNS and domain)
  8. npm run build             regenerates vercel.json for ${cfg.rootDomain as string}
  9. npm run check:links && npm run check:leaks`);
