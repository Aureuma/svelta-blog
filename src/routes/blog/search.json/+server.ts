import { getBlogSearchEntries } from '$lib/server/blog-search';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	return json(
		{
			items: await getBlogSearchEntries(url)
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
