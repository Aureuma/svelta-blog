# svelta

A documentation-first blogging system built with SvelteKit (Svelte 5) + Markdown.

## Routes

- `/blog` blog index (hero + category pills + infinite scroll)
- `/blog/[slug]` blog post page (sticky author/share rail on desktop, folds into header on mobile)
- `/feed.xml` RSS 2.0 feed

## Content

Markdown posts live in `src/content/blog/*.md` (YAML frontmatter required).

Static assets (covers/avatars) live in `static/blog/*`.

## Development

```sh
npm run dev
```

## Typecheck

```sh
npm run check
```

## Production Build

```sh
npm run build
npm run preview
```
