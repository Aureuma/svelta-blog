import assert from 'node:assert/strict';
import test from 'node:test';

import { createRawBlog } from '../packages/core/dist/server/blog.js';

const rawModules = {
  '/src/content/blog/launch.md': async () => `---
title: Launch Post
date: "2026-03-14"
category: Announcements
author: shawn
cover: /blog/covers/launch.svg
excerpt: Release recap.
tags:
  - release
  - roadmap
featured: true
---

# Launch

Hello world.`,
  '/src/content/blog/notes.md': async () => `---
title: Notes
date: "2026-03-10"
category: Engineering
author: alex
cover: /blog/covers/notes.svg
excerpt: Notes.
tags:
  - release
---

# Notes

Deep work.`,
  '/src/content/blog/draft.md': async () => `---
title: Draft
date: "2026-03-01"
category: Engineering
author: alex
cover: /blog/covers/draft.svg
draft: true
excerpt: Hidden.
---

# Draft
`
};

const getAuthor = (id) => ({
  shawn: { id: 'shawn', name: 'Shawn', title: 'Builder', avatar: '/blog/authors/shawn.svg' },
  alex: { id: 'alex', name: 'Alex', title: 'Engineer', avatar: '/blog/authors/alex.svg' }
}[id]);

test('createRawBlog builds post indexes and filters drafts', async () => {
  const blog = createRawBlog({
    rawModules,
    getAuthor,
    renderMarkdown: async (markdown) => `<article>${markdown.trim()}</article>`
  });

  const posts = await blog.getAllPosts();
  assert.equal(posts.length, 2);
  assert.deepEqual(posts.map((post) => post.slug), ['launch', 'notes']);
  assert.deepEqual(posts[0].tags, ['release']);

  const tags = await blog.getAllTags();
  assert.equal(tags.length, 1);
  assert.equal(tags[0].slug, 'release');

  const hero = await blog.pickHero(posts);
  assert.equal(hero.slug, 'launch');
});

test('createRawBlog returns content and related metadata', async () => {
  const blog = createRawBlog({
    rawModules,
    getAuthor,
    renderMarkdown: async (markdown) => `<section>${markdown.trim()}</section>`
  });

  const post = await blog.getPostBySlug('launch');
  assert.ok(post);
  assert.match(post.html, /<section>/);
  assert.match(post.raw, /Hello world/);
  assert.equal(post.frontmatter.title, 'Launch Post');

  const related = await blog.getRelatedPosts('launch', 1);
  assert.equal(related.length, 1);
  assert.equal(related[0].slug, 'notes');
});

test('createRawBlog supports opt-in multi-tag raw posts', async () => {
  const blog = createRawBlog({
    rawModules,
    getAuthor,
    allowMultipleTags: true,
    renderMarkdown: async (markdown) => `<article>${markdown.trim()}</article>`
  });

  const post = await blog.getPostBySlug('launch');
  assert.ok(post);
  assert.deepEqual(post.tags, ['release', 'roadmap']);

  const tags = await blog.getAllTags();
  assert.deepEqual(tags.map((tag) => tag.slug), ['release', 'roadmap']);

  const roadmapPosts = await blog.getPostsByTag('roadmap');
  assert.deepEqual(roadmapPosts.map((roadmapPost) => roadmapPost.slug), ['launch']);
});
