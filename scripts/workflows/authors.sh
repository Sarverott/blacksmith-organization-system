#!/usr/bin/env bash
# Names every entity of the commits in .github/AUTHORS (bos project authors),
# commits the file when it changed and pushes it to <branch>.
# Outputs changed=true|false.
# Usage: authors.sh <branch, e.g. revision>
source "$(dirname "$0")/_common.sh"
branch="${1:?branch}"

node src/cli.ts project authors
if git diff --quiet -- .github/AUTHORS && ! git ls-files --others --exclude-standard --error-unmatch .github/AUTHORS > /dev/null 2>&1; then
  output changed false
  exit 0
fi

bot_identity
git add .github/AUTHORS
git commit -qm "chore(authors): new entities of the commits named in .github/AUTHORS"
# pushed with the workflow's token, it starts no other workflow
git push origin "HEAD:$branch"
output changed true
