import { pickLandingPage } from '$lib/server/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const landing = await pickLandingPage();
	return { landing };
};
