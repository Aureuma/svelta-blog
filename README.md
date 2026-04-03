# svelta-blog

A blog-first markdown publishing system for SvelteKit.

## Scope

- Editorial blog index with infinite scroll and tag filtering
- Individual post pages with summaries, sharing, and related posts
- RSS feed generation
- Reusable blog primitives shipped as `@aureuma/svelta-blog`

## Routes

- `/` landing page for the blog system
- `/blog` blog index
- `/blog/[slug]` individual post page
- `/blog/archive` archive view
- `/blog/authors` author directory
- `/blog/authors/[author]` author page
- `/feed.xml` RSS feed

## Content

Markdown posts live in `src/content/blog/*.md`.

## Development

```sh
pnpm run dev
```

## Package

```sh
npm i @aureuma/svelta-blog
```
