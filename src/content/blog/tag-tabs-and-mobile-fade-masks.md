---
title: "Tag Tabs + Mobile Fade Masks"
date: "2026-02-02"
category: "Design"
author: "maria"
cover: "/blog/covers/design-tokens.svg"
tags:
  - "Responsive"
  - "UI"
excerpt: "A horizontally scrollable tag bar on mobile, with fade edges so it feels intentional instead of broken."
summaryAI: "On small screens, render the tag row as `overflow-x-auto` with hidden scrollbar. Add a `mask-image` gradient to fade the left/right edges. On desktop, disable the mask and allow the pills to sit normally."
---

Pill tabs are easy on desktop, but mobile needs a different treatment.

## The goal

- Horizontal scroll
- No visible scrollbar
- Subtle fade at the edges

## CSS mask trick

We apply a `mask-image` gradient to the scrolling container, then remove it on larger screens.

