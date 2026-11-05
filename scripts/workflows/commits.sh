#!/usr/bin/env bash
# Commit messages from <base> (exclusive) to HEAD, but never older than the commit
# that brought commitlint in: the legacy history before it is not conventional.
# Usage: commits.sh <base commit>
source "$(dirname "$0")/_common.sh"
base="${1:?base commit}"

from="$base"
since=$(git log --diff-filter=A --format=%H -1 -- 'commitlint.config.*')
if [ -n "$since" ] && ! git merge-base --is-ancestor "$since" "$base"; then
  echo "commitlint came in with ${since:0:7}, after the base: checking from there"
  from="$since"
fi
npx commitlint --from "$from" --to HEAD --verbose
