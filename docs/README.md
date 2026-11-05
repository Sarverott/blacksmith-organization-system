# Blacksmith Organization System

[![release](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/loop-master-release-and-publish.yml?branch=master&label=release)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/loop-master-release-and-publish.yml?query=branch%3Amaster)
[![revision](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/loop-revision-bump-checks-pull-request.yml?branch=revision&label=revision)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/loop-revision-bump-checks-pull-request.yml?query=branch%3Arevision)
[![checks](https://img.shields.io/github/actions/workflow/status/Sarverott/blacksmith-organization-system/checks-on-push-changed-parts.yml?branch=development&label=checks)](https://github.com/Sarverott/blacksmith-organization-system/actions/workflows/checks-on-push-changed-parts.yml?query=branch%3Adevelopment)
[![GitHub release](https://img.shields.io/github/v/release/Sarverott/blacksmith-organization-system?include_prereleases&label=GitHub%20release)](https://github.com/Sarverott/blacksmith-organization-system/releases)
[![npm@next](https://img.shields.io/npm/v/blacksmith-organization-system/next?label=npm%40next)](https://www.npmjs.com/package/blacksmith-organization-system?activeTab=versions)
[![node](https://img.shields.io/node/v/blacksmith-organization-system/next)](https://nodejs.org/)
[![docs](https://readthedocs.org/projects/blacksmith-organization-system/badge/?version=latest)](https://blacksmith-organization-system.readthedocs.io/)
[![wiki](https://img.shields.io/badge/wiki-GitHub-blue)](https://github.com/Sarverott/blacksmith-organization-system/wiki)
[![license](https://img.shields.io/github/license/Sarverott/blacksmith-organization-system)](https://github.com/Sarverott/blacksmith-organization-system/blob/master/LICENSE)


```
************************************
  Project in R tier scope "ANUBIS"
     ______    _____    _____
     | ___ \  |  _  |  /  ___|
     | |_/ /  | | | |  \ `--.
     | ___ \  | | | |   `--. \
     | |_/ /  \ \_/ /  /\__/ /
     \____(_)  \___(_) \____(_)

    By Sett Sarverott @ 2019-2024
************************************
```


---

The **Blacksmith Organization System** (BOS) keeps a programmer's work in one
shape on every machine: a **workshop** (`__WORKSHOP`) with its areas, scopes
and projects, built, watched and inspected by code, and a **craft loop** that
moves every change from a contributor's branch to a release and versions it.
This is the documentation of its core, the npm package
`blacksmith-organization-system`.

## Start

- [What BOS is and how to use it](https://github.com/Sarverott/blacksmith-organization-system#readme):
  install, the `bos` commands, the library.
- [Contributing](https://github.com/Sarverott/blacksmith-organization-system/blob/development/.github/CONTRIBUTING.md):
  the contributors committee, branches, commits, checks.

## Parts

| Part | What is in it |
| ---- | ------------- |
| [Glossary](glossary/README.md) | every element of a workshop, one page each: what it is, why, where. Meaning comes before code |
| [Architecture](architecture/README.md) | how the core's code holds it: [models](architecture/models.md), [interfaces](architecture/interfaces.md), [bridges](architecture/bridges.md) |
| [Devlog](devlog/README.md) | where the core is going and the talk with the owner: vision, roadmap, TODO, questions, orders |
| [Changelog](changelog/phase-0.md) | what happened, phase by phase, the owner's words kept as written |
| [For agents](.agents/NOTES.md) | what the AI agents working here found and concluded (they write, people read) |

## Key ideas

- [Workshop](glossary/workshop.md): `.BOS`, `devarmory`, `forge`, `craftbook`, `archive`.
- [Scope](glossary/scope.md) and [project](glossary/project.md): `forge/<scope>/<project>`.
- [Craft loop](glossary/craft-loop.md): `dev/<name>` → `development` → `revision` → `testing` → `releasing` → `master`.
- Versions: semver `vX.Y.Z` for projects, [GRIH](glossary/grih.md) `vG.R.I.H` for scopes.
