import { getSidebar } from '$lib/server/docs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const sidebar = await getSidebar();
	return { sidebar };
};
