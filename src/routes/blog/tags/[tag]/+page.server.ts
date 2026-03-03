import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const search = new URLSearchParams(url.searchParams);
	search.set('tag', params.tag);
	search.delete('offset');
	const query = search.toString();
	throw redirect(308, query ? `/blog?${query}` : '/blog');
};
