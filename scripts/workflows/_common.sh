# shellcheck shell=bash
# Sourced by every script here: strict mode, the bot's identity, output helpers.
set -euo pipefail

# the workflows' git author: GitHub's own bot
bot_identity() {
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
}

# name=value into the step's outputs (GITHUB_OUTPUT), echoed when run by hand
output() {
  echo "$1=$2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then echo "$1=$2" >> "$GITHUB_OUTPUT"; fi
}

# a release's page on GitHub
release_url() {
  echo "${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:?}/releases/tag/$1"
}
