import {
	createSveltaPatternConfig,
	type SveltaBlogPatternConfig,
	type SveltaDocsPatternConfig
} from '@aureuma/svelta/experience';

function parsePositiveInt(input: string | undefined, fallback: number): number {
	if (!input) return fallback;
	const parsed = Number.parseInt(input, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(input: string | undefined, fallback: boolean): boolean {
	if (!input) return fallback;
	const normalized = input.trim().toLowerCase();
	if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
	if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
	return fallback;
}

const docsEditBase =
	import.meta.env.PUBLIC_SVELTA_DOCS_EDIT_BASE ??
	'https://github.com/Aureuma/svelta/blob/main/src/content/docs';

const patterns = createSveltaPatternConfig({
	docs: {
		brandName: 'svelta',
		productName: 'Docs',
		title: 'Mintlify-style docs shell powered by markdown + SvelteKit.',
		description:
			'Configuration-first documentation UX with section navigation, command palette, right-rail table of contents, and edit links.',
		defaultSectionLabel: 'Guides',
		sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference'],
		search: {
			placeholder: 'Search docs...',
			shortcut: 'Ctrl K'
		},
		toc: {
			title: 'On This Page'
		},
		feedback: {
			prompt: 'Was this page helpful?'
		},
		editLinkTemplate: `${docsEditBase}/:slug.md`
	},
	blog: {
		brandName: 'svelta',
		title: 'Narrative product and engineering updates.',
		description: 'Editorial feed with in-place tag filters and continuous infinite loading.',
		pageSize: parsePositiveInt(import.meta.env.PUBLIC_SVELTA_BLOG_PAGE_SIZE, 8),
		maxPageSize: parsePositiveInt(import.meta.env.PUBLIC_SVELTA_BLOG_MAX_PAGE_SIZE, 24),
		showRss: parseBoolean(import.meta.env.PUBLIC_SVELTA_BLOG_RSS, true)
	}
});

export const docsPattern: SveltaDocsPatternConfig = patterns.docs;
export const blogPattern: SveltaBlogPatternConfig = patterns.blog;
export const sveltaPatternConfig = patterns;
