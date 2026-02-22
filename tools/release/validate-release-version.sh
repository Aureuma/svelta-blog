#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Validate release tag format and parity with package versions.

Usage:
  tools/release/validate-release-version.sh --tag <vX.Y.Z[-suffix]>
USAGE
}

die() {
  echo "error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing required command: $1"
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"

require_cmd node

tag=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag)
      tag="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[[ -n "${tag}" ]] || die "--tag is required"
if [[ ! "${tag}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
  die "tag must match vX.Y.Z (optionally with a prerelease/build suffix), got: ${tag}"
fi

version="${tag#v}"

read_json_version() {
  local json_path="$1"
  node -e "const fs = require('fs'); const p = process.argv[1]; const pkg = JSON.parse(fs.readFileSync(p, 'utf8')); process.stdout.write(String(pkg.version || ''));" "$json_path"
}

root_version="$(read_json_version "${repo_root}/package.json")"
[[ -n "${root_version}" ]] || die "could not parse version from package.json"
if [[ "${root_version}" != "${version}" ]]; then
  die "package.json has ${root_version}, but release tag is ${tag}"
fi

echo "release tag and package versions are aligned (${tag})"
