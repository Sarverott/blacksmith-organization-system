# Models

Models make the base of the logic tree of BOS: each element of the
[glossary](../glossary/README.md) that BOS handles is one class in
`src/models/<model>/class.ts`, collected by `src/models/index.ts`.

## The tree

```
Workshop                     __WORKSHOP (models/workshop)
├── System                   .BOS (models/system): Setup, Data, Nests, Storylines (Logs, Ttystories, Manifests)
├── Devarmory                devarmory (models/devarmory)
├── Forge                    forge (models/forge)
│   └── Scope                forge/<scope>, nested (models/scope)
│       └── Project          a git repository inside a scope (models/project)
│           └── Devlog       <project>/docs/devlog (models/devlog)
├── Craftbook                craftbook (models/craftbook): Scrapnotes
└── Archive                  archive (models/archive)
```

Not coded yet, defined in the glossary: [sheme](../glossary/sheme.md),
[throwbox](../glossary/throwbox.md), [sarcophag](../glossary/sarcophag.md)
(phase 2: mirrors in `archive/.repos-mirrors/`, decision Q6),
[exhibit](../glossary/exhibit.md), [craftset](../glossary/craftset.md).
*Superproject* is now *scope*.

## Anatomy of a model

Every model extends `Element` (`src/core/element.ts`) and declares itself
with four static fields. The one declaration drives both building and reading:

| Field | Says | Used by |
| ----- | ---- | ------- |
| `dirname` | the directory's name | every path |
| `children` | the models inside it | `ensure`, `inspect` walk them |
| `descriptors` | its descriptor files and their first content (`workshop.json`, `.index.json`…) | created if missing, checked by the inspection |
| `mandatory` | whether it must exist | bootstrapping creates it; a missing one is a finding |

- `ensure(context)` creates what is missing (through `createIfMissing`,
  dry-run aware), never overwrites.
- `inspect()` returns the element's node: exists, descriptors present,
  children, what is wrong.
- Anything else a model knows is a plain method: `Scope.projects()`,
  `Scope.bump()`, `Project.report()`, `Devlog.phases()`…

The [element anatomy](../glossary/element-anatomy.md) of the glossary
(metadata, manifest, index, Taskfile) is what `descriptors` stands for.

## From the legacy layout

The legacy core (`legacy/v0.6.1`) gave each model a directory of parts. Where
they are now:

| Legacy `models/<model>/…` | Now |
| ------------------------- | --- |
| `class.js` | `models/<model>/class.ts` |
| `index.json` (folder descriptors) | the static `descriptors` |
| `actions/` (commands) | `tools/<model>.ts` entries, running procedures |
| `methods/` (synchronous functions) | methods of the class |
| `listeners/` (watchers) | the `watching` procedure; workmodes (phase 3) react to its events |
| `events/` (`on-<event>.js`) | events recorded in `.BOS/storylines/logs/workshop.jsonl` |
| `extenders/` (extensions of every object) | [`TODO`]: no need found yet |
| `README.md` | the model's glossary page |
