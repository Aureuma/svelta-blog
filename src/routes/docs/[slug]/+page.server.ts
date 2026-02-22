import { getAdjacentPages, getPageBySlug, getSidebar } from '$lib/server/docs';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = await getPageBySlug(params.slug);
	if (!page) throw error(404, 'Docs page not found');

	const { component, ...meta } = page;
	const rendered = render(component);
	const [sidebar, adjacent] = await Promise.all([getSidebar(), getAdjacentPages(page.slug)]);

	return {
		page: meta,
		contentHtml: rendered.html,
		sidebar,
		adjacent,
		canonicalUrl: new URL(`/docs/${meta.slug}`, url).toString()
	};
};
