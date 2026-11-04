/**
 * Deterministic text-fit rules for the OG cards (satori has no text measuring API we can use
 * before layout). Pure TS, no imports.
 *
 * Widths are estimated from a per-character advance, chosen slightly wide so an estimate errs
 * towards "does not fit":
 *  - Clash Display 600 at -0.02em: measured ~0.51em per character on the cards; 0.53 used.
 *  - Monospace (JetBrains Mono / IBM Plex Mono, small tracking): 0.6em + letter-spacing.
 *
 * Rules never truncate a name. For the current owner's 11-character name every card keeps its
 * original layout (the helpers return the inputs unchanged), so his images are byte-identical.
 */
export const CLASH_EM_PER_CHAR = 0.53;
export const MONO_EM_PER_CHAR = 0.6;

/** Estimated rendered width in px of `text` at `fontPx`, with `emPerChar` advance (plus tracking in em). */
export const estimateWidth = (text: string, fontPx: number, emPerChar: number, trackingEm = 0): number =>
  Math.ceil(text.length * fontPx * (emPerChar + trackingEm));

export interface SignatureRowFit {
  /** Font size for the name: the design size, or smaller only when the name alone cannot fit. */
  readonly namePx: number;
  /** False when name + tagline would overrun `budget`: the tagline (decorative) is dropped first. */
  readonly showTagline: boolean;
}

/**
 * Fit an OG footer row "<name> <tagline>" into `budget` px (from the name's left edge to the
 * nearest element on its right). Order: keep both; else drop the tagline; else shrink the name
 * to fit, never below `minNamePx`.
 */
export function fitSignatureRow(opts: {
  readonly name: string;
  readonly namePx: number;
  readonly tagline: string;
  readonly taglinePx: number;
  readonly taglineTrackingEm?: number;
  readonly gap: number;
  readonly budget: number;
  readonly minNamePx?: number;
}): SignatureRowFit {
  const nameW = estimateWidth(opts.name, opts.namePx, CLASH_EM_PER_CHAR);
  const tagW = estimateWidth(opts.tagline, opts.taglinePx, MONO_EM_PER_CHAR, opts.taglineTrackingEm ?? 0);
  if (nameW + opts.gap + tagW <= opts.budget) return { namePx: opts.namePx, showTagline: true };
  if (nameW <= opts.budget) return { namePx: opts.namePx, showTagline: false };
  const fitted = Math.floor(opts.budget / (opts.name.length * CLASH_EM_PER_CHAR));
  return { namePx: Math.max(opts.minNamePx ?? 24, Math.min(opts.namePx, fitted)), showTagline: false };
}
