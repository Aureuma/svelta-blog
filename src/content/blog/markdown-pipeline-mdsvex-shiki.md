---
title: "A Markdown Pipeline That Looks Like Product UI"
date: "2026-02-01"
category: "Engineering"
author: "alex"
cover: "/blog/covers/markdown-pipeline.svg"
series:
  title: "SvelteKit Publishing System"
  description: "A multi-part track covering the content pipeline, presentation layer, and delivery mechanics for a modern SvelteKit publication."
tags:
  - "Markdown"
  - "Shiki"
excerpt: "mdsvex gets us Markdown-in-Svelte; Shiki gets us code blocks that don’t look like blogspot."
summaryAI: "Use mdsvex with `remark-gfm` (tables), `rehype-slug` + `rehype-autolink-headings` (deep links), and `@shikijs/rehype` (syntax highlighting with dual themes). Style `pre.shiki` with balanced padding, radius, and line height."
---

There are two failure modes for Markdown blogs:

1. Everything looks like a generic “prose” template.
2. Code blocks are unreadable in either light or dark mode.

## Tables (GFM)

| Plugin | Why |
| --- | --- |
| `remark-gfm` | tables, strikethrough, task lists |

## Headings you can link to

We add `id`s and autolink headings so every section is shareable.

## Shiki, dual theme

Documentation-style code blocks use different themes in light vs dark. We do the same.

```js
// svelte.config.js
rehypePlugins: [
  [rehypeShiki, { themes: { light: "one-light", dark: "github-dark-default" } }]
]
```
