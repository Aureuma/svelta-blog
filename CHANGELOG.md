# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [v0.7.0] - 2026-04-26
### Changed
- Standardized the repository on a single root package version and removed the internal workspace package version.
- Switched local workspace tooling and release metadata to pnpm.
- Clarified repository rules for Fort-backed secrets, ticket hygiene, and predictable file paths.

### Fixed
- Built the core package before Svelte checks so local verification uses generated package output.
- Refreshed blog end-to-end selectors for the current rendered UI.

## [v0.5.0] - 2026-03-14
### Changed
- Split the combined `svelta` repository into a dedicated blog repository.
- Renamed the public package to `@aureuma/svelta-blog`.
- Removed docs routes, docs content, and docs runtime/export surface from this repository.
- Kept the blog site, blog package primitives, RSS feed, and release workflows focused on editorial publishing.

## [v0.4.1] - 2026-03-12
### Changed
- Updated the blog index to always load additional posts on scroll instead of relying on optional pagination controls.
- Reattached the infinite-scroll observer correctly after search state changes so auto-loading resumes reliably.
- Simplified the blog experience configuration and docs by removing the public `infiniteScroll` toggle.
