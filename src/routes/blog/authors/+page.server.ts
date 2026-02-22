import { getAuthorSummaries } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const authors = await getAuthorSummaries();
	return { authors };
};
