---
title: "Building a Documentation-Style Blog in SvelteKit"
date: "2026-02-08"
category: "Engineering"
author: "shawn"
cover: "/blog/covers/blog-style.svg"
featured: true
series:
  title: "SvelteKit Publishing System"
  description: "A multi-part track covering the content pipeline, presentation layer, and delivery mechanics for a modern SvelteKit publication."
tags:
  - "SvelteKit"
  - "mdsvex"
  - "Tailwind"
excerpt: "A practical blueprint for a documentation-style blog: proportions, theming, Markdown rendering, reading-time, share widgets, infinite scroll, and RSS."
summaryAI: "We mirror a high-signal documentation blog system: fixed-width containers, hero+grid index, pill category tabs, a two-column post layout with a sticky author/share rail on desktop, Shiki-highlighted Markdown, reading-time labels, framed images, bottom recommendations, and an RSS feed. The implementation is SvelteKit-first: mdsvex for Markdown, Tailwind tokens for theming, and a JSON pagination endpoint for infinite scroll."
---

This post documents the structure we’re building: a blog with strong documentation layout and typographic rhythm, while remaining our own code + assets.

## What “documentation-style” means

It’s mainly about **placement and proportions**:

- A large **hero card** on the index, followed by a tag bar and a two-column grid
- Post pages that use a **narrow reading column** with a sticky right rail (desktop)
- Small mono uppercase metadata: category + reading-time + date

## The content pipeline

We use Markdown for content, but we want code blocks to look like “real UI”. That means Shiki.

```ts
// src/lib/server/blog.ts
import readingTime from "reading-time";

const minutes = Math.max(1, Math.round(readingTime(markdown).minutes));
```

## A tiny checklist

| Feature | Why it matters |
| --- | --- |
| Category pills | Fast scanning |
| AI summary card | Better “skim” mode |
| Sticky share rail | Share UX without interrupting reading |
| RSS feed | Works in every reader |
