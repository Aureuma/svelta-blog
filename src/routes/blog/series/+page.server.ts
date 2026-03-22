import { getAllSeries } from '$lib/server/blog-intelligence';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		series: await getAllSeries()
	};
};
