# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [v0.3.1] - 2026-03-01
### Fixed
- Removed consumer-breaking `postinstall` workspace build step from the published package so downstream `npm install @aureuma/svelta` works in non-workspace repos.

## [v0.3.0] - 2026-02-28
### Added
- Added first-class pattern configuration APIs for docs/blog experiences:
  - `createDocsPatternConfig`
  - `createBlogPatternConfig`
  - `createSveltaPatternConfig`
  - `resolveDocsEditUrl`
- Added exported pattern-related types:
  - `SveltaNavItem`
  - `SveltaDocsPatternConfig`
  - `SveltaBlogPatternConfig`
  - `SveltaPatternConfig`
- Added runtime app config wiring for docs/blog behavior (search, TOC, feedback prompt, edit links, pagination, RSS visibility).

### Changed
- Updated docs experience screens to consume centralized pattern config values.
- Updated blog pagination endpoints and UI to use pattern-configured page-size and infinite-scroll toggles.
- Expanded Playwright stability and assertions for docs pattern UI and edit-link behavior.

## [v0.1.1] - 2026-02-22
### Added
- Added SI-browser-based end-to-end validation coverage for key website features on a live preview deployment.

### Changed
- Consolidated package surface to `@aureuma/svelta` and moved reusable internals under private workspace `@aureuma/svelta-core`.
- Removed separate `@aureuma/blogkit` release flow and simplified release tooling/docs to a single npm package publish.
- Removed legacy external-brand references, filenames, and documentation artifacts from repository content.

## [v0.1.0] - 2026-02-22
### Added
- Added raw markdown blog ingestion through `createRawBlog` for repository-driven blog content.
- Added Viva-compatible frontmatter parsing helpers (`parseVivaBlogFrontmatter`, `parseVivaAuthorFrontmatter`, `parseVivaAuthorProfiles`, and `parseMarkdownAuthorMap`).
- Added release automation docs and scripts under `docs/` and `tools/release/`.
- Added GitHub workflow `NPM Release Assets` to attach npm tarballs and checksums to published releases.

### Changed
- Standardized release process around annotated tags and GitHub Releases (`vX.Y.Z`).
- Aligned root package versioning with the internal core package for release consistency.
