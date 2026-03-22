import { json } from '@sveltejs/kit';
import { getAllTags } from '$lib/server/blog';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const tags = await getAllTags();

	return json(
		{
			count: tags.length,
			items: tags
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
