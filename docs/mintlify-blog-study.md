# Mintlify Blog Study (Design + Implementation Notes for Convelt)

Date: 2026-02-08

Scope: Build a SvelteKit + Markdown blogging system inspired by `https://www.mintlify.com/blog` (layout, typography scale, theming, cards, tagging, reading-time, RSS, post structure, share UI, responsive behavior, image framing).

Method: I used the Playwright MCP browser to inspect the blog index, multiple post pages, responsive breakpoints (desktop + mobile), and crawled a sample set of **36 posts** (latest + mid + older) to validate patterns across content types.

## Guardrails (Important)

- “Inspired by” means we replicate **patterns** (layout rules, component roles, proportions), not Mintlify’s brand assets or content.
- Do not copy Mintlify’s copy, images, or proprietary CSS. Use our own components/tokens while matching the *system behavior*.

---

## 1) Expansion Of Each Requested Item (What You Mean) + Mintlify Lessons + How We’ll Implement

Each section follows:

- **What you mean**: clarified requirement
- **Mintlify lesson (observed)**: what Mintlify does in practice (numbers, placement, behavior)
- **Implementation notes (SvelteKit)**: concrete code approach (components, routes, data model)

### 1. Element Placement

- **What you mean**: the page layout “grid” and where each UI chunk sits (hero, tag bar, cards; or back link, meta, title, author/share, content, more-posts).
- **Mintlify lesson (observed)**:
  - Blog index: `max-w-5xl mx-auto px-6` container; hero card first; tag bar next; then a 2-col grid of cards.
  - Post page: header stack (back link → category/read-time → title → date), then separator, then 2-col layout: content column + sticky author/share column.
  - Post content column max width is **~628px** within an overall `max-w-4xl` container. The sticky side column is narrow (~150–160px) with a generous horizontal gap.
- **Implementation notes (SvelteKit)**:
  - Blog index route: `src/routes/blog/+page.svelte`
  - Post route: `src/routes/blog/[slug]/+page.svelte`
  - Shared layout primitives: `src/lib/components/blog/Container.svelte`, `.../BlogHeroCard.svelte`, `.../BlogCard.svelte`, `.../PostLayout.svelte`.

### 2. Design (Overall Visual Language)

- **What you mean**: the “feel”: minimal, crisp, high contrast, lots of whitespace, rounded media, small mono metadata.
- **Mintlify lesson (observed)**:
  - Minimal chrome; strong hierarchy: hero image + title as primary attention.
  - Rounded corners are consistent and token-like (24px for hero, 16px for card thumbnails).
  - Metadata is “quiet” (mono uppercase, small size), while titles are clean and medium weight.
- **Implementation notes (SvelteKit)**:
  - Tailwind + CSS variables for tokens; keep UI components small and composable.
  - Avoid heavy component libraries; implement the specific widgets we need.

### 3. Theming (Light/Dark/System)

- **What you mean**: global theme with correct contrasts across backgrounds, text, borders, code blocks, and cards; ideally includes system preference.
- **Mintlify lesson (observed)**:
  - Theme switcher exists with **three modes**: system / light / dark.
  - The site toggles by applying an `html` class (`light` or `dark`).
  - Colors are tokenized (classes like `bg-background-soft`, `text-text-sub`, `text-brand`).
- **Implementation notes (SvelteKit)**:
  - Theme store that applies `document.documentElement.classList` (`light`/`dark`) and supports `system`.
  - A footer (or header) `ThemeSwitcher.svelte` with radio buttons.
  - Code blocks: Shiki dual theme (one-light + github-dark-default) to match Mintlify’s behavior.

### 4. Typeface, Sizes, Proportions

- **What you mean**: exact hierarchy for headings/body/meta, line-heights, tracking, and spacing.
- **Mintlify lesson (observed)**:
  - Sans font: **Inter** (body + titles).
  - Mono font: **Geist Mono** (category/read time/date + “SUMMARY” label + share heading).
  - Post title (`h1`) approx: `font-weight 600`, **40px** size, **44px** line-height, `letter-spacing ~ -0.8px`.
  - Content headings:
    - `h2`: **24px**, `font-weight 500`, `line-height 31.2px`, `letter-spacing -0.24px`, `scroll-mt-20`.
    - `h3`: **20px**, `font-weight 500`, `line-height 26px`, `letter-spacing -0.24px`.
  - Card title: **20px** / 30px, medium weight; excerpt: **14px** / 21px.
  - Meta pills (category/read): mono **12px**, uppercase, tracking **0.6px**.
- **Implementation notes (SvelteKit)**:
  - Install `@fontsource/inter` and `@fontsource/geist-mono`.
  - Define Tailwind typography scale for `h1/h2/h3/p` inside blog content.

### 5. Tags (Categories) + Filtering

- **What you mean**: tagging posts and browsing by tag via a tag bar and tag display on cards/posts.
- **Mintlify lesson (observed)**:
  - Uses a **category tab bar**: “All articles”, “AI trends”, “Announcements”, “For founders”, “Engineering”, “Design”, “Best practices”.
  - Category is shown above titles as a mono uppercase label (brand color).
  - Category filtering does **not** change URL on Mintlify (client-side tab state).
  - Note: category capitalization varies across older posts (“Best Practices” vs “Best practices”, “For Founders” vs “For founders”).
- **Implementation notes (SvelteKit)**:
  - Frontmatter fields: `category` (single) + optional `tags` (list).
  - UI: tabs filter the card grid; hero card remains fixed (matches Mintlify).
  - Normalize categories (slugify + canonical casing) to avoid duplicates.
  - We can optionally reflect filter in URL query `?category=` for shareability while keeping UX identical.

### 6. Color Contrasts

- **What you mean**: correct AA-level readability, subtle borders, muted text for metadata, brand accent usage.
- **Mintlify lesson (observed)**:
  - Brand accent used sparingly (category label).
  - Meta text uses reduced opacity (e.g., ~60% for secondary).
  - Borders are extremely subtle (e.g., ~7% opacity frame border on content images).
- **Implementation notes (SvelteKit)**:
  - Define tokens:
    - `--background-main`, `--background-soft`, `--background-invert`
    - `--text-main`, `--text-sub`, `--muted`
    - `--border-soft`
    - `--brand`
  - Use Tailwind color mapping to CSS vars: `text-text-sub`, `bg-background-soft`, etc.

### 7. View Widgets (Metadata Widgets)

- **What you mean**: the small informational UI bits: read time, date, category, maybe views; where they appear.
- **Mintlify lesson (observed)**:
  - Post header shows: `CATEGORY / N minutes read` (mono uppercase).
  - Post header also shows date (mono uppercase) beneath title.
  - Index hero shows `Date • N min read`.
  - No “view count” in the UI (from what we observed); the “widget” is mostly read time + date + category.
- **Implementation notes (SvelteKit)**:
  - Compute reading time from markdown word count (server-side).
  - Date formatting helper (e.g., “February 7, 2026”).
  - Optional extension: view counts can be added later via an analytics service; keep UI slot reserved but hidden by default.

### 8. Content Loading (Infinite Scroll / “Recycled Scroll”)

- **What you mean**: blog index should progressively load content; ideally efficient rendering as list grows.
- **Mintlify lesson (observed)**:
  - As you scroll down `/blog`, more post cards appear; there is **no Load More button**.
  - On mobile, the tag bar is horizontally scrollable with fade-mask edges and no scrollbar.
- **Implementation notes (SvelteKit)**:
  - Server: expose an endpoint `GET /blog/posts.json?offset=&limit=&category=` returning metadata.
  - Client: `IntersectionObserver` sentinel triggers fetch and appends.
  - Keep DOM light:
    - MVP: pagination + append (fast enough for ~100–300 posts).
    - Optional: virtualization later if needed (e.g. `@tanstack/svelte-virtual`).

### 9. Author Profile Avatar

- **What you mean**: consistent author identity visuals (avatar image, fallback initials, sizing, rounding).
- **Mintlify lesson (observed)**:
  - Avatars are circular with `rounded-full`, size **48x48** (`size-12`).
  - Some cards use author image `/blog/authors/*.webp`; fallback initials appear in snapshots for some cases.
- **Implementation notes (SvelteKit)**:
  - Authors registry (`src/lib/content/authors.ts`) with `id`, `name`, `title`, `avatar`.
  - `Avatar.svelte`:
    - render `<img>` if available
    - fallback to initials with subtle background.

### 10. Author Name + Title Showing

- **What you mean**: show author identity both on cards and on post page.
- **Mintlify lesson (observed)**:
  - Cards show author name + role underneath excerpt.
  - Post page sticky column shows author name + title above share buttons.
  - On mobile, author block moves into header area under title.
- **Implementation notes (SvelteKit)**:
  - `AuthorChip.svelte` used by cards and post layout.
  - Responsive rendering: `md:hidden` vs `hidden md:flex` blocks.

### 11. Article Formatting (Markdown Typesetting)

- **What you mean**: clean rendering for headings, paragraphs, lists, blockquotes, code, tables, and links.
- **Mintlify lesson (observed)**:
  - Headings have anchor links (each heading is linkable); `scroll-mt-20` offsets the fixed header.
  - Inline code has subtle background, padding, and radius.
  - Blockquotes use a left border and padding-left.
  - Code blocks use **Shiki** (`pre.shiki shiki-themes one-light github-dark-default`), ~14px font, 24px line-height, `border-radius: 6px`, `padding: 12px 16px`.
  - Tables exist in some posts; must be styled.
- **Implementation notes (SvelteKit)**:
  - Use `mdsvex` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`.
  - Use Shiki to highlight fenced code blocks; match Mintlify’s pre styling.
  - Add a small CSS layer for `.blog-prose` to tune margins and colors.

### 12. Content Format + Display

- **What you mean**: the pipeline from markdown/frontmatter to rendered post, including excerpt generation and cover images.
- **Mintlify lesson (observed)**:
  - Every post has a hero image at top (alt equals title), with rounded 24px, object-cover, max height ~360.
  - Most posts have an AI “SUMMARY” card after hero; at least one post (`/blog/mintlify-for-marketers`) does not.
- **Implementation notes (SvelteKit)**:
  - Frontmatter:
    - required: `title`, `date`, `category`, `author`, `cover`
    - optional: `excerpt`, `summaryAI`, `tags`, `featured`
  - Render hero image from `cover`.
  - Render summary card only when `summaryAI` is present.

### 13. Edges, Margins, Paddings

- **What you mean**: exact spacing tokens so the pages feel “Mintlify-tight” and not generic.
- **Mintlify lesson (observed)**:
  - Index:
    - hero has `my-12`, `p-8`, fixed height `h-[480px]`.
    - grid uses `gap-x-5` and `gap-y-12`, and `pb-32`.
  - Post:
    - container: `mt-[4.5rem]`, `pb-[7.5rem]`, `px-6`, `max-w-4xl`.
    - content + side: `gap-x-16`.
    - “More posts” cards are ~306px wide with thumbnail height ~190.
- **Implementation notes (SvelteKit)**:
  - Use these as baseline Tailwind classes to match spacing.
  - Avoid adding extra wrappers that break the rhythm.

### 14. Time-To-Read Estimation

- **What you mean**: show “N min read / N minutes read” consistently across list and post.
- **Mintlify lesson (observed)**:
  - Post header: “N minutes read”
  - Index hero: “N min read”
- **Implementation notes (SvelteKit)**:
  - `readingTimeMinutes = max(1, ceil(words / 200))`
  - Render as:
    - index: `${n} min read`
    - post header: `${n} minutes read`

### 15. RSS Feed + Icon Placement + Functionality

- **What you mean**: generate RSS, expose feed URL, add an icon button in the blog header row.
- **Mintlify lesson (observed)**:
  - RSS lives at `/feed.xml`.
  - The RSS icon sits to the right of the tag bar row; icon is small (~16px).
  - Feed is RSS 2.0 with `atom:link rel="self"` and per-item: title, description, link/guid, pubDate, category, author.
- **Implementation notes (SvelteKit)**:
  - Implement route `src/routes/feed.xml/+server.ts`.
  - Add RSS icon link next to tag bar.

### 16. Date Display

- **What you mean**: consistent formatting and placement.
- **Mintlify lesson (observed)**:
  - Post page: date is shown below title, mono uppercase, subdued color.
  - Suggested posts (bottom): show date under excerpt.
- **Implementation notes (SvelteKit)**:
  - Store date as ISO in frontmatter; format via `Intl.DateTimeFormat('en-US', { month:'long', day:'numeric', year:'numeric' })`.
  - For card suggestion: show date only (no author) to reduce clutter.

### 17. Hero Article

- **What you mean**: a featured post at top of index, bigger than normal cards.
- **Mintlify lesson (observed)**:
  - Large image card (full width) with overlay text and author block; height 480.
  - Appears regardless of which tab is selected (filter applies to the grid, not hero).
- **Implementation notes (SvelteKit)**:
  - Choose hero post: `featured: true` else newest by date.
  - `BlogHeroCard.svelte` overlay gradient + white title.

### 18. Size Of Each Article Thumbnail

- **What you mean**: consistent thumbnail aspect, border radius, and sizing for each card type.
- **Mintlify lesson (observed)**:
  - Index grid cards: thumbnail height **280px**, rounded **16px**, object-cover.
  - Suggested cards: thumbnail height **190px**, rounded **16px**, object-cover.
- **Implementation notes (SvelteKit)**:
  - `BlogCard` accepts `variant: 'default' | 'suggestion'` and sets fixed heights.

### 19. Picture Frame For Each Image + Corner Radius

- **What you mean**: images should have consistent framing; content images should look “mounted”.
- **Mintlify lesson (observed)**:
  - Hero image: rounded **24px**.
  - Card thumbnails: rounded **16px**.
  - In-content images (non-hero) often have:
    - `border-radius: ~10px`
    - a subtle 1px border (low opacity)
    - `cursor: zoom-in` (image zoom affordance).
- **Implementation notes (SvelteKit)**:
  - CSS: `.blog-prose img { border-radius: 10px; border: 1px solid var(--border-soft); cursor: zoom-in; }`
  - Lightbox: simple modal that opens on image click; close on escape/click outside.

### 20. Title (Placement + Styling)

- **What you mean**: title should be dominant in post header and clear in cards.
- **Mintlify lesson (observed)**:
  - Post H1: 40px/44, weight 600, negative tracking.
  - Card titles: 20px/30, weight 500.
- **Implementation notes (SvelteKit)**:
  - Tokenize title styles and reuse.

### 21. Tag Showing Top Of Article

- **What you mean**: show category/tag near top of post, above title.
- **Mintlify lesson (observed)**:
  - Category label appears above title as part of `CATEGORY / N minutes read`.
  - Category itself is brand-colored, mono uppercase.
- **Implementation notes (SvelteKit)**:
  - Render category as a clickable filter link (optional) or just label.

### 22. URL Paths

- **What you mean**: predictable routes for index, posts, and feeds.
- **Mintlify lesson (observed)**:
  - Index: `/blog`
  - Post: `/blog/<slug>`
  - RSS: `/feed.xml`
- **Implementation notes (SvelteKit)**:
  - `src/routes/blog/+page.svelte`
  - `src/routes/blog/[slug]/+page.svelte`
  - `src/routes/feed.xml/+server.ts`

### 23. AI Summary At The Top + Placement

- **What you mean**: show a short summary block above the body to help scanning and AI/SEO; visual should be distinct but subtle.
- **Mintlify lesson (observed)**:
  - Summary card (when present) is placed **immediately after the hero image**, before the main body.
  - Card style: `p-4`, `rounded-2xl`, soft background, “SUMMARY” label in mono uppercase.
  - It is **optional** (at least one post lacked it).
- **Implementation notes (SvelteKit)**:
  - Use frontmatter `summaryAI`.
  - Render `SummaryCard.svelte` only if set.

### 24. “More Posts To Read” + Recommendations

- **What you mean**: show a recommended section at end of every post.
- **Mintlify lesson (observed)**:
  - Heading: “More blog posts to read”
  - Exactly **2** suggested posts shown (in our sample set), using the smaller card variant.
- **Implementation notes (SvelteKit)**:
  - Recommend by:
    - same category first
    - then tag overlap
    - fallback to most recent excluding current
  - Render 2 cards with `variant='suggestion'`.

### 25. Blog Post Card Widgets (Thumbnail + Author + Title + Excerpt)

- **What you mean**: the main discoverability UI on index and in recommendations.
- **Mintlify lesson (observed)**:
  - Card structure:
    1) rounded thumbnail
    2) mono uppercase category label (brand color)
    3) title
    4) excerpt (muted)
    5) author avatar + name + title
  - Suggestion cards omit author and show date instead.
- **Implementation notes (SvelteKit)**:
  - `BlogCard.svelte` uses composition:
    - `CardMedia`, `CardMeta`, `CardTitle`, `CardExcerpt`, `CardFooter`.

### 26. Tags Bar At Top Of Main Blog Page

- **What you mean**: horizontal filter bar with strong active state.
- **Mintlify lesson (observed)**:
  - Tabs are pill-shaped with `px-3 py-1`, `rounded-full`, height ~31px.
  - Inactive: muted text.
  - Active: background invert + text invert.
  - Mobile: horizontally scrollable, scrollbar hidden, fade mask edges.
  - RSS icon sits to the right of this row.
- **Implementation notes (SvelteKit)**:
  - `TagTabs.svelte`:
    - uses a scroll container on small screens with a fade mask.
    - uses a simple `activeCategory` state.

### 27. Integration Into The Rest Of The SPA Site

- **What you mean**: blog should feel like part of the site (shared header/footer/theme), not a separate theme.
- **Mintlify lesson (observed)**:
  - Blog uses the same global header navigation and footer as the rest of the Mintlify marketing site.
  - Footer includes theme switcher.
- **Implementation notes (SvelteKit)**:
  - Root layout provides header/footer; blog pages are just routes beneath.
  - `src/routes/+layout.svelte` should import global CSS and render header/footer around `children`.

### 28. Responsive Design (Index + Post Page)

- **What you mean**: layout adapts cleanly to mobile; side column collapses into header; filters become horizontal scroll; cards become 1 column.
- **Mintlify lesson (observed)**:
  - Index: grid becomes 1 column on mobile.
  - Filters: scrollable pill tabs with fade.
  - Post page:
    - Desktop: author/share is sticky side column.
    - Mobile: author + share appear under title; side column is hidden.
- **Implementation notes (SvelteKit)**:
  - Tailwind `md:` breakpoints for layout switches.
  - Ensure touch-friendly tap targets for pills and share buttons.

### 29. Thumbnails + Visual Identity

- **What you mean**: cards must feel like one system; consistent rounded frames, consistent aspect/height; subtle hover feedback.
- **Mintlify lesson (observed)**:
  - Cards use rounded thumbnails and subtle overlay gradient on hover/focus (`bg-linear-to-t … opacity-0 group-hover:opacity-70`).
- **Implementation notes (SvelteKit)**:
  - Add hover/focus overlay gradient layer for thumbnails.
  - Use `focus-visible` outlines for keyboard navigation.

### 30. Back Button (Post → Blog Index)

- **What you mean**: clear “return to index” affordance in predictable location.
- **Mintlify lesson (observed)**:
  - Labeled “All articles” with a left arrow icon.
  - Placed above meta row.
- **Implementation notes (SvelteKit)**:
  - `BackLink.svelte` in post header, route to `/blog`.

### 31. “Share This Article” Buttons + SVG Icons

- **What you mean**: share UI that matches the design system; icons are inline SVG.
- **Mintlify lesson (observed)**:
  - 4 icon buttons, circular, `size-8` (32px).
  - Background is soft; icons are muted and brighten on hover.
  - Title “Share this article” is mono uppercase 12px.
- **Implementation notes (SvelteKit)**:
  - Use inline SVG icons (do not depend on remote image URLs).
  - Provide at least: X, LinkedIn, Copy link, Reddit (or Email).
  - Add `aria-label` for accessibility.

### 32. Anything Else Crucial

- **What you mean**: missing but important: SEO, OpenGraph, accessibility, performance.
- **Mintlify lesson (observed/inferred)**:
  - Headings are linkable (good for navigation + sharing).
  - RSS exists (distribution).
  - Strong keyboard focus styles on interactive elements.
  - Posts are highly scannable with summary + strong hierarchy.
- **Implementation notes (SvelteKit)**:
  - Per-post `<svelte:head>` with `title`, `meta description`, `og:*`, `twitter:*`.
  - `sitemap.xml` can be added later; RSS is required now.
  - Add keyboard focus rings for tabs/buttons.

---

## 2) Consolidated Findings (Categorized)

This section reorganizes the above into implementation-ready categories (instead of item order).

### A. Information Architecture + Routing

- `/blog`: index with hero + filters + infinite scroll grid.
- `/blog/[slug]`: post page with header meta, hero image, optional AI summary, markdown body, “More posts” section.
- `/feed.xml`: RSS feed (RSS 2.0 + atom self link).

### B. Content Model (Frontmatter)

Recommended required frontmatter:

```yaml
title: "..."
date: "2026-02-07" # ISO
category: "Best Practices"
author: "peri" # author id
cover: "/images/blog/real-llms.png"
excerpt: "..." # optional, else derive
summaryAI: "..." # optional
tags: ["llms.txt", "SEO"] # optional
featured: false # optional
draft: false # optional
```

### C. Global Tokens (Theme + Typography)

- Fonts:
  - Sans: Inter
  - Mono: Geist Mono
- Theme modes: `system`, `light`, `dark`
- Key sizes:
  - Post H1: 40/44, 600, tracking -0.8
  - H2: 24/31.2, 500, tracking -0.24
  - H3: 20/26, 500
  - Body: 16 with generous line-height (Mintlify often uses ~28px for paragraphs)
  - Meta: mono 12 uppercase tracking 0.6

### D. Components (UI System)

- Blog index:
  - `BlogHeroCard`
  - `TagTabs` (scrollable on mobile)
  - `BlogCard` (default variant)
  - `RssIconLink`
  - `InfiniteScrollSentinel`
- Post page:
  - `BackLink`
  - `PostMetaRow` (category / read-time)
  - `PostDate`
  - `PostHeroImage`
  - `SummaryCard` (optional)
  - `ShareButtons` (desktop sticky + mobile header)
  - `AuthorBlock`
  - `MorePosts` (2 suggestion cards)
  - `ImageLightbox` (for zoomable content images)

### E. Media Styling Rules

- Hero image: `rounded-3xl` (24px), object-cover, max height ~360.
- Card thumbnail: `rounded-2xl` (16px), fixed height 280 (default) / 190 (suggestion).
- In-content images:
  - radius ~10px
  - subtle border
  - zoom cursor + lightbox.

### F. Performance + Loading

- Index uses infinite scroll; fetch next pages via JSON endpoint.
- Keep SSR fast: load only metadata for index; load full markdown only on post page.

### G. SEO + Syndication

- RSS at `/feed.xml`.
- Per-post meta tags + canonical.

---

## 3) Fully Detailed Implementation Plan (Workstreams)

Workstreams are ordered to keep momentum and reduce rework.

### Workstream 1: Project + Tooling Baseline

1. Add Tailwind + typography plugin; set up `src/app.css` tokens for light/dark.
2. Add Inter + Geist Mono fonts (self-hosted via `@fontsource/*`).
3. Add global layout with header/footer and theme switcher.

Deliverables:
- `tailwind.config.cjs`, `postcss.config.cjs`, `src/app.css`
- `src/lib/components/ThemeSwitcher.svelte`
- `src/lib/stores/theme.svelte.ts` (or similar)

### Workstream 2: Content Pipeline (Markdown + Frontmatter)

1. Add `mdsvex` to compile `.md` to Svelte components.
2. Add remark/rehype:
   - `remark-gfm` (tables, task lists)
   - `rehype-slug` + `rehype-autolink-headings` (heading permalinks)
3. Add Shiki highlighting to match Mintlify’s dual theme approach.
   - Note: in this repo we intentionally **disable mdsvex’s metadata script injection** by setting `mdsvexConfig.frontmatter.parse` to return `undefined`, and we parse frontmatter with `gray-matter` in `src/lib/server/blog.ts`. This avoids `script_duplicate` errors when combining mdsvex frontmatter exports with `@shikijs/rehype`.
4. Implement server utilities:
   - load all posts via `import.meta.glob`
   - parse frontmatter (gray-matter)
   - compute `readingTimeMinutes`, `excerpt`, `date` formatting
   - expose `getAllPosts()`, `getPostBySlug()`
5. Author registry and lookup.

Deliverables:
- `svelte.config.js` updated for mdsvex
- `src/lib/server/blog.ts` (loader + model)
- `src/lib/content/authors.ts`
- sample posts in `src/content/blog/*.md`

### Workstream 3: Blog Index UI + Infinite Scroll

1. `/blog` SSR loads:
   - hero post
   - initial page of card posts
   - category list
2. Implement tag tabs:
   - active state pill styling
   - mobile scroll + fade mask
3. Implement card grid:
   - default card variant matches Mintlify structure
4. Implement JSON pagination endpoint to load more.

Deliverables:
- `src/routes/blog/+page.server.ts`
- `src/routes/blog/+page.svelte`
- `src/routes/blog/posts.json/+server.ts` (or similar)
- `src/lib/components/blog/TagTabs.svelte`, `BlogCard.svelte`, `BlogHeroCard.svelte`

### Workstream 4: Post Page UI (Layout + Summary + Share + More Posts)

1. `/blog/[slug]` loads post component + metadata + recommended posts.
2. Render header:
   - back link
   - category/read-time row
   - title + date
3. Render body layout:
   - hero image
   - optional AI summary card
   - markdown content
4. Render “More posts to read” (2 suggestion cards).
5. Share UI:
   - desktop: sticky side panel
   - mobile: header block under title
   - implement share links + copy-to-clipboard

Deliverables:
- `src/routes/blog/[slug]/+page.server.ts`
- `src/routes/blog/[slug]/+page.svelte`
- `src/lib/components/blog/PostHeader.svelte`, `SummaryCard.svelte`, `ShareButtons.svelte`, `MorePosts.svelte`

### Workstream 5: Media UX (Image Framing + Lightbox)

1. Apply CSS for in-content images (frame + radius + zoom cursor).
2. Add a lightweight `ImageLightbox`:
   - opens when clicking content images
   - supports escape key, backdrop close
   - supports scroll locking

Deliverables:
- `src/lib/components/blog/ImageLightbox.svelte`
- a small enhancement script in post page that binds click handlers to `.blog-prose img`.

### Workstream 6: RSS Feed

1. Generate RSS 2.0 XML at `/feed.xml`.
2. Ensure item fields match Mintlify:
   - title, description, link/guid, pubDate, category, author
   - atom:link self
3. Add RSS icon link to blog index header row.

Deliverables:
- `src/routes/feed.xml/+server.ts`
- `src/lib/server/rss.ts`

### Workstream 7: Polish (A11y + SEO + QA)

1. Ensure focus-visible rings on tabs/buttons.
2. Add per-post meta tags for SEO and social.
3. Validate:
   - RSS validates
   - dark mode readability for prose + code blocks
   - mobile layout matches fold behavior

Deliverables:
- `src/lib/server/seo.ts` helpers
- updates in blog routes for `<svelte:head>`

---

## Acceptance Checklist (Mintlify-Consistency Targets)

- Blog index:
  - hero card (480px height, rounded 24, overlay text)
  - tag tabs with pill active state; scrollable on mobile with fade mask
  - 2-col grid on desktop, 1-col on mobile
  - infinite scroll loads more posts
  - RSS icon links to `/feed.xml`
- Post page:
  - back link (“All articles”) at top
  - meta row: `CATEGORY / N minutes read` (mono uppercase)
  - title (40px) + date (mono uppercase)
  - hero image (rounded 24, max height ~360)
  - optional AI summary card (rounded 16, soft background)
  - markdown rendering with heading anchors, shiki code blocks, styled tables/quotes
  - sticky author/share column on desktop; folded into header on mobile
  - “More blog posts to read” with 2 suggestion cards

---

## 4) Plan Status (As Of 2026-02-09)

### Workstream 1: Foundations (SvelteKit + Theme)

Status: Done

Implementation notes:
- Theme-aware light/dark/system is implemented via an early script in `src/app.html` plus a runtime store in `src/lib/stores/theme.ts`.
- Global tokens live in `src/app.css` and are applied via `html.light` / `html.dark`.

### Workstream 2: Content Pipeline (Markdown + Frontmatter)

Status: Done

Implementation notes:
- `.md` is compiled via mdsvex in `svelte.config.js` and server-rendered to HTML strings for the post route.
- Frontmatter is parsed with `gray-matter` in `src/lib/server/blog.ts` (not mdsvex metadata exports) to avoid `script_duplicate` issues with Shiki.

### Workstream 3: Blog Index UI + Infinite Scroll

Status: Done

Implementation notes:
- `/blog` uses SSR for hero + initial list and a paginated JSON endpoint for additional loads.
- Category pills are scrollable on mobile with edge fade masking (`fade-mask-x` in `src/app.css`).

### Workstream 4: Post Page UI (Layout + Summary + Share + More Posts)

Status: Done

Implementation notes:
- Desktop: sticky author/share rail; Mobile: author + share fold into the main column.
- AI summary is conditional on `summaryAI` in frontmatter.

### Workstream 5: Media UX (Image Framing + Lightbox)

Status: Done

Implementation notes:
- In-content images are framed via typography + `.blog-prose` tweaks and open a simple lightbox on click.

### Workstream 6: RSS Feed

Status: Done

Implementation notes:
- RSS lives at `src/routes/feed.xml/+server.ts`.
- Auto-discovery is provided via `<link rel="alternate">` in `src/routes/+layout.svelte`.
- The plan mentioned `src/lib/server/rss.ts`; we inlined RSS generation in the route for simplicity.

### Workstream 7: Polish (A11y + SEO + QA)

Status: Done (with ongoing content-driven tweaks as new post types are added)

Implementation notes:
- Per-post SEO meta tags are set in `src/routes/blog/[slug]/+page.svelte`.
- E2E coverage is added via Playwright in `tests/blog.spec.ts` and includes theme toggling, RSS, and mobile folding checks.
- Markdown edge cases are validated via `src/content/blog/markdown-kitchen-sink.md` and table/URL hardening in `src/app.css`.
