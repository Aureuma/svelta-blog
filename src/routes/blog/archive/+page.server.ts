import { getArchiveGroups } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const groups = await getArchiveGroups();
	return { groups };
};
