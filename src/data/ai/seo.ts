/**
 * Per-page meta (spec §8.3). Lengths are asserted at build by assertMeta():
 * title <= 60, description <= 155, so a copy edit that overruns fails the build
 * instead of shipping a truncated snippet.
 */
export const HOME_SEO = {
  title: 'AI Automation Developer: n8n, Make, Zapier | Faraz Ahmad',
  description:
    'AI automation developer for n8n, Make, Zapier and custom AI agents. I build new systems and fix broken automations. Fixed scope, monitored, yours.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
