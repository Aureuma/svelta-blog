---
title: "AI Summary Cards With Frontmatter"
date: "2026-02-03"
category: "AI trends"
author: "maria"
cover: "/blog/covers/ai-summary.svg"
tags:
  - "UX"
  - "Content"
excerpt: "A skimmable summary card that appears near the top of the post, controlled by a single frontmatter field."
summaryAI: "Add an optional `summaryAI` field in frontmatter. If present, render a soft card after the hero image with a mono uppercase label (“AI SUMMARY”) and a short paragraph. If absent, omit the card entirely (Mintlify does this on some posts)."
---

Readers don’t always want the whole story. They often want the gist, then decide.

## Placement

The summary works best **after the hero image** and **before the article body**.

## Implementation idea

```md
summaryAI: "One paragraph that makes the post skimmable."
```

Then in the post page:

```svelte
{#if post.summaryAI}
  <SummaryCard summary={post.summaryAI} />
{/if}
```
