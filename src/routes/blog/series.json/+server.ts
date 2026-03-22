import { json } from '@sveltejs/kit';
import { getAllSeries } from '$lib/server/blog-intelligence';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const series = await getAllSeries();

	return json(
		{
			count: series.length,
			items: series
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
