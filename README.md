# svelta

A markdown publishing system for two first-class experiences in SvelteKit (Svelte 5): docs and blog.

## Naming model

- `experience`: content mode (`docs` or `blog`)
- `appearance`: UI mode (`system`, `light`, `dark`)

## Routes

- `/` landing page with the selected initial experience
- `/docs` docs index (section cards + guided entry)
- `/docs/[slug]` docs page (sidebar + previous/next navigation)
- `/blog` blog index (hero + category pills + infinite scroll)
- `/blog/[slug]` blog post page (sticky author/share rail on desktop, folds into header on mobile)
- `/feed.xml` RSS 2.0 feed

## Content

Markdown posts live in `src/content/blog/*.md` (YAML frontmatter required).
Markdown docs pages live in `src/content/docs/*.md` (YAML frontmatter required).

Static assets (covers/avatars) live in `static/blog/*`.

## Initial experience

Set `PUBLIC_SVELTA_EXPERIENCE=docs` or `PUBLIC_SVELTA_EXPERIENCE=blog`.

## Development

```sh
npm run dev
```

## Pattern-First Configuration

Configure docs and blog experiences through explicit pattern builders:

```ts
import { createSveltaPatternConfig } from '@aureuma/svelta/experience';

const patterns = createSveltaPatternConfig({
	docs: {
		brandName: 'Aureuma',
		productName: 'Documentation',
		search: { placeholder: 'Search docs...', shortcut: 'Ctrl K' },
		editLinkTemplate: 'https://github.com/Aureuma/aureuma/blob/main/src/content/docs/:slug.md'
	},
	blog: {
		pageSize: 8,
		maxPageSize: 24,
		infiniteScroll: true,
		showRss: true
	}
});
```

This keeps the implementation reusable while app repos control behavior through config.

## Raw Docs Runtime (No mdsvex Required)

If your app stores docs as plain markdown and wants server-rendered HTML without mdsvex, use `createRawDocs`:

```ts
import { createRawDocs } from '@aureuma/svelta/server';

const docs = createRawDocs({
	rawModules: import.meta.glob('/src/content/docs/*.md', {
		query: '?raw',
		import: 'default'
	}),
	renderMarkdown: async (markdown) => yourMarkdownRenderer(markdown)
});

export const getDocsSidebar = docs.getSidebar;
export const getDocsPageBySlug = docs.getPageBySlug;
```

## Internal Hosting (Pre-deploy)

```sh
npm run host:internal
```

This serves the built site on `0.0.0.0:4173` for internal network validation.

## Typecheck

```sh
npm run check
```

## Production Build

```sh
npm run build
npm run preview
```
