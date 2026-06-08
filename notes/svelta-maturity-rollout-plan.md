# Svelta Maturity Rollout - Execution Notes

## Objective
- Validate `svelta-blog` and `svelta-docs` with `si surf` against local package demos and user-facing deployments.
- Ship parity-ready polish, publish new package versions, and roll consumers forward.

## 2026-06-08 Run
- Local checks completed for:
  - `http://127.0.0.1:4173/blog`
  - `http://127.0.0.1:4173/blog/tags`
  - `http://127.0.0.1:4173/blog/markdown-kitchen-sink`
  - `http://127.0.0.1:4174/docs`
  - `http://127.0.0.1:4174/docs/search`
  - `http://127.0.0.1:4174/docs/NUCLEUS`
- Remote checks completed for:
  - `https://aureuma.ai/`
  - `https://aureuma.ai/docs`
  - `https://docs.aureuma.ai/docs`
  - `https://rm-dev.releasemind.ai/blog`
  - `https://rm-dev.releasemind.ai/posts`
  - `https://www.lingospeak.ai/blog`
  - `https://www.lingospeak.ai/`
- Evidence screenshots generated in `/tmp/goal_local_*`, `/tmp/goal_remote_seq_*`, `/tmp/goal_mobile_*`.

## Concrete fixes
- Added explicit `<svelte:head>` metadata on `src/routes/blog/tags/+page.svelte`:
  - `title: Tags | svelta Blog`
  - `description` for search/SEO parity and UX polish.
- Bumped package versions for release:
  - `svelta-blog`: `0.7.10 -> 0.7.11`

## Validation
- `corepack pnpm check` ✅
- `CI=true corepack pnpm test:server` ✅
- `corepack pnpm build:core` ✅

## Blocking items
- `corepack pnpm publish` for both repos reaches tarball generation but fails with `npm error code EOTP`.
- `https://aureuma.ai/docs` resolves to Aureuma home context (not docs); Mintlify parity is validated against `https://docs.aureuma.ai/docs`.
