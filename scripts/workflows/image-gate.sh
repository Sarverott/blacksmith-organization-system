#!/usr/bin/env bash
# Whether a container image of <tag> is published: only for a full release (its GitHub
# release is not a pre-release) and only with a token. Outputs go=true|false and
# namespace=<the image's namespace>: the Docker Hub user, or the owner on ghcr.io.
# Usage: image-gate.sh <tag>   (env REGISTRY, TOKEN, USERNAME; GH_TOKEN for gh)
source "$(dirname "$0")/_common.sh"
tag="${1:?tag}"

if [ "${REGISTRY:?}" = ghcr.io ]; then namespace="${GITHUB_REPOSITORY_OWNER:?}"; else namespace="${USERNAME:?}"; fi
output namespace "${namespace,,}"

prerelease=$(gh release view "$tag" --json isPrerelease --jq .isPrerelease)
if [ "$prerelease" != false ]; then
  echo "$tag is a pre-release: no image (only a full release gets one)"
  output go false
  exit 0
fi
if [ -z "${TOKEN:-}" ]; then
  echo "::warning::no token for $REGISTRY - no image is published"
  output go false
  exit 0
fi
output go true
