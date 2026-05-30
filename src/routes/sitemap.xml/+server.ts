import { getAllPosts, getAllTags, getAuthorSummaries } from '$lib/server/blog';
import { getAllSeries } from '$lib/server/blog-intelligence';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ url }) => {
	const [posts, tags, authorSummaries, series] = await Promise.all([
		getAllPosts(),
		getAllTags(),
		getAuthorSummaries(),
		getAllSeries()
	]);
	const baseUrl = url.origin;
	const entries = [
		{ path: '/', lastmod: posts[0]?.date },
		{ path: '/blog', lastmod: posts[0]?.date },
		{ path: '/blog/archive', lastmod: posts[0]?.date },
		{ path: '/blog/search', lastmod: posts[0]?.date },
		{ path: '/blog/search.json', lastmod: posts[0]?.date },
		{ path: '/blog/search-api.json', lastmod: posts[0]?.date },
		{ path: '/blog/navigation.json', lastmod: posts[0]?.date },
		{ path: '/blog/platform.json', lastmod: posts[0]?.date },
		{ path: '/blog/tags.json', lastmod: posts[0]?.date },
		{ path: '/blog/authors.json', lastmod: authorSummaries[0]?.latestPostDate },
		{ path: '/blog/series.json', lastmod: posts[0]?.date },
		{ path: '/blog/opensearch.xml', lastmod: posts[0]?.date },
		{ path: '/blog/series', lastmod: posts[0]?.date },
		{ path: '/manifest.webmanifest', lastmod: posts[0]?.date },
		{ path: '/blog/authors', lastmod: authorSummaries[0]?.latestPostDate },
		{ path: '/feed.json', lastmod: posts[0]?.date },
		{ path: '/llms.txt', lastmod: posts[0]?.date },
		...posts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.date })),
		...tags.map((tag) => ({ path: `/blog?tag=${tag.slug}`, lastmod: posts[0]?.date })),
		...series.map((entry) => ({ path: `/blog/series/${entry.id}`, lastmod: entry.posts.at(-1)?.date ?? posts[0]?.date })),
		...authorSummaries.map((author) => ({
			path: `/blog/authors/${author.author.id}`,
			lastmod: author.latestPostDate
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>
    <loc>${escapeXml(new URL(entry.path, baseUrl).toString())}</loc>
${entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return text(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
