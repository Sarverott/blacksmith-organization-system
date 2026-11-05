```
      █▄▄ █░░ ▄▀█ █▀▀ █▄▀ █▀ █▀▄▀█ █ ▀█▀ █░█
      █▄█ █▄▄ █▀█ █▄▄ █░█ ▄█ █░▀░█ █ ░█░ █▀█

   █▀█ █▀█ █▀▀ ▄▀█ █▄░█ █ ▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
   █▄█ █▀▄ █▄█ █▀█ █░▀█ █ █▄ █▀█ ░█░ █ █▄█ █░▀█

             █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█
             ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█
```
> ###### [Sett Sarverott](https://github.com/Sarverott) @ 2019-2026

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

---

# The core of the Blacksmith Organization System

A programmer's work gets scattered across machines, drives and servers, and
the copies drift apart: *variantogeddon*. BOS gives every host the same fixed
shape, a **workshop**, and keeps that shape by code:

- **builds the base** of the environment: `__WORKSHOP` with its areas
  `.BOS`, `devarmory`, `forge`, `craftbook`, `archive`, creating only what is
  missing and never overwriting;
- **listens** to every change in it and says where it happened: area › scope
  › project;
- **inspects** it as one coherent environment: every scope and project in the
  forge (branch, version, anatomy) and what is out of order;
- runs the **craft loop** every BOS project follows: branches, steps, phases,
  milestones and their versions (semver `vX.Y.Z` for projects, GRIH
  `vG.R.I.H` for scopes).

This is the core: a TypeScript module and the `bos` command.

## Install

Node ≥ 22.18.

```sh
npm install --global blacksmith-organization-system   # gives the command `bos`
npx blacksmith-organization-system help               # or without installing
```

## Use

```sh
bos workshop status                 # the whole workshop: areas, scopes, projects, findings
bos workshop bootstrap --dryRun     # what is missing; without --dryRun, create it
bos workshop watch --record         # one line per change until Ctrl+C, kept in .BOS/storylines
bos scope bump <scope> phase        # raise a scope's GRIH version: step, phase, milestone, flip
bos devlog state                    # where a project stands, from its docs/devlog/
bos help                            # every tool; --json gives machines the data
```

Which workshop: `--workshop=<path>`, else `$BOS_WORKSHOP`, else
`$WORKSHOP_ROOT/__WORKSHOP`, else the nearest parent `__WORKSHOP`, else
`~/__WORKSHOP`. `$WORKSHOP_RENAME` changes the name `__WORKSHOP`.
`bos workshop locate` says which one and why. Only `bootstrap` and `bump`
write, and they create only what is missing.

As a library:

```ts
import { BOS, NodeHost } from "blacksmith-organization-system";

const bos = new BOS(new NodeHost());
await bos.bootstrap();
const report = await bos.inspect();
console.log(report.forge.scopes.length, report.findings.length);
```

## Documentation

https://blacksmith-organization-system.readthedocs.io/: the
[glossary](https://blacksmith-organization-system.readthedocs.io/en/latest/glossary/)
(every element of a workshop), the architecture of the core, the devlog and
the changelog. To work on BOS itself:
[CONTRIBUTING](https://github.com/Sarverott/blacksmith-organization-system/blob/development/.github/CONTRIBUTING.md).

The agents' skills and the Claude Code plugin are
[bos-skillset](https://github.com/Sarverott/bos-skillset), which builds on
this core.

## public repositories of source code with cloned mirrors
- main source on github
  - https://github.com/Sarverott/blacksmith-organization-system
- mirror on gitea
  - https://gitea.com/Sarverott/blacksmith-organization-system
- mirror on gitlab
  - https://gitlab.com/Sarverott/blacksmith-organization-system
- mirror on bitbucket
  - https://bitbucket.org/apokryf/blacksmith-organization-system/
- mirror on sourcehut
  - https://git.sr.ht/~sarverott/blacksmith-organization-system

## Where the idea came from

The basic idea was to automate repository control and make order in project
folders for better workspaces' view and control, with easier projects and
publication management. The workshop dirtree worked well in one local
workspace. Problems appeared when new workspaces joined, and variantogeddon
from desynchronized versions grew out of control; then more, when keeping up
the speed of commits and publication bundles at the same time with
conventional methods. But this was only the beginning…

The legacy CommonJS core (v0.6.1) is kept as the git tag `legacy/v0.6.1`.

## License

Copyright (c) 2019-2026 Sett Sarverott, released on terms of the [MIT license](LICENSE).
