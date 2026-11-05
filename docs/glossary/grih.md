# GRIH

> The version scale of a [scope](scope.md): `vG.R.I.H`. Projects use semver
> `vX.Y.Z`. From the owner's idea of versioning by the merges of the branch
> loop (legacy `docs/README.md`, archived in changelog phase 1).

## What it is

Four numbers, from the biggest change to the smallest:

| Part | Name | Raised when | Event of the [craft loop](craft-loop.md) |
| ---- | ---- | ----------- | ---------------------------------------- |
| **G** | Generation | planned loops with new ideas, targets and milestones; the concept is reformed, a huge improvement of the idea | flip: the script flips (pre-alpha → alpha, a key concept changes) |
| **R** | Reconstruction | loops needed by the situation: base ideas change, targets are updated, rebuilt for compatibility and integrity, big remodelling of the scope or its behaviour, optimization | milestone |
| **I** | Integration | the standard loop: stacked hotfixes and bundles of single changes are included, a clear changelog entry, summary reports, the work of many joined | phase: every item of a TODO phase ticked |
| **H** | Hooking | a simple injected update: fast hotfixes, small problems and issues, unit tests; small commits hooked into the merge chain | step: one finished, checked piece of work, one commit |

Raising a part sets every smaller part to 0. A new scope starts at `0.0.0.0`.

## Where

`<scope>/.bos/scope.json` (decision Q5). `bos scope version <scope>` reads
it, `bos scope bump <scope> <event>` raises it; `src/core/version.ts`
computes both scales.

## Relations

[craft loop](craft-loop.md) (its events raise the versions), [scope](scope.md).
