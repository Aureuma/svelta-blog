---
title: "Design Tokens That Scale (Without Getting Mushy)"
date: "2026-02-06"
category: "Design"
author: "maria"
cover: "/blog/covers/design-tokens.svg"
tags:
  - "Design Systems"
  - "Theming"
excerpt: "A small, opinionated token set that keeps contrast crisp across light/dark, while preserving the documentation-style quiet UI."
summaryAI: "Use a tiny set of semantic tokens: `background.main/soft`, `text.main/sub/muted`, `border.soft`, and `brand`. Map them to CSS variables on `html.light`/`html.dark`, then reference them via Tailwind colors. Keep borders extremely subtle and reserve the brand color for metadata accents."
---

Great documentation blogs look “clean” because everything is token-driven and low-noise.

## Token strategy

We intentionally keep the token set small:

- `background.main`, `background.soft`
- `text.main`, `text.sub`, `text.muted`
- `border.soft`
- `brand`

## Why “soft borders” matter

When borders are too strong, the UI becomes a spreadsheet. The goal is to have frames that are visible *only when you’re looking for them*.

## Tailwind mapping

We map CSS variables to Tailwind colors so components stay readable:

```js
// tailwind.config.cjs
colors: {
  background: {
    main: "rgb(var(--c-background-main) / <alpha-value>)",
    soft: "rgb(var(--c-background-soft) / <alpha-value>)",
  },
}
```

## In-content images

We frame every in-article image with a subtle 1px border and a 10px radius to match the overall “rounded media” identity:

![Framed example](/blog/covers/design-tokens.svg)
