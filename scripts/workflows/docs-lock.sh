#!/usr/bin/env bash
# Check pyproject -> uv.lock -> Read the Docs export without changing tracked files.
# An optional project directory supports isolated regression fixtures.
source "$(dirname "$0")/_common.sh"
project="${1:-docs}"
exported=$(mktemp)
trap 'rm -f "$exported"' EXIT
uv export --project "$project" --locked --no-hashes --no-header --no-annotate --no-emit-project > "$exported"
if ! diff -u "$project/requirements.txt" "$exported"; then
  echo "Documentation export differs from uv.lock; run task docs:lock and commit both artifacts." >&2
  exit 1
fi
