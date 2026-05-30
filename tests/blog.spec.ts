import { expect, test } from '@playwright/test';

test('blog index renders hero, tags, search, and paginates', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.getByTestId('blog-hero')).toBeVisible();
  await expect(page.getByTestId('blog-tags')).toBeVisible();
  await expect(page.getByLabel('Search by topic, excerpt, title, or author')).toHaveCount(1);

  const cards = page.getByTestId('blog-card');
  await expect(cards).toHaveCount(8);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(async () => cards.count()).toBeGreaterThan(8);
});

test('blog tag filtering stays on /blog and updates query params', async ({ page }) => {
  await page.goto('/blog');

  const tabs = page.getByTestId('blog-tags').getByRole('tab');
  await expect.poll(async () => tabs.count()).toBeGreaterThan(1);
  await tabs.nth(1).click();
  await expect(page).toHaveURL(/\/blog\?tag=[a-z0-9-]+$/);
  await expect(page).not.toHaveURL(/\/blog\/tags\//);
});

test('post page renders summary, shiki blocks, and more posts', async ({ page }) => {
  await page.goto('/blog/ai-summary-cards-with-frontmatter');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByTestId('blog-summary')).toBeVisible();
  await expect.poll(async () => page.locator('pre.shiki').count()).toBeGreaterThan(0);
  await expect.poll(async () => page.locator('.blog-prose .heading-anchor').count()).toBeGreaterThan(0);
  await expect(page.getByTestId('blog-more-posts')).toBeVisible();
  await expect(page.getByText('More posts to read')).toBeVisible();
  await expect(page.getByText('Previous article')).toHaveCount(1);
  await expect(page.getByText('Next article')).toHaveCount(1);
});

test('blog taxonomy pages render archive and authors', async ({ page }) => {
  await page.goto('/blog/tags');
  await expect(page).toHaveURL(/\/blog\/?$/);

  await page.goto('/blog/tags/release');
  await expect(page).toHaveURL(/\/blog\/?\?tag=release$/);

  await page.goto('/blog/archive');
  await expect(page.getByTestId('blog-archive-page')).toBeVisible();
  await expect(page.locator('[data-testid="blog-archive-group"]').first()).toBeVisible();

  await page.goto('/blog/authors');
  await expect(page.getByTestId('blog-authors-page')).toBeVisible();
  await page.locator('[data-testid="blog-authors-page"] a').first().click();
  await expect(page.getByTestId('blog-author-page')).toBeVisible();
});

test('appearance toggling applies the expected html class', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const darkBtn = page.getByRole('button', { name: 'Dark' });
  await darkBtn.click();
  await expect(darkBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveClass(/dark/);

  const cobaltPaletteBtn = page.getByRole('button', { name: 'Use Cobalt palette' });
  await cobaltPaletteBtn.click();
  await expect(cobaltPaletteBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'cobalt');
});

test('rss feed is valid xml-ish and links do not include .md', async ({ request }) => {
  const res = await request.get('/feed.xml');
  expect(res.ok()).toBeTruthy();

  const ct = res.headers()['content-type'] ?? '';
  expect(ct).toContain('application/rss+xml');

  const body = await res.text();
  expect(body).toContain('<rss');
  expect(body).toContain('<channel>');
  expect(body).toContain('/blog/ai-summary-cards-with-frontmatter');
  expect(body).not.toContain('.md</link>');
});

test('sitemap uses canonical blog tag URLs', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.ok()).toBeTruthy();

  const body = await res.text();
  expect(body).toContain('/blog?tag=launch');
  expect(body).not.toContain('/blog/tags</loc>');
  expect(body).not.toContain('/blog/tags/');
});

test('mobile layout folds share UI into the content column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/ai-summary-cards-with-frontmatter');

  await expect(page.getByTestId('blog-share-mobile')).toBeVisible();
  await expect(page.getByTestId('blog-share-desktop')).toBeHidden();
});
