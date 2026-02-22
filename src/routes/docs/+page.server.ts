import { getSidebar, pickLandingPage } from '$lib/server/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [sidebar, landing] = await Promise.all([getSidebar(), pickLandingPage()]);
	return { sidebar, landing };
};
