```
      █▄▄ █░░ ▄▀█ █▀▀ █▄▀ █▀ █▀▄▀█ █ ▀█▀ █░█
      █▄█ █▄▄ █▀█ █▄▄ █░█ ▄█ █░▀░█ █ ░█░ █▀█

   █▀█ █▀█ █▀▀ ▄▀█ █▄░█ █ ▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
   █▄█ █▀▄ █▄█ █▀█ █░▀█ █ █▄ █▀█ ░█░ █ █▄█ █░▀█

             █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█
             ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█
```
> ###### [Sett Sarverott](https://github.com/Sarverott) @ 2019-2026
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

This repository is the core, a TypeScript module. The agents' skills and the
Claude Code plugin are [bos-skillset](https://github.com/Sarverott/bos-skillset),
which builds on it.

## Use

Node ≥ 22.18. From a checkout (`npm install`):

```sh
node src/cli.ts workshop status            # the whole workshop: areas, scopes, projects, findings
node src/cli.ts workshop bootstrap --dry-run   # what is missing; without --dry-run, create it
node src/cli.ts workshop watch --record    # one line per change until Ctrl+C, kept in .BOS/storylines
node src/cli.ts scope bump <scope> phase   # raise a scope's GRIH version: step, phase, milestone, flip
node src/cli.ts devlog state               # where this project stands, from docs/devlog/
node src/cli.ts help                       # every tool; --json gives machines the data
```

or the same through Task: `task status`, `task bootstrap`, `task watch`,
`task devlog:state`. The active workshop is `--workshop=<path>`, else
`$BOS_WORKSHOP`, else `$WORKSHOP_ROOT/__WORKSHOP`, else the nearest parent
`__WORKSHOP`, else `~/__WORKSHOP`; `$WORKSHOP_RENAME` changes the name
`__WORKSHOP`.

Developing the core, copy `.env.example` to `.env` (not committed) and set
`WORKSHOP_ROOT` to a place for tests and demonstrations, e.g. a partition:
a checkout's CLI reads its own `.env`, so it never wanders into the home
workshop. Variables set in the shell win over `.env`.

As a library:

```ts
import { BOS, NodeHost } from "blacksmith-organization-system";

const bos = new BOS(new NodeHost());
await bos.bootstrap();
const report = await bos.inspect();
console.log(report.forge.scopes.length, report.findings.length);
```

## Inside

```
src/
├── main.ts        the spine: class BOS (bootstrap, inspect, watch, bumpScope)
├── core/          Host (the one door to the machine), element anatomy, procedure, tool, versions, paths
├── hosts/         NodeHost; other runtimes later
├── models/        the glossary as classes: workshop, .BOS parts, forge, scope, project, devlog…
├── procedures/    bootstrapping, inspecting, watching, versioning: DESCRIPTION.md + one file per step
├── tools/         what `bos <model> <tool>` runs; the same entries are its help
├── views/         text for people
└── cli.ts, index.ts
```

Meaning comes first: [`docs/glossary/`](docs/glossary/README.md) defines every
element, one page each. The plan and the talk with the owner are in
[`docs/devlog/`](docs/devlog/README.md), the history in
[`docs/changelog/`](docs/changelog/phase-0.md), the rules for agents and
people in [AGENTS.md](AGENTS.md). Documentation:
https://blacksmith-organization-system.readthedocs.io/

## Develop

```sh
task install     # dependencies and git hooks
task check       # types, lint, tests (= CI)
task commit      # a conventional commit, guided
task docs:serve  # the docs at http://127.0.0.1:8000
```

Work happens on `development` (people and agents on their own `dev/<name>`),
never on `master`. Tests only touch temporary workshops.

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
