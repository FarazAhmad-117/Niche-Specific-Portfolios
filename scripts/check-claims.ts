/**
 * Checks the claim helpers:  npm run check:claims
 *
 * - withArticle: "a" / "an" by sound, with the exceptions list (hour, honest, user, unique, one,
 *   European …) and all-caps acronyms read letter by letter ("an SEO engineer", "a CTO").
 * - yearsPlus / yearsSuffix: no "0+ years" in the start year.
 * - roleInSentence ("Lead Engineer" → "lead engineer", "CTO" kept), ROLE_IN_SENTENCE / FOUNDED_VERB
 *   for the current config.
 *
 * Node runs this file directly (native TypeScript type stripping). Built-ins only.
 */
import assert from 'node:assert/strict';
import { FOUNDED_VERB, ROLE_IN_SENTENCE, roleInSentence, withArticle } from '../src/person/claims.ts';
import { PERSON, yearsPlus, yearsSuffix } from '../src/person/person.ts';

const articles: [string, string][] = [
  // unchanged outputs (the phrases the niches pass today)
  ['senior engineer', 'a senior engineer'],
  ['engineer', 'an engineer'],
  ['full-stack engineer', 'a full-stack engineer'],
  ['senior full-stack engineer', 'a senior full-stack engineer'],
  // silent h → "an"
  ['hour-long audit', 'an hour-long audit'],
  ['honest review', 'an honest review'],
  ['honorary title', 'an honorary title'],
  ['heir', 'an heir'],
  // vowel letter, consonant sound → "a"
  ['user researcher', 'a user researcher'],
  ['unique build', 'a unique build'],
  ['one-off fix', 'a one-off fix'],
  ['European agency', 'a European agency'],
  // all-caps acronyms, read letter by letter
  ['SEO engineer', 'an SEO engineer'],
  ['CTO', 'a CTO'],
  ['MBA holder', 'an MBA holder'],
  ['FAQ', 'an FAQ'],
  ['UX designer', 'a UX designer'],
  ['API developer', 'an API developer'],
  ['HTML page', 'an HTML page'],
  ['B2B marketer', 'a B2B marketer'],
];
for (const [phrase, want] of articles) assert.equal(withArticle(phrase), want, phrase);

// Years: nothing in the start year, "n+ years" after.
const start = PERSON.sinceYear;
assert.equal(yearsPlus(new Date(`${start}-06-01T00:00:00Z`)), undefined);
assert.equal(yearsSuffix(new Date(`${start}-06-01T00:00:00Z`)), '');
assert.equal(yearsPlus(new Date(`${start + 1}-06-01T00:00:00Z`)), '1+ years');
assert.equal(yearsSuffix(new Date(`${start + 4}-06-01T00:00:00Z`)), ' (4+ years)');

// Role helpers follow config.ts › companyRole.
const roles: [string, string][] = [
  ['Founder', 'founder'],
  ['Lead Engineer', 'lead engineer'],
  ['Co-Founder', 'co-founder'],
  ['Founder & CEO', 'founder & CEO'],
  ['CTO', 'CTO'],
];
for (const [r, want] of roles) assert.equal(roleInSentence(r), want, r);
const role = PERSON.companyRole;
assert.equal(ROLE_IN_SENTENCE, roleInSentence(role));
assert.equal(FOUNDED_VERB, /\bco-?founder\b/i.test(role) ? 'co-founded' : /\bfounder\b/i.test(role) ? 'founded' : undefined);

console.log(`check:claims PASS (${articles.length} article cases, years, ${roles.length} role cases)`);
