#!/usr/bin/env bash
# Merges <source> into the branch <target> and pushes it: a bump of revision, or
# master after a release, back into development. A conflict fails loudly.
# Usage: merge-into.sh <source ref, e.g. origin/master> <target branch>
source "$(dirname "$0")/_common.sh"
source_ref="${1:?source ref}"
target="${2:?target branch}"

bot_identity
# the version of package.json and its lock merges by BOS (.gitattributes)
git config merge.bos-version.driver 'node src/cli.ts flow merge-version %O %A %B'
git fetch origin "$target"
git checkout -B "$target" "origin/$target"
git merge --no-edit "$source_ref"
git push origin "$target"
