import { expect, test } from '@playwright/test';

test('blog index renders hero, tags, and paginates', async ({ page }) => {
	await page.goto('/blog');

	await expect(page.getByTestId('blog-hero')).toBeVisible();
	await expect(page.getByTestId('blog-tags')).toBeVisible();

	const cards = page.getByTestId('blog-card');
	await expect(cards).toHaveCount(8);

	// Trigger infinite scroll: scroll near bottom and wait for additional cards.
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await expect.poll(async () => cards.count()).toBeGreaterThan(8);
});

test('blog tag filtering stays on /blog and updates query params', async ({ page }) => {
	await page.goto('/blog');

	const tagsRail = page.getByTestId('blog-tags');
	// Click the first non-default category tab so the test stays valid
	// even when the seeded taxonomy set changes.
	await tagsRail.getByRole('tab').nth(1).click();
	await expect(page).toHaveURL(/\/blog\?tag=[a-z0-9-]+$/);
	await expect(page).not.toHaveURL(/\/blog\/tags\//);
});

test('docs index renders section grid and links into a docs page', async ({ page }) => {
	await page.goto('/docs');

	await expect(page.getByTestId('docs-section-grid')).toBeVisible();
	await expect(page.getByTestId('docs-home-tabs')).toBeVisible();
	await expect(page.getByTestId('docs-faq')).toBeVisible();
	await expect(page.getByTestId('site-header')).toHaveCount(1);
	await page.getByRole('link', { name: 'Overview' }).first().click();
	await expect(page).toHaveURL(/\/docs\/overview$/);
	await expect(page.getByTestId('site-header')).toHaveCount(1);
	await expect(page.getByTestId('docs-sidebar')).toBeVisible();
	await expect(page.getByTestId('docs-toc')).toBeVisible();
	await expect(page.getByTestId('docs-pager')).toBeVisible();
});

test('docs command palette opens and navigates to selected page', async ({ page }) => {
	await page.goto('/docs');

	await page.getByTestId('docs-search-trigger').click();
	const searchInput = page.getByPlaceholder('Search documentation...');
	await expect(searchInput).toBeVisible();
	await searchInput.fill('Server API');
	await searchInput.press('Enter');
	await expect(page).toHaveURL(/\/docs\/server-api$/);
});

test('docs markdown enhancements render admonitions, code-copy, and feedback', async ({ page }) => {
	await page.goto('/docs/overview');
	await expect(page.locator('[data-admonition]').first()).toBeVisible();
	await page.getByTestId('docs-feedback-yes').click();
	await expect(page.getByTestId('docs-feedback')).toContainText('Thanks for the feedback.');

	await page.goto('/docs/getting-started');
	await expect(page.locator('[data-code-copy]').first()).toBeVisible();
});

test('post page renders summary, shiki blocks, and more posts', async ({ page }) => {
	await page.goto('/blog/ai-summary-cards-with-frontmatter');

	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByTestId('blog-summary')).toBeVisible();
	await expect.poll(async () => page.locator('pre.shiki').count()).toBeGreaterThan(0);

	// Heading anchors from rehype-autolink-headings should exist.
	await expect
		.poll(async () => page.locator('.blog-prose .heading-anchor').count())
		.toBeGreaterThan(0);

	await expect(page.getByTestId('blog-more-posts')).toBeVisible();
	await expect(page.getByText('More posts to read')).toBeVisible();
	await expect(page.getByText('Previous')).toHaveCount(0);
	await expect(page.getByText('Next')).toHaveCount(0);
});

test('blog taxonomy pages render tags, archive, and authors', async ({ page }) => {
	await page.goto('/blog/tags');
	await expect(page.getByTestId('blog-tags-page')).toBeVisible();
	await page.locator('[data-testid=\"blog-tags-page\"] a').first().click();
	await expect(page.getByTestId('blog-tag-page')).toBeVisible();

	await page.goto('/blog/archive');
	await expect(page.getByTestId('blog-archive-page')).toBeVisible();
	await expect(page.locator('[data-testid=\"blog-archive-group\"]').first()).toBeVisible();

	await page.goto('/blog/authors');
	await expect(page.getByTestId('blog-authors-page')).toBeVisible();
	await page.locator('[data-testid=\"blog-authors-page\"] a').first().click();
	await expect(page.getByTestId('blog-author-page')).toBeVisible();
});

test('appearance toggling applies the expected html class', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	const darkBtn = page.getByRole('button', { name: 'Dark' });
	await darkBtn.click();

	// If hydration/event binding is broken, this will never flip.
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

test('mobile layout folds share UI into the content column', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/blog/ai-summary-cards-with-frontmatter');

	await expect(page.getByTestId('blog-share-mobile')).toBeVisible();
	await expect(page.getByTestId('blog-share-desktop')).toBeHidden();
});

test('mobile docs navigation opens in a sheet panel', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/overview');

	await page.getByTestId('docs-mobile-nav-trigger').click();
	await expect(page.getByTestId('docs-mobile-nav-panel')).toBeVisible();
	await expect(page.getByTestId('docs-mobile-nav-panel').getByRole('link', { name: 'Overview' })).toBeVisible();
});
