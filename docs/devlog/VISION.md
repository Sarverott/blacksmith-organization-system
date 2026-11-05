# VISION

BOS turns a programmer's scattered machines, drives and servers into one
**workshop** with a fixed shape, and keeps that shape by code: it builds the
base of the environment, listens to what changes in it, and inspects it as one
coherent whole. On top of that it runs the **craft loop**: branches, steps,
phases and versions that every BOS project follows the same way, for people
and AI agents alike.

This repository is the **core**: a TypeScript module that does all of it.
[bos-skillset](https://github.com/Sarverott/bos-skillset) builds the agents'
skills and the Claude Code plugin on top of it.

## Principles

- **Contributors committee.** Every agent and every person is a member: same
  loop, same checks, own `dev/<name>` branch, own container, own name on the
  commits (agents sign as co-authors).
- **Everything is coded.** Structures and mechanics are code, not only prose:
  a behaviour is a procedure, a structure is a model, the loop is data plus an
  engine. Prose explains why; code says how.
- **Plain mechanics, small files.** (from the old devlog, entry 1: the legacy
  code was "overartistic"; references stay short, names say what things are.)
  One concern per file, collected by the nearest `_index.ts`; a procedure has
  a `DESCRIPTION.md`.
- **Elements declare themselves.** (old devlog, entry 2: "model is
  autodeclaring own internals".) A model declares its directory, children and
  descriptor files once, statically; the same declaration creates it
  (bootstrapping) and checks it (inspecting).
- **Create only what is missing.** BOS never overwrites or deletes without an
  explicit, dry-run-aware step.
- **One door to the machine.** The core reaches files, clocks and the
  environment only through a `Host`, so it can later run in more places than
  Node (decision on which: later).
- **Agents have their own space.** `docs/.agents/` is written by agents and
  read by people; `docs/devlog/` is where the owner speaks.

## Phases

The checklist is [TODO.md](TODO.md); the versions are in [ROADMAP.md](ROADMAP.md).

0. **Clear the ground.** Branch `development`, legacy code tagged and removed,
   shell scripts in `scripts/`, the devlog in its standard look, the
   TypeScript toolchain (tsc, vitest, biome, commitizen, commitlint, husky,
   Taskfile, CI).
1. **Proof of work.** The core builds the base of a workshop, listens to its
   changes and inspects it as a coherent environment; scopes carry GRIH
   versions; the devlog is read as data.
2. **The loop as code.** The branch loop as data (`loop.json`: stations,
   directions, `rejection`, automerge) and its engine (`bos flow`), project
   versions bumped per step and phase from TODO.md, GitHub workflows that only
   call the core.
3. **Workplaces.** `dev/<name>` branches merged into `development`; a
   container per agent host CLI (Codex, Claude Code) and one for the owner;
   workmodes as sets of Taskfile tasks with file watchers and git hooks.
4. **The skillset on the core.** bos-skillset depends on this package and
   drops its own copies of the core; its skills, MCP and plugin stay there.
