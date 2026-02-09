---
title: "RSS Feeds That Actually Work"
date: "2026-02-04"
category: "Best practices"
author: "shawn"
cover: "/blog/covers/rss.svg"
tags:
  - "RSS"
  - "SEO"
excerpt: "Generate a real RSS 2.0 feed from your Markdown posts and expose it at /feed.xml."
summaryAI: "Emit RSS 2.0 with an `atom:link rel=\"self\"`, include `title`, `description`, `link`, `guid`, `pubDate`, and `category` for each post, and set `content-type: application/rss+xml`. Keep descriptions short and safe (use the excerpt)."
---

If you have a blog, you should have RSS. It’s a low-effort, high-trust feature.

## What we generate

- RSS 2.0
- `atom:link` self reference
- Items with title, link, description, pubDate, and category

## A note on HTML

RSS readers vary. Keep the description **plain text** (the excerpt) and let the post page carry the rich formatting.

