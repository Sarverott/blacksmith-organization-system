# blacksmith-organization-system

[![release](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/loop-master-release-and-publish.yml?branch=master&label=release)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/loop-master-release-and-publish.yml?query=branch%3Amaster)
[![revision](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/loop-revision-bump-checks-pull-request.yml?branch=revision&label=revision)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/loop-revision-bump-checks-pull-request.yml?query=branch%3Arevision)
[![checks](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/checks-on-push-changed-parts.yml?branch=development&label=checks)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/checks-on-push-changed-parts.yml?query=branch%3Adevelopment)
[![GitHub release](https://img.shields.io/github/v/release/Sarverott/blacksmith-organization-system?include_prereleases&label=GitHub%20release)](https://github.com/Sarverott/blacksmith-organization-system/releases)
[![npm@next](https://img.shields.io/npm/v/blacksmith-organization-system/next?label=npm%40next)](https://www.npmjs.com/package/blacksmith-organization-system?activeTab=versions)
[![node](https://img.shields.io/node/v/blacksmith-organization-system/next)](https://nodejs.org/)
[![docs](https://readthedocs.org/projects/blacksmith-organization-system/badge/?version=latest)](https://blacksmith-organization-system.readthedocs.io/)
[![wiki](https://img.shields.io/badge/wiki-GitHub-blue)](https://github.com/Sarverott/blacksmith-organization-system/wiki)
[![license](https://img.shields.io/github/license/Sarverott/blacksmith-organization-system)](https://github.com/Sarverott/blacksmith-organization-system/blob/master/LICENSE)
[![bundlephobia](https://img.shields.io/badge/bundlephobia-size-informational)](https://bundlephobia.com/package/blacksmith-organization-system)
[![socket.dev](https://img.shields.io/badge/socket.dev-supply%20chain-informational)](https://socket.dev/npm/package/blacksmith-organization-system)
[![Snyk](https://img.shields.io/badge/Snyk-advisor-informational)](https://snyk.io/advisor/npm-package/blacksmith-organization-system)
[![npmgraph](https://img.shields.io/badge/npmgraph-dependencies-informational)](https://npmgraph.js.org/?q=blacksmith-organization-system)
[![VirusTotal](https://img.shields.io/badge/VirusTotal-release%20files-informational)](https://github.com/Sarverott/blacksmith-organization-system/releases/tag/latest)
[![nightly](https://img.shields.io/badge/nightly-revision-orange)](https://github.com/Sarverott/blacksmith-organization-system/releases/tag/nightly)

The **core of the Blacksmith Organization System** (BOS): a TypeScript module
and the `bos` command that build, watch and inspect a programmer's workshop
(`__WORKSHOP`: `.BOS`, `devarmory`, `forge`, `craftbook`, `archive`) and run
the craft loop that versions every BOS project.

- **What it is and how to use it:** [README.md](../README.md)
- **Documentation:** https://blacksmith-organization-system.readthedocs.io/
- **Working on it:** [CONTRIBUTING.md](CONTRIBUTING.md) ·
  [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · rules for AI agents and people:
  [AGENTS.md](../AGENTS.md)
- **Where it is going:** [docs/devlog/](../docs/devlog/README.md) (vision,
  roadmap, TODO, open questions)

## Branches

| Branch | For |
| ------ | --- |
| `development` | the accumulated work of every contributor: open pull requests here, from your `dev/<name>` |
| `dev/<name>` | one contributor's own branch, a person (`dev/Sarverott`) or an agent (`dev/Cleo`) |
| `revision` → `testing` → `releasing` | the stations of the craft loop (being coded in phase 2) |
| `master` | the spine of canon: moves only by a pull request from `releasing` |

## The family

| Repository | What |
| ---------- | ---- |
| [blacksmith-organization-system](https://github.com/Sarverott/blacksmith-organization-system) | this core (npm `blacksmith-organization-system`) |
| [bos-skillset](https://github.com/Sarverott/bos-skillset) | skills for AI agents, the Claude Code plugin, an MCP server; builds on the core |

The legacy CommonJS core is the tag `legacy/v0.6.1`.
