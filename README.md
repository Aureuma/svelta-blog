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
