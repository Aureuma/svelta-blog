---
title: "Infinite Scroll With IntersectionObserver (Without Jank)"
date: "2026-02-05"
category: "Engineering"
author: "alex"
cover: "/blog/covers/infinite-scroll.svg"
tags:
  - "Performance"
  - "Svelte"
excerpt: "Mintlify-style content loading: a paginated JSON endpoint plus a sentinel at the bottom of the grid."
summaryAI: "Render the first page on the server for SEO, then append pages on the client using an `IntersectionObserver` watching a sentinel div. The endpoint should accept `offset`, `limit`, and `category`, and it should exclude the hero post to avoid duplicates."
---

The Mintlify blog index loads more cards as you scroll. There’s no “Load more” button.

## The shape of the API

We keep it simple:

```http
GET /blog/posts.json?offset=8&limit=8&category=engineering
```

## The sentinel pattern

```ts
const io = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadMore();
});

io.observe(sentinel);
```

## Optional: virtualization

If you ever have thousands of posts, add virtualization. Until then, pagination is enough.

