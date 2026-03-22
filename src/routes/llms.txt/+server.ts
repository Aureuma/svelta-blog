import { getAllPosts } from '$lib/server/blog';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const posts = await getAllPosts();
	const recent = posts.slice(0, 10);
	const body = [
		'# svelta-blog',
		'',
		'> Editorial publishing system for SvelteKit.',
		'',
		'## Key endpoints',
		`- Blog home: ${new URL('/blog', url).toString()}`,
		`- Search page: ${new URL('/blog/search', url).toString()}`,
		`- Search index: ${new URL('/blog/search.json', url).toString()}`,
		`- Search API: ${new URL('/blog/search-api.json', url).toString()}`,
		`- Navigation JSON: ${new URL('/blog/navigation.json', url).toString()}`,
		`- Platform JSON: ${new URL('/blog/platform.json', url).toString()}`,
		`- Tags index: ${new URL('/blog/tags.json', url).toString()}`,
		`- Authors index: ${new URL('/blog/authors.json', url).toString()}`,
		`- Series index JSON: ${new URL('/blog/series.json', url).toString()}`,
		`- Series index: ${new URL('/blog/series', url).toString()}`,
		`- RSS feed: ${new URL('/feed.xml', url).toString()}`,
		`- JSON feed: ${new URL('/feed.json', url).toString()}`,
		`- Sitemap: ${new URL('/sitemap.xml', url).toString()}`,
		'',
		'## Recent posts',
		...recent.map((post) => `- ${post.title}: ${new URL(`/blog/${post.slug}`, url).toString()}`)
	].join('\n');

	return text(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
