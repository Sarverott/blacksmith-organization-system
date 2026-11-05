# Architecture of the core

How the code of the core is laid out and why. What each element *means* is in
the [glossary](../glossary/README.md); this part says how the code holds it.

```
             ┌────────────── interfaces ──────────────┐
             │  cli.ts (bos <model> <tool>)  index.ts  │   how people and programs reach BOS
             └───────────────────┬────────────────────┘
                              tools/                       one entry per command: args, run, render
                                 │
                              main.ts  class BOS           the spine: bootstrap, inspect, watch, bumpScope
                                 │
                 ┌───────────────┴───────────────┐
            procedures/                       models/       how (named steps)  ·  what (the glossary as classes)
                 └───────────────┬───────────────┘
                              core/                         Host, Element, Procedure, Tool, versions, paths
                                 │
                              hosts/  NodeHost              the one door to the machine
                                 │
                          bridges (phase 2+)                git, GitHub, Gitea, docker, setternet…
```

- [Models](models.md): the tree of elements, and the anatomy every model shares.
- [Interfaces](interfaces.md): the ways in: the CLI, the library, later an API and more.
- [Bridges](bridges.md): the ways out: other systems BOS talks to.

Three rules hold it together (AGENTS.md has all of them):

1. **One door to the machine.** Only `src/hosts/` imports `node:*` (and
   `cli.ts`, to start). Everything else asks a `Host`, so the core can run
   wherever a host can be written.
2. **Code is the procedure.** A behaviour is a procedure: a directory with a
   `DESCRIPTION.md` (why), one file per step (how), `_index.ts` (the order).
3. **BOS creates only what is missing,** and a dry run plans exactly what the
   real run does.
