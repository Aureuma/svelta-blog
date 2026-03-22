import { getBlogSearchEntries, getBlogSearchProvider } from '$lib/server/blog-search';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const initialQuery = url.searchParams.get('q')?.trim() ?? '';

	return {
		initialQuery,
		searchProvider: getBlogSearchProvider(),
		items: await getBlogSearchEntries()
	};
};
