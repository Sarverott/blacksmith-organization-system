#!/usr/bin/env bash
# Opens the pull request <head> → <base>, unless one is open already (it follows
# <head> by itself) or <head> has nothing <base> lacks. Its description lists the
# commits and links the run whose checks it passed. Outputs url=<pull request>.
# Usage: pull-request.sh <head, e.g. revision> <base, e.g. master>   (needs GH_TOKEN)
source "$(dirname "$0")/_common.sh"
head="${1:?head branch}"
base="${2:?base branch}"

git fetch -q origin "$head" "$base"
open=$(gh pr list --head "$head" --base "$base" --state open --json url --jq '.[0].url // empty')
if [ -n "$open" ]; then
  echo "open already, it follows $head: $open"
  output url "$open"
  exit 0
fi
if [ "$(git rev-list --count "origin/$base..origin/$head")" = 0 ]; then
  echo "$head has nothing $base lacks"
  exit 0
fi

version=$(git show "origin/$head:package.json" | jq -r .version)
run="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-}"
body=$(
  echo "The routine's step $head → $base: merging it releases v$version."
  echo
  if [ -n "${GITHUB_RUN_ID:-}" ]; then echo "Checked before it was opened: $run"; echo; fi
  echo "## Commits"
  echo
  git log --no-merges --format='- %s (%h)' "origin/$base..origin/$head"
)
url=$(gh pr create --head "$head" --base "$base" --title "v$version: $head → $base" --body "$body")
echo "opened: $url"
output url "$url"
