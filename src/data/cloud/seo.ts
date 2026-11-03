/**
 * Per-page meta. Lengths are asserted at build: title <= 60, description <= 155, so a copy edit
 * that overruns fails the build instead of shipping a truncated snippet. No numbers in meta.
 */
export const HOME_SEO = {
  title: 'Cloud & DevOps Engineer for Small Teams | Faraz Ahmad',
  description:
    'CI/CD, migrations, monitoring and cloud cost cuts for teams without a DevOps hire. Infrastructure that stays up and costs less, scoped on a free call.',
} as const;

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function assertMeta(page: string, meta: { title: string; description: string }): void {
  if (meta.title.length > TITLE_MAX) {
    throw new Error(`[seo] cloud ${page}: title is ${meta.title.length} chars (max ${TITLE_MAX})`);
  }
  if (meta.description.length > DESCRIPTION_MAX) {
    throw new Error(`[seo] cloud ${page}: description is ${meta.description.length} chars (max ${DESCRIPTION_MAX})`);
  }
}
