---
title: "Experience API"
navTitle: "Experience API"
description: "A clear abstraction for docs vs blog selection without overloading the word theme."
section: "reference"
sectionLabel: "Reference"
order: 1
sectionOrder: 5
updatedAt: "2026-02-28"
tags: ["experience", "reference"]
---

## Naming

Use **experience** for content mode:

- `docs` experience
- `blog` experience

Use **appearance** for light/dark/system UI state.

This keeps mode and visual style as separate concerns.

## Pattern configuration

`@aureuma/svelta` ships two first-class pattern configs:

- docs pattern
- blog pattern

Use builders from `@aureuma/svelta/experience` and keep most behavior in configuration.

```ts
import {
  createSveltaPatternConfig,
  createDocsPatternConfig,
  createBlogPatternConfig
} from '@aureuma/svelta/experience';

const config = createSveltaPatternConfig({
  docs: {
    brandName: 'Aureuma',
    productName: 'Documentation',
    search: { placeholder: 'Search docs...', shortcut: 'Ctrl K' },
    editLinkTemplate: 'https://github.com/Aureuma/aureuma/blob/main/src/content/docs/:slug.md'
  },
  blog: {
    pageSize: 8,
    maxPageSize: 24,
    showRss: true
  }
});

const docsOnly = createDocsPatternConfig({ toc: { enabled: true, title: 'On This Page' } });
const blogOnly = createBlogPatternConfig({ showRss: false });
```

## Docs edit link helper

When your docs pages map 1:1 to markdown file names, resolve edit URLs from the template:

```ts
import { resolveDocsEditUrl } from '@aureuma/svelta/experience';

const editUrl = resolveDocsEditUrl(config.docs, 'getting-started');
```

This keeps source links consistent and avoids route-specific hardcoding.
