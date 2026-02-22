# @aureuma/blogkit Changelog

## 0.1.1

### Patch Changes

- [`e1cacf4`](https://github.com/Aureuma/svelta/commit/e1cacf4013cc8d44867a506ca5dea6e05cd96653) Thanks [@SHi-ON](https://github.com/SHi-ON)! - Prepare @aureuma/blogkit for the first public npm release.

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-02-22

### Added

- Added `createRawBlog` support for raw markdown module sources.
- Added Viva frontmatter and author parser helpers:
  - `parseVivaBlogFrontmatter`
  - `parseVivaAuthorFrontmatter`
  - `parseMarkdownAuthorMap`
  - `parseVivaAuthorProfiles`
- Added exported Viva-focused types for frontmatter and author profiles.

### Changed

- Expanded `@aureuma/svelta/server` exports to support Viva app migration without custom blog parsing code.
