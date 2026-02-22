# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [v0.1.0] - 2026-02-22
### Added
- Added raw markdown blog ingestion through `createRawBlog` for repository-driven blog content.
- Added Viva-compatible frontmatter parsing helpers (`parseVivaBlogFrontmatter`, `parseVivaAuthorFrontmatter`, `parseVivaAuthorProfiles`, and `parseMarkdownAuthorMap`).
- Added release automation docs and scripts under `docs/` and `tools/release/`.
- Added GitHub workflow `NPM Release Assets` to attach npm tarballs and checksums to published releases.

### Changed
- Standardized release process around annotated tags and GitHub Releases (`vX.Y.Z`).
- Aligned root package versioning with the internal core package for release consistency.
