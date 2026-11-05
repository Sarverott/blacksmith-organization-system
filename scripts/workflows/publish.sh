#!/usr/bin/env bash
# npm publish of the checked-out package, unless that version is there already:
#   npmjs   npmjs.org, with provenance (needs NODE_AUTH_TOKEN = NPM_TOKEN of publish-env;
#           without it, says so and stops)
#   github  GitHub Packages, as @<owner>/<name> (a registry there takes scoped names
#           only; package.json is renamed in the workflow's checkout, never committed)
# under the npm tag `next` for a pre-release, `latest` otherwise.
# Usage: publish.sh npmjs|github next|latest
source "$(dirname "$0")/_common.sh"
registry="${1:?npmjs|github}"
dist_tag="${2:?next|latest}"

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
  echo "::warning::no token for $registry - nothing is published"
  exit 0
fi

# where: the registry flags, for npm view and npm publish alike
where=()
flags=(--tag "$dist_tag")
case "$registry" in
  npmjs)
    flags+=(--provenance)
    ;;
  github)
    owner="${GITHUB_REPOSITORY_OWNER:?the repository owner (GITHUB_REPOSITORY_OWNER)}"
    scope="@${owner,,}"
    npm pkg set "name=$scope/$(jq -r .name package.json)"
    # on the command line: it beats the scope's registry in the project's .npmrc
    where+=("--$scope:registry=https://npm.pkg.github.com")
    ;;
  *)
    echo "unknown registry: $registry (npmjs|github)" >&2
    exit 2
    ;;
esac

name=$(jq -r .name package.json)
version=$(jq -r .version package.json)
if npm view "$name@$version" version "${where[@]}" > /dev/null 2>&1; then
  echo "$name@$version is on $registry already"
  exit 0
fi
npm publish "${where[@]}" "${flags[@]}"
