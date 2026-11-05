# blacksmith-organization-system
[![check](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/check.yml/badge.svg)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/check.yml)
[![check](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/check.yml/badge.svg?branch=development)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/check.yml)
[![npm](https://img.shields.io/npm/v/blacksmith-organization-system/next?label=npm%40next)](https://www.npmjs.com/package/blacksmith-organization-system)
[![docs](https://readthedocs.org/projects/blacksmith-organization-system/badge/?version=latest)](https://blacksmith-organization-system.readthedocs.io/)


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
