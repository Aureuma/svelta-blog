import { json } from '@sveltejs/kit';
import { getAuthorSummaries } from '$lib/server/blog';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const authors = await getAuthorSummaries();

	return json(
		{
			count: authors.length,
			items: authors
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
