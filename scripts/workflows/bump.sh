#!/usr/bin/env bash
# Bumps the version for work landed on <station> (bos flow bump, .github/bos.json),
# commits the bump and pushes it to <station>. Nothing when the version is not
# released yet or the station bumps nothing. Outputs bumped=true|false, version=...
# Usage: bump.sh <station> [what the commit says, e.g. "landed on revision"]
source "$(dirname "$0")/_common.sh"
station="${1:?station}"
why="${2:-on $station}"

out=$(node src/cli.ts flow bump "$station" --json)
echo "$out"
if [ "$(jq -r .action <<< "$out")" != bumped ]; then
  output bumped false
  output version "$(jq -r .from <<< "$out")"
  exit 0
fi

bot_identity
git commit -qam "chore(release): bump $(jq -r '.from + " → " + .to' <<< "$out") ($why)"
# pushed with the workflow's token, it starts no other workflow
git push origin "HEAD:$station"
output bumped true
output version "$(jq -r .to <<< "$out")"
