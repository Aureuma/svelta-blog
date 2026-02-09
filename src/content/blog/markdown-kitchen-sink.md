---
title: "Markdown Kitchen Sink (Rendering QA)"
date: "2026-02-08"
category: "Engineering"
author: "alex"
cover: "/blog/covers/kitchen-sink.svg"
tags:
  - "Markdown"
  - "QA"
excerpt: "A deliberately dense post to validate typography, spacing, tables, lists, code blocks, images, and edge cases in our Markdown renderer."
summaryAI: "This post exists to stress-test Markdown rendering: tables should scroll on mobile, code blocks should be readable in light/dark mode, headings should get anchors, and images should look framed and open in the lightbox."
---

This post is intentionally packed. It is here to catch layout regressions before real content does.

## Headings and anchors

If you hover headings on desktop, you should see a subtle `#` anchor indicator.

### A smaller heading

Anchors should not shift layout, and scroll margins should land nicely below the sticky header.

## Lists (including nesting)

- One
- Two
  - Two.A
  - Two.B
- Three

1. First
2. Second
   1. Second.A
   2. Second.B
3. Third

Task list (GFM):

- [x] Basic list spacing
- [x] Nested list spacing
- [ ] Task lists render correctly

## Blockquotes

> A blockquote should feel like a callout: a soft left border, readable spacing, and no weird quote marks.
>
> Multiple paragraphs should keep the border and spacing intact.

## Inline formatting

This has **bold**, *italic*, ~~strikethrough~~, and `inline code`.

Long URL wrapping should not overflow:
https://example.com/a/really/really/really/really/really/really/really/long/path?with=query&and=more

## Tables (GFM)

| Column | Description | Notes |
| --- | --- | --- |
| Tags | Category pills on `/blog` | Scrollable on mobile |
| RSS | `/feed.xml` | Auto-discoverable via `<link rel="alternate">` |
| Share | X / LinkedIn / Facebook / Copy | Sticky rail on desktop |

Tables should be horizontally scrollable on narrow screens.

## Code blocks (Shiki)

```ts
type PostFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  author: string;
  cover: string;
  excerpt?: string;
  summaryAI?: string;
  tags?: string[];
  featured?: boolean;
};
```

```svelte
{#if post.summaryAI}
  <SummaryCard summary={post.summaryAI} />
{/if}
```

## Images (frame + lightbox)

Click the image to open the lightbox.

![RSS cover used as an in-article graphic](/blog/covers/rss.svg)

## Horizontal rule

---

## Final note

If something looks wrong here, it will look wrong everywhere. Fix it here first.
