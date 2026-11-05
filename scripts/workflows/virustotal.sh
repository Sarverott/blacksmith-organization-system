#!/usr/bin/env bash
# Every file of the GitHub release <tag> (its files and the source archives) fed to
# VirusTotal; the release notes get a "VirusTotal" section linking each file's report.
# Usage: virustotal.sh <tag>   (needs VIRUSTOTAL_API_KEY; without it, says so and
#   stops; GH_TOKEN with contents: write)
source "$(dirname "$0")/_common.sh"
tag="${1:?tag}"

if [ -z "${VIRUSTOTAL_API_KEY:-}" ]; then
  echo "::warning::no VIRUSTOTAL_API_KEY (environment publish-env) - nothing is scanned"
  exit 0
fi
files=$(mktemp -d)
gh release download "$tag" --dir "$files" || true
gh release download "$tag" --dir "$files" --archive zip
gh release download "$tag" --dir "$files" --archive tar.gz

section=$'## VirusTotal\n'
first=true
for file in "$files"/*; do
  # the public API takes 4 files a minute
  if [ "$first" = false ]; then sleep 16; fi
  first=false
  curl -sSf --retry 3 -X POST https://www.virustotal.com/api/v3/files \
    -H "x-apikey: $VIRUSTOTAL_API_KEY" -F "file=@$file" > /dev/null
  sha=$(sha256sum "$file" | cut -d' ' -f1)
  section+="- [\`$(basename "$file")\`](https://www.virustotal.com/gui/file/$sha) sha256 \`$sha\`"$'\n'
  echo "scanned: $(basename "$file") $sha"
done

# the notes without an older VirusTotal section, then this one
body=$(gh release view "$tag" --json body --jq .body | sed '/^## VirusTotal$/,$d')
gh release edit "$tag" --notes "$body"$'\n\n'"$section"
