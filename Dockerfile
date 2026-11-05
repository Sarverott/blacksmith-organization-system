# The bos command in a container, built from the source of a release by the publish
# workflows (docker-container-publish.yml: Docker Hub; github-container-publish.yml:
# ghcr.io). The workshop is mounted, its parent is /workspace:
#   docker run --rm -v "$HOME:/workspace" sarverott/blacksmith-organization-system workshop status
# The base of the workplaces of phase 3 (a container per contributor).

# the package exactly as npm gets it (npm pack runs the build)
FROM node:24-alpine AS pack
WORKDIR /bos
COPY package.json package-lock.json .npmrc ./
RUN HUSKY=0 npm ci
COPY tsconfig.json tsconfig.build.json README.md LICENSE ./
COPY src ./src
COPY resources ./resources
RUN npm pack --pack-destination /tmp && mv /tmp/blacksmith-organization-system-*.tgz /tmp/bos.tgz

FROM node:24-alpine
# git: the bridge of bos flow and bos project authors
RUN apk add --no-cache git
COPY --from=pack /tmp/bos.tgz /tmp/bos.tgz
RUN npm install --global /tmp/bos.tgz && rm /tmp/bos.tgz && npm cache clean --force
ENV WORKSHOP_ROOT=/workspace
WORKDIR /workspace
ENTRYPOINT ["bos"]
CMD ["help"]
