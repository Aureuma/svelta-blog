import { getAllPosts } from '$lib/server/blog';
import { buildRss } from '$lib/server/rss';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const posts = await getAllPosts();

	const rss = buildRss({
		baseUrl: url,
		posts,
		siteTitle: 'svelta Blog',
		description: 'Engineering, design, and product notes from svelta.'
	});

	return new Response(rss, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': 'max-age=0, s-maxage=3600'
		}
	});
};
