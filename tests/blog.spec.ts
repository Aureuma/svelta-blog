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

test('docs index renders section grid and links into a docs page', async ({ page }) => {
	await page.goto('/docs');

	await expect(page.getByTestId('docs-section-grid')).toBeVisible();
	await page.getByRole('link', { name: 'Overview' }).first().click();
	await expect(page).toHaveURL(/\/docs\/overview$/);
	await expect(page.getByTestId('docs-sidebar')).toBeVisible();
	await expect(page.getByTestId('docs-pager')).toBeVisible();
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
});

test('appearance toggling applies the expected html class', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	const darkBtn = page.getByRole('button', { name: 'Dark' });
	await darkBtn.click();

	// If hydration/event binding is broken, this will never flip.
	await expect(darkBtn).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('html')).toHaveClass(/dark/);
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
