/**
 * Client names that must never ship: client companies, their people, brands, domains and
 * dealer/file names seen in project screenshots. `npm run check:leaks` scans src/ (all of it,
 * src/person/ included) and the build for every entry and FAILS on any hit, with or without
 * --strict. Matching ignores case and needs a word boundary on both sides ("AHP" does not match
 * inside "WAHPX").
 *
 * This file lives in scripts/ on purpose: it is never imported by src/ and never shipped.
 * Owner-approved exceptions (Furniture Bazar, the roofing estimator link, Leadrift, Sluice's
 * repo) are not client leaks and are not listed here.
 *
 * Node loads this file directly (native TypeScript type stripping). No imports.
 */
export const CLIENT_BLOCKLIST: readonly string[] = [
  'Jay Lima',
  'AHP',
  'Atlantic Healthcare',
  'FCGC',
  'IBrow',
  'SharkSuite',
  'Naselia',
  'Webstaurant',
  'mrbuyer',
  'Mr Buyer',
  'EZRS',
  'EZ Rate Sheet',
  'HopWork',
  'CupUp',
  'Lotyne',
  'Mike Williams',
  'Roofing D&C',
  'D&C Roofing',
  'Distress Is The Best',
  'Sharp Archive',
  'ff360',
  'northshorehonda',
  'nissanhuntington',
  'Zubair',
  'Scaleup Force',
  'ScaleUp Force',
  'Distress Broker',
  'DITB',
];

const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One case-insensitive regex per entry, word-bounded; `&` may also appear as `&amp;` in HTML. */
export const CLIENT_PATTERNS: readonly { readonly token: string; readonly re: RegExp }[] = CLIENT_BLOCKLIST.map((token) => ({
  token,
  re: new RegExp(`(?<![A-Za-z0-9])${escape(token).replace(/&/g, '(?:&|&amp;|&#38;)').replace(/ /g, '\\s+')}(?![A-Za-z0-9])`, 'gi'),
}));
