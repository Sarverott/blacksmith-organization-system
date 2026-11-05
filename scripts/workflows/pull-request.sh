#!/usr/bin/env bash
# Opens the pull request <head> → <base>, unless <head> has nothing <base> lacks. One
# open already follows <head> by itself; its title and description are brought up to
# the version it now releases. The description lists the commits and links the run
# whose checks it passed. Outputs url=<pull request>.
# Usage: pull-request.sh <head, e.g. revision> <base, e.g. master>   (needs GH_TOKEN)
source "$(dirname "$0")/_common.sh"
head="${1:?head branch}"
base="${2:?base branch}"

git fetch -q origin "$head" "$base"
if [ "$(git rev-list --count "origin/$base..origin/$head")" = 0 ]; then
  echo "$head has nothing $base lacks"
  exit 0
fi

version=$(git show "origin/$head:package.json" | jq -r .version)
title="v$version: $head → $base"
run="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-}"
body=$(
  echo "The routine's step $head → $base: merging it releases v$version."
  echo
  if [ -n "${GITHUB_RUN_ID:-}" ]; then echo "Checked before it was opened: $run"; echo; fi
  echo "## Commits"
  echo
  git log --no-merges --format='- %s (%h)' "origin/$base..origin/$head"
)

open=$(gh pr list --head "$head" --base "$base" --state open --json url --jq '.[0].url // empty')
if [ -n "$open" ]; then
  # it follows <head>, so it releases what <head> holds now (PR #9 said v1.4.9, released v1.4.10)
  gh pr edit "$open" --title "$title" --body "$body" >/dev/null
  echo "open already, it follows $head - now $title: $open"
  output url "$open"
  exit 0
fi
url=$(gh pr create --head "$head" --base "$base" --title "$title" --body "$body")
echo "opened: $url"
output url "$url"
