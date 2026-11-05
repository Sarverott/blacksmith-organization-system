#!/usr/bin/env bash
# Releases the version in package.json unless its tag exists: an annotated tag
# v<version> and the GitHub release, with notes generated from the pull requests.
# Outputs tag=v<version>, or nothing when it is released already.
# Usage: release.sh [--prerelease]   (needs GH_TOKEN)
source "$(dirname "$0")/_common.sh"

tag="v$(jq -r .version package.json)"
if git rev-parse -q --verify "refs/tags/$tag" > /dev/null; then
  echo "$tag is released already"
  exit 0
fi

bot_identity
git tag -a "$tag" -m "$tag"
git push origin "$tag"
gh release create "$tag" --title "$tag" --generate-notes --verify-tag "$@"
output tag "$tag"
