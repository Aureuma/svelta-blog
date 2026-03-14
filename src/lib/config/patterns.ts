import {
  createBlogPatternConfig,
  type SveltaBlogPatternConfig
} from '@aureuma/svelta-blog/experience';

function parsePositiveInt(input: string | undefined, fallback: number): number {
  if (!input) return fallback;
  const parsed = Number.parseInt(input, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(input: string | undefined, fallback: boolean): boolean {
  if (!input) return fallback;
  const normalized = input.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return fallback;
}

export const blogPattern: SveltaBlogPatternConfig = createBlogPatternConfig({
  brandName: 'svelta-blog',
  title: 'Editorial publishing for Svelte teams.',
  description: 'A focused markdown blog system with author pages, archive views, tag filters, and RSS.',
  pageSize: parsePositiveInt(import.meta.env.PUBLIC_SVELTA_BLOG_PAGE_SIZE, 8),
  maxPageSize: parsePositiveInt(import.meta.env.PUBLIC_SVELTA_BLOG_MAX_PAGE_SIZE, 24),
  showRss: parseBoolean(import.meta.env.PUBLIC_SVELTA_BLOG_RSS, true)
});
