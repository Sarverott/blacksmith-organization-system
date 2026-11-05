#!/usr/bin/env bash
# The package as npm gets it, into <directory> (npm pack runs the build; needs npm ci).
# Outputs file=<the tarball's path>.
# Usage: pack.sh <directory>
source "$(dirname "$0")/_common.sh"
into="${1:?directory}"

mkdir -p "$into"
name=$(npm pack --pack-destination "$into" | tail -1)
output file "$into/$name"
