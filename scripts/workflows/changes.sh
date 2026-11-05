#!/usr/bin/env bash
# What a push changed: outputs code=true|false and docs=true|false (checks-on-push-changed-parts.yml).
# Usage: changes.sh <commit before the push>   (empty, zeros or unknown: everything)
source "$(dirname "$0")/_common.sh"
before="${1:-}"

if [ -z "$before" ] || [ "$before" = 0000000000000000000000000000000000000000 ] \
  || ! git cat-file -e "$before^{commit}" 2>/dev/null; then
  echo "a new branch, a forced push or a run by hand: everything"
  output code true
  output docs true
  exit 0
fi

files=$(git diff --name-only "$before" HEAD)
printf '%s\n' "$files"
code=false
docs=false
# code: anything that is not documentation
grep -qvE '^(docs/|resources/docs-templates/|scripts/gh-wiki\.py$|[^/]*\.md$|\.github/[^/]*\.md$)' <<< "$files" && code=true
grep -qE '^(docs/|README\.md$)' <<< "$files" && docs=true
output code "$code"
output docs "$docs"
