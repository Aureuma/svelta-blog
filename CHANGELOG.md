# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

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
