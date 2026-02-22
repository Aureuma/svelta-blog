import { createDocs } from '@aureuma/svelta/server';
import type { DocsPageFull } from '$lib/types/docs';

type CompiledModule = { default: DocsPageFull['component'] };

const compiledModules = import.meta.glob('/src/content/docs/*.md') as Record<
	string,
	() => Promise<CompiledModule>
>;
const rawModules = import.meta.glob('/src/content/docs/*.md', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

export const docs = createDocs({
	compiledModules,
	rawModules,
	sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference']
});

export const { getAllPages, getPageBySlug, getSections, getSidebar, getAdjacentPages, pickLandingPage } = docs;
