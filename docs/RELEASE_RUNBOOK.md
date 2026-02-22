# Release Runbook

This repository uses Git tags + GitHub Releases + npm publish. Follow this order to avoid partial or inconsistent releases.

## Preconditions

- Local worktree is clean: `git status`
- CI is green on `main`
- You can push tags and create releases in GitHub
- You are authenticated to npm for `@aureuma`
- npm publish access is confirmed:
  - `npm whoami`
  - `npm access ls-packages <your-npm-user-or-team> | grep '@aureuma/svelta\|@aureuma/blogkit'`

## 1. Decide Version

- Pick the next semver tag, for example `vX.Y.Z`.
- Keep `v0.x.y` progression consistent with existing tags.

## 2. Update Changelog and Versions

1. Edit `CHANGELOG.md` (repo-level release notes).
1. Edit `packages/blogkit/CHANGELOG.md` (package-level notes).
1. Update `package.json` version to `X.Y.Z`.
1. Update `packages/blogkit/package.json` version to `X.Y.Z`.
1. Regenerate lockfile metadata:
   - `npm install --package-lock-only`

## 3. Commit

1. Commit release prep changes:
   - `git add CHANGELOG.md package.json package-lock.json packages/blogkit/CHANGELOG.md packages/blogkit/package.json`
   - `git commit -m "release: vX.Y.Z"`

## 4. Tag

1. Create an annotated tag:
   - `git tag -a vX.Y.Z -m "vX.Y.Z"`

## 5. Push

1. Push commit(s):
   - `git push origin main`
1. Push tag:
   - `git push origin vX.Y.Z`

## 5.5 Local Release-Assets Preflight

Run:
- `tools/release/validate-release-version.sh --tag vX.Y.Z`
- `tools/release/build-npm-release-assets.sh --version vX.Y.Z --out-dir .artifacts/release-preflight`

This confirms package tarballs and checksum generation before publishing a GitHub Release.

## 6. Publish npm Packages (npmjs)

1. Publish the root package:
   - `npm publish --access public`
1. Publish blogkit workspace package:
   - `npm publish -w @aureuma/blogkit --access public`
1. Verify both publishes resolved on npmjs:
   - `npm view @aureuma/svelta version`
   - `npm view @aureuma/blogkit version`

## 7. Create GitHub Release

1. In GitHub UI: Releases -> "Draft a new release".
1. Choose tag `vX.Y.Z` on `main`.
1. Title format:
   - `vX.Y.Z - <short title>`
1. Body:
   - Paste the release section from `CHANGELOG.md`.
   - Add short upgrade notes if behavior changed.
1. Publish the release.
1. After publish, wait for workflow `NPM Release Assets` to complete (it uploads `.tgz` archives + checksums).

## 8. Post-release Checks

- Verify tag and release:
  - `gh release view vX.Y.Z --json tagName,name,publishedAt`
- Verify uploaded assets:
  - `gh release view vX.Y.Z --json assets --jq '.assets[].name'`
- Verify npm versions:
  - `npm view @aureuma/svelta version`
  - `npm view @aureuma/blogkit version`

Expected release assets:
- `aureuma-svelta-<version>.tgz`
- `aureuma-blogkit-<version>.tgz`
- `checksums.txt`
