/**
 * Inline font-size for the big footer name signature, so a long name still fits its nowrap line.
 * Pure TS, no imports.
 *
 * Every footer's CSS sizes `.foot__signature` as `calc(100cqi / <divisor>)`, which makes an
 * 11-character name ("Faraz Ahmad", 6.315em in Clash 600 at -0.035em) span the content width.
 * A longer name would overflow, so it shrinks in proportion to its length (+10% margin for wide
 * letters). Names up to 11 characters get `undefined` (no style attribute is emitted), so their
 * output is unchanged. `divisor` is the footer's own CSS divisor (6.29 in most, 6.5 in seo).
 */
export const SIG_REFERENCE_CHARS = 11;

export function signatureStyle(name: string, divisor = 6.29): string | undefined {
  const chars = name.trim().length;
  if (chars <= SIG_REFERENCE_CHARS) return undefined;
  return `font-size:calc(100cqi / ${(divisor * (chars / SIG_REFERENCE_CHARS) * 1.1).toFixed(2)})`;
}
