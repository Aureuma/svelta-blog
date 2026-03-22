import { getSeriesById } from '$lib/server/blog-intelligence';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const series = await getSeriesById(params.series);
	if (!series) throw error(404, 'Series not found');

	return {
		series
	};
};
