/**
 * Checks the SEO title helper:  npm run check:seo-title
 *
 * - Faraz's name leaves every existing `<core> | Faraz Ahmad` title unchanged (cores are read
 *   from each src/data/<niche>/seo.ts and src/data/all/sites.ts, so this stays in sync).
 * - A 29-char name falls back (first name, then core alone) without throwing.
 * - A core that cannot fit is returned unchanged, so assertMeta still fails the build.
 * - fitDescription picks the first variant that fits, else returns the last one unchanged.
 * - Lint: no case title/description in src/data/<niche>/cases.ts interpolates a value without
 *   going through fitDescription.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, fitDescription, withNameSuffix } from '../src/lib/shared/seo-title.ts';

const dataDir = fileURLToPath(new URL('../src/data/', import.meta.url));
const files = [
  ...readdirSync(dataDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `${dataDir}${d.name}/seo.ts`),
  `${dataDir}all/sites.ts`,
];

const cores: string[] = [];
for (const f of files) {
  let text: string;
  try {
    text = readFileSync(f, 'utf8');
  } catch {
    continue; // niche without a seo.ts
  }
  const m = text.match(/title: withNameSuffix\('([^']+)', PERSON_NAME\)/);
  if (m) cores.push(m[1]);
}
assert.ok(cores.length >= 11, `expected >= 11 title cores, found ${cores.length}`);

// 1. Faraz: output is exactly the old template string.
for (const core of cores) {
  const out = withNameSuffix(core, 'Faraz Ahmad');
  assert.equal(out, `${core} | Faraz Ahmad`);
  assert.ok(out.length <= 60, `${out} is ${out.length} chars`);
}

// 2. A 29-char name falls back and never throws.
const long = 'Maximiliana Konstantinopoulou';
assert.equal(long.length, 29);
for (const core of cores) {
  const out = withNameSuffix(core, long);
  assert.ok(out.length <= 60, `${out} is ${out.length} chars`);
  assert.ok([`${core} | ${long}`, `${core} | Maximiliana`, core].includes(out), out);
}
assert.equal(withNameSuffix('Ad Automation, Tracking & Reporting', long), 'Ad Automation, Tracking & Reporting | Maximiliana');
assert.equal(withNameSuffix('Webflow Developer: Figma Builds, CMS, Motion', long), 'Webflow Developer: Figma Builds, CMS, Motion | Maximiliana');
assert.equal(withNameSuffix('y'.repeat(50), long), 'y'.repeat(50)); // no suffix fits, core alone does
assert.equal(withNameSuffix('Short core', long), `Short core | ${long}`);
assert.equal(withNameSuffix('Short core', 'Cher'), 'Short core | Cher'); // single word, no short form

// 3. A core over the limit comes back unchanged (assertMeta then fails loudly).
const tooLong = 'x'.repeat(70);
assert.equal(withNameSuffix(tooLong, 'Faraz Ahmad'), tooLong);
assert.equal(withNameSuffix(tooLong, long), tooLong);

// 4. fitDescription: the first variant that fits, else the last one unchanged (never truncated).
assert.equal(fitDescription(10, 'short'), 'short');
assert.equal(fitDescription(10, 'way too long here', 'fits now', 'tiny'), 'fits now');
assert.equal(fitDescription(10, 'x'.repeat(10), 'y'), 'x'.repeat(10)); // exactly max fits
assert.equal(fitDescription(10, 'x'.repeat(11), 'y'.repeat(12)), 'y'.repeat(12)); // none fits: last, unchanged
assert.equal(SEO_TITLE_MAX, 60);
assert.equal(SEO_DESCRIPTION_MAX, 155);
{
  // The funnels Lead Drift description with a 20-char project name and a 24-char company.
  const name = 'N'.repeat(20);
  const company = 'C'.repeat(24);
  const out = fitDescription(
    SEO_DESCRIPTION_MAX,
    `Case study: ${name}, ${company}'s own outbound engine, running in production. Lead collection, outreach workflows and nurture sequences.`,
    `Case study: ${name}, ${company}'s own outbound engine, running in production. Lead collection and outreach.`,
  );
  assert.ok(out.length <= SEO_DESCRIPTION_MAX, `${out.length}`);
}

// 5. Lint: every case title/description in src/data/<niche>/cases.ts that interpolates a value
//    (a project, company or person name) must go through fitDescription, so a long name picks a
//    shorter variant instead of failing assertMeta.
const unguarded: string[] = [];
for (const d of readdirSync(dataDir, { withFileTypes: true }).filter((x) => x.isDirectory())) {
  let text: string;
  try {
    text = readFileSync(`${dataDir}${d.name}/cases.ts`, 'utf8');
  } catch {
    continue;
  }
  const rules: [RegExp, string][] = [
    [/description:\s*`[^`]*\$\{/g, 'description'],
    [/(?:withNameSuffix|caseTitle)\(\s*`[^`]*\$\{/g, 'title'],
  ];
  for (const [rx, what] of rules) {
    for (const m of text.matchAll(rx)) {
      const line = text.slice(0, m.index).split('\n').length;
      unguarded.push(`src/data/${d.name}/cases.ts:${line} (${what})`);
    }
  }
}
assert.deepEqual(unguarded, [], `interpolated meta without fitDescription:\n  ${unguarded.join('\n  ')}`);

console.log(`check:seo-title PASS (${cores.length} titles, fitDescription, no unguarded interpolated case meta)`);
