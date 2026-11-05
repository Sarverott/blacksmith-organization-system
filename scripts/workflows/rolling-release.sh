#!/usr/bin/env bash
# A release that moves: the tag <name> is set to <ref> (force-pushed) and its GitHub
# release follows, its notes and files replaced. Never GitHub's "Latest": that stays
# the newest versioned release.
#   latest    the last published release (loop-master-release-and-publish.yml)
#   nightly   early pre-release of what landed on revision (loop-revision-...)
#   stable    [TODO] passes the tests of deployment and of dependent projects, on releasing
# Usage: rolling-release.sh <name> <ref> <prerelease true|false> <notes> [files...]
#   (needs GH_TOKEN with contents: write)
source "$(dirname "$0")/_common.sh"
name="${1:?name}"
ref="${2:?ref}"
prerelease="${3:?true|false}"
notes="${4:?notes}"
shift 4

sha=$(git rev-parse "$ref^{commit}")
git tag -f "$name" "$sha"
git push -f origin "refs/tags/$name"

title="$name ($(git show "$sha:package.json" | jq -r .version), ${sha:0:7})"
if gh release view "$name" > /dev/null 2>&1; then
  gh release edit "$name" --title "$title" --notes "$notes" --prerelease="$prerelease" --latest=false
  gh release view "$name" --json assets --jq '.assets[].name' | while read -r asset; do
    gh release delete-asset "$name" "$asset" --yes
  done
else
  flags=(--title "$title" --notes "$notes" --latest=false --verify-tag)
  if [ "$prerelease" = true ]; then flags+=(--prerelease); fi
  gh release create "$name" "${flags[@]}"
fi
if [ "$#" -gt 0 ]; then gh release upload "$name" "$@" --clobber; fi
echo "$name → ${sha:0:7}: $(release_url "$name")"
