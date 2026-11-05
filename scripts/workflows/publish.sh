#!/usr/bin/env bash
# npm publish with provenance: under `next` for a pre-release, `latest` otherwise.
# Usage: publish.sh next|latest   (needs NODE_AUTH_TOKEN; without it, says so and stops)
source "$(dirname "$0")/_common.sh"
dist_tag="${1:?next|latest}"

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
  echo "::warning::no NPM_TOKEN (environment publish-env) - nothing is published"
  exit 0
fi
version=$(jq -r .version package.json)
if npm view "blacksmith-organization-system@$version" version > /dev/null 2>&1; then
  echo "$version is on npm already"
  exit 0
fi
npm publish --provenance --tag "$dist_tag"
