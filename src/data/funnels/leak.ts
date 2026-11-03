/**
 * Leak calculator model (decisions: include, labelled as an estimate). Its own module because
 * the client script imports it, and it should not pull the page copy into the bundle.
 *
 * Every multiplier is a rough, visible assumption, NOT a research figure (listed in
 * docs/todo/funnels.md for the owner to confirm or replace). The visitor can change the rate.
 */
export const LEAK = {
  defaults: { leads: 120, speed: 'day', follow: 'one', rate: 8 },
  limits: { leadsMin: 1, leadsMax: 100000, sliderMax: 1000, rateMin: 1, rateMax: 50 },
  speed: [
    { id: 'five', label: 'Within 5 minutes', factor: 1 },
    { id: 'hour', label: 'Within an hour', factor: 0.8 },
    { id: 'day', label: 'Same day', factor: 0.6 },
    { id: 'later', label: 'Next day or later', factor: 0.4 },
    { id: 'never', label: 'Sometimes never', factor: 0.25 },
  ],
  follow: [
    { id: 'none', label: 'None', factor: 0.5 },
    { id: 'one', label: 'One', factor: 0.7 },
    { id: 'few', label: 'Two or three', factor: 0.9 },
    { id: 'many', label: 'Four or more', factor: 1 },
  ],
} as const;

/** Shared by the server render (the no-JS default) and the client script. Never returns NaN. */
export function leakEstimate(input: { leads: number; rate: number; speed: number; follow: number }): {
  possible: number;
  booked: number;
  lost: number;
} {
  const safe = (n: number, min: number, max: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
  const leads = safe(input.leads, 0, LEAK.limits.leadsMax);
  const rate = safe(input.rate, 0, 100) / 100;
  const captured = safe(input.speed, 0, 1) * safe(input.follow, 0, 1);
  const possible = leads * rate;
  const booked = possible * captured;
  return { possible, booked, lost: Math.max(0, possible - booked) };
}
