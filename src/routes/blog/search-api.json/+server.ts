import { json } from '@sveltejs/kit';
import { getBlogSearchProvider, queryBlogSearch } from '$lib/server/blog-search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const provider = getBlogSearchProvider();
	const query = url.searchParams.get('q')?.trim() ?? '';
	const items = query ? await queryBlogSearch(query) : [];

	return json(
		{
			provider,
			query,
			count: items.length,
			items
		},
		{
			headers: {
				'cache-control': query ? 'public, max-age=120' : 'public, max-age=600'
			}
		}
	);
};
