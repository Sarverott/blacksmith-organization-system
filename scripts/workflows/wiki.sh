#!/usr/bin/env bash
# The docs of <tag> into the GitHub wiki (scripts/gh-wiki.py), committed and pushed.
# Usage: wiki.sh <tag>   (needs TOKEN: a token that can push the wiki)
source "$(dirname "$0")/_common.sh"
tag="${1:?tag}"

git clone "https://x-access-token:${TOKEN:?}@github.com/${GITHUB_REPOSITORY:?}.wiki.git" docs/.gh-wiki
uv run --project docs python scripts/gh-wiki.py

cd docs/.gh-wiki || exit
bot_identity
git add -A
if git diff --cached --quiet; then
  echo "the wiki is up to date"
  exit 0
fi
git commit -qm "docs: sync from $tag"
git push
