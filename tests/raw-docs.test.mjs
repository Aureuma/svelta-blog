import assert from 'node:assert/strict';
import test from 'node:test';

import { createRawDocs } from '../packages/core/dist/server/docs.js';

const rawModules = {
	'/src/content/docs/getting-started.md': async () => `---
title: Getting Started
section: getting-started
sectionLabel: Getting Started
sectionOrder: 2
order: 1
updatedAt: "2026-03-01"
---

# Getting started

Install dependencies.`,
	'/src/content/docs/overview.md': async () => `---
title: Overview
section: overview
sectionLabel: Overview
sectionOrder: 1
order: 1
---

# Overview

Welcome.`,
	'/src/content/docs/draft-page.md': async () => `---
title: Draft Page
draft: true
---

# Hidden
`
};

test('createRawDocs builds metadata and content indexes', async () => {
	const docs = createRawDocs({
		rawModules,
		renderMarkdown: async (markdown) => `<article>${markdown.trim()}</article>`
	});

	const pages = await docs.getAllPages();
	assert.equal(pages.length, 2);
	assert.deepEqual(
		pages.map((page) => page.slug),
		['overview', 'getting-started']
	);

	const sidebar = await docs.getSidebar();
	assert.equal(sidebar.length, 2);
	assert.equal(sidebar[0].id, 'overview');
	assert.equal(sidebar[1].id, 'getting-started');

	const landing = await docs.pickLandingPage();
	assert.equal(landing?.slug, 'overview');
});

test('createRawDocs returns html/raw/frontmatter and adjacency', async () => {
	const docs = createRawDocs({
		rawModules,
		renderMarkdown: async (markdown) => `<section>${markdown.trim()}</section>`
	});

	const overview = await docs.getPageBySlug('overview');
	assert.ok(overview);
	assert.match(overview.html, /<section>/);
	assert.match(overview.raw, /Welcome\./);
	assert.equal(overview.frontmatter.title, 'Overview');

	const adjacent = await docs.getAdjacentPages('overview');
	assert.equal(adjacent.previous, null);
	assert.equal(adjacent.next?.slug, 'getting-started');
});
