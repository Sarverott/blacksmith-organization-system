#!/usr/bin/env bash
# What npm would publish installs into an empty project and its `bos` runs.
source "$(dirname "$0")/_common.sh"
try=$(mktemp -d)

npm pack --pack-destination "$try"
cd "$try" || exit
npm init -y > /dev/null
npm install ./blacksmith-organization-system-*.tgz
npx bos --version
