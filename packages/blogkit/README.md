# @aureuma/blogkit

A Mintlify-inspired blog UI + content pipeline helpers for SvelteKit + mdsvex.

This repo keeps `convelt` as a demo app, and exposes the reusable parts as a local workspace package under `packages/blogkit`.

## What you get

- Blog UI components: hero card, post cards, tag tabs, share buttons, summary card, more-posts grid, image lightbox.
- Server helpers: `createBlog()` to load Markdown posts (frontmatter, excerpt, reading-time, categories, hero).
- Theme helper: `createThemeController()` and a simple theme switcher component.

### Compatibility

- Component source is compatible with Svelte 4 and Svelte 5 (no runes required).
- If you already have an existing frontmatter schema, use `mapFrontmatter` to adapt it to BlogKit's expected fields.

## Use In Another Repo

### Install from npm

```sh
npm i @aureuma/blogkit
```

### Option A: mono-repo / workspaces (recommended)

1. Add this repo as a submodule (or subtree) inside your project:

```sh
git submodule add git@github.com:Aureuma/convelt.git packages/convelt
```

2. Point your workspace config at the package:

```json
{
  "workspaces": ["packages/*", "packages/convelt/packages/*"]
}
```

3. Import and use:

```ts
import { BlogCard } from '@aureuma/blogkit';
import { createBlog } from '@aureuma/blogkit/server';
```

### Option B: publish to npm

1. Set `"private": false` in `packages/blogkit/package.json`.
2. From `packages/blogkit`, run `npm publish`.

## Integration Steps (SvelteKit)

1. mdsvex: configure Markdown compilation (`.md`) and Shiki/anchors (see this repo's `svelte.config.js`).
2. Content:
   - posts: `src/content/blog/*.md` with YAML frontmatter
   - assets: `static/blog/covers/*` and `static/blog/authors/*`
3. Blog loader glue:

```ts
// src/lib/server/blog.ts
import { createBlog } from '@aureuma/blogkit/server';
import { getAuthor } from '$lib/content/authors';
import type { BlogPostFull } from '@aureuma/blogkit';

type CompiledModule = { default: BlogPostFull['component'] };

const compiledModules = import.meta.glob('/src/content/blog/*.md') as Record<
  string,
  () => Promise<CompiledModule>
>;
const rawModules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>;

export const blog = createBlog({ compiledModules, rawModules, getAuthor });
export const { getAllPosts, getPostBySlug, getCategories, pickHero } = blog;
```

4. Tailwind: ensure your `content` globs include the package so class names are not purged.
   - If installed from npm: include `./node_modules/@aureuma/blogkit/dist/**/*`.

5. Routes: copy the blog routes from this repo:
   - `src/routes/blog/*`
   - `src/routes/feed.xml/*`

## Notes

- `createBlog()` builds the index from raw Markdown only (fast), and imports the compiled mdsvex component only for individual post pages.
- This package is intended for SvelteKit. UI uses Tailwind utility classes and expects your app to provide the CSS variables/tokens.
