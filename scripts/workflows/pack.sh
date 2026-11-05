#!/usr/bin/env bash
# The package as npm gets it, into <directory> (npm pack runs the build; needs npm ci).
# Outputs file=<the tarball's path>.
# Usage: pack.sh <directory>
source "$(dirname "$0")/_common.sh"
into="${1:?directory}"

mkdir -p "$into"
npm pack --pack-destination "$into"
# the name npm gives it; not read from npm's output, which lifecycle scripts share
file="$into/$(jq -r '.name | sub("^@"; "") | gsub("/"; "-")' package.json)-$(jq -r .version package.json).tgz"
test -f "$file"
output file "$file"
