#!/usr/bin/env bash
# Read the Docs after a release: the version of <tag> activated and built, and
# latest rebuilt. RTD builds pushes by itself; this makes the tag a version of its
# own. Usage: readthedocs.sh <tag>   (needs READTHEDOCS_API_TOKEN)
source "$(dirname "$0")/_common.sh"
tag="${1:?tag}"
project="${READTHEDOCS_PROJECT:-blacksmith-organization-system}"
api="https://readthedocs.org/api/v3/projects/$project"
auth=(-H "Authorization: Token ${READTHEDOCS_API_TOKEN:?}")
slug=$(tr '[:upper:]' '[:lower:]' <<< "$tag")

curl -fsS -X POST "${auth[@]}" "$api/versions/latest/builds/" > /dev/null
echo "latest: build started"

# RTD learns of the tag from GitHub's webhook; give it a moment
for _ in 1 2 3 4 5 6; do
  if curl -fsS "${auth[@]}" "$api/versions/$slug/" > /dev/null 2>&1; then
    curl -fsS -X PATCH "${auth[@]}" -H 'Content-Type: application/json' \
      -d '{"active": true, "hidden": false}' "$api/versions/$slug/"
    curl -fsS -X POST "${auth[@]}" "$api/versions/$slug/builds/" > /dev/null
    echo "$slug: activated, build started"
    exit 0
  fi
  sleep 10
done
echo "::warning::Read the Docs does not know $slug yet; activate it on readthedocs.org"
