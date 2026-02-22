import { getAdjacentPages, getPageBySlug } from '$lib/server/docs';
import { extractDocsHeadings } from '$lib/server/docs-headings';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = await getPageBySlug(params.slug);
	if (!page) throw error(404, 'Docs page not found');

	const { component, ...meta } = page;
	const rendered = render(component);
	const [adjacent] = await Promise.all([getAdjacentPages(page.slug)]);
	const toc = extractDocsHeadings(rendered.html);
	const sourceUrl = `https://github.com/Aureuma/svelta/blob/main/src/content/docs/${meta.slug}.md`;

	return {
		page: meta,
		contentHtml: rendered.html,
		adjacent,
		toc,
		sourceUrl,
		canonicalUrl: new URL(`/docs/${meta.slug}`, url).toString()
	};
};
