# CLEO: Claude Code's view of the BOS core

Written by Cleo (Claude Code). The owner reads this file; agents write it.
Newest sections at the end.

## UNIXUSAT=1793864806390 · before the first commit of the rebuild

Read for this round: `docs/devlog/DRAFT.md`, this repository (src, docs,
branches), `../bos-skillset` (src, AGENTS.md, Taskfile, husky, glossary),
gitrecon (`redscope-technologies/gitrecon`: AGENTS.md, `.github/bos.config.json`,
`.github/bos/flow.py`, `.husky/`, Taskfiles), Amoorion (AGENTS.md,
`docs/.agents/GUIDE.md`, `.github/flow.toml`, `lefthook.yml`, Taskfile,
`docs/releasing.md`). Not read yet: the GitHub repos listed in DRAFT.md
(`bos.models`, `bos.commands`…, the apps and the documentation repo).

### Conclusions, part by part

**This repository (legacy core, v0.6.1).** CommonJS, about 40 dependencies
that nothing uses (discord, solana, puppeteer, electron, vue…), controllers
named `*Controll.js`, a model anatomy from `docs/devlog.md` entry 2 (class,
index.json, actions/listeners/events/extenders/methods) and shell procedures
in `src/toolsets/`. Worth keeping: the procedure *names* (open project,
sweep into throwbox, project to sarcophag, pull archive, synchronize,
publicate, pack backup, deploy new workshop), which are the vocabulary of
the workflow, and the model-anatomy idea. The code itself: rebuild.

**bos-skillset (v1.0.1, the real current core).** Clean ESM spine
(`main.ts` + `core/`, ~700 lines), models matching the glossary, procedures
as one file per step with `DESCRIPTION.md`, bridges as the only door to the
outside, and one tool format (`toolkit.mjs`) that is at once CLI command,
MCP tool and help. This is the code to move here. What stays in the
skillset: `skills/`, `.claude-plugin/`, `hooks/hooks.json`, the MCP and
agent views, House/ravens resources; it imports the core as a dependency.
Its branch promotion (`bos project promote`) knows the stations but not the
loop's data (directions, rejection, automerge) nor versioning.

**gitrecon.** The loop as **data**: `.github/bos.config.json` (canonical
branches, directions including `rejection`, automerge flags per edge,
versioning) and an engine (`flow.py`: explain, next-pr, automerge, bump)
driven by workflows that start each other via `gh workflow run`. Hooks are
one line each and call Taskfile tasks; routine switches (`add-all`,
autopush) in `.husky/bos.config.json`. `metadata.json` is the single source
of name/version copied into manifests. Devlog = `scrapnote-<UNIXUSAT>.md`.

**Amoorion.** The **working discipline**: `docs/.agents/` (GUIDE: begin,
take in, work, finish, never; MAP; NOTES; CLEO), devlog files with stable
ids (`Q<n>` with *Lean:*, `PP<n>`), the owner's words moved verbatim into an
append-only `docs/changelog/phase-<n>.md`, and release sizes tied to the
plan: every step Z, a completed TODO phase Y, all phases X. Also the
pre-release mark after master is merged back (`X.Y.(Z+1)a0`).

### Confronting them

| Topic | gitrecon | Amoorion | DRAFT.md | Proposal |
| ----- | -------- | -------- | -------- | -------- |
| hooks | husky → Taskfile | lefthook | husky | husky, hooks only call `task hooks:<name>` |
| branch loop | full 5 stages + rejection, as JSON | short: development → master | full loop + `dev/<name>` | full loop as data; `dev/<name>` added as the stage before `developement` |
| bump size | loop = PATCH, breaking = MINOR | step Z, phase Y, plan done X | step Z/H, phase Y/I, milestone X/R, flip G | the draft's table; the phase is read from TODO.md like Amoorion |
| flow engine | Python script in `.github/` | Python dev tool | "all should be coded" | JavaScript inside the core (`procedures/flowing/`), workflows call `bos flow …` |
| devlog | scrapnotes by UNIXUSAT | VISION/TODO/BRAINSTORM/… | "standard look" | Amoorion's named files + gitrecon's scrapnotes for loose rounds |
| language | Python | Python | biome.js | JavaScript (Node ≥ 22.18, ESM), like bos-skillset |

### Target shape of the core *(proposal)*

```
src/
├── main.ts            spine (from bos-skillset)
├── core/              basic-element/-model/-submodule/-procedure/-controll/-view/-bridge, toolkit
├── models/            workshop, forge, scope, project, archive, sarcophag, craftbook, … (glossary as classes)
├── procedures/        locating, loading, bootstrapping, opening, closing, sinking, promoting,
│                      + flowing (loop engine), versioning (semver + GRIH), committing, devlogging
├── bridges/           git-client, github-api, gitea-api, docker-host, subprocess-runner
├── controllers/       execution, workshop, repository
├── views/             text, json, help
└── cli.mjs, index.mjs
resources/
├── loop.default.json  the loop as data (gitrecon's bos.config.json, extended with dev/<name>)
└── project-template/  .husky/, Taskfile.yml, biome.json, .github/workflows/, docs/devlog/, docs/.agents/
```

Everything a project needs to run the loop is a template the core deploys
(create-only-if-missing), so every BOS project gets the same hooks,
workflows, devlog and agents' space from one place.

### Rebuild plan *(proposal; becomes TODO.md once agreed)*

- **Phase 0, clear the ground.** Archive the legacy `src/` (a tag on
  `developement` keeps it in history), drop the unused dependencies, set
  up biome, commitizen, husky, vitest, Taskfile. This repo becomes ESM.
- **Phase 1, the spine.** Move `main.ts`, `core/`, models, bridges and the
  read-only procedures (locating, loading, inspecting) from bos-skillset,
  with their tests. `bos workshop status` works from here.
- **Phase 2, the loop as code.** `procedures/flowing` (explain, next-pr,
  automerge, rejection) and `procedures/versioning` (semver + GRIH,
  step/phase/milestone/flip) reading `loop.json` and `docs/devlog/TODO.md`;
  GitHub workflows that only call `bos flow …`.
- **Phase 3, workplaces.** `dev/<name>` branches, a container per agent
  host CLI and one for the owner, workmodes as Taskfile task sets with
  file watchers and git hooks.
- **Phase 4, the skillset on the core.** bos-skillset depends on this
  package; its duplicated code is removed there.

Each phase is a Y release, each step a Z. Open questions: `docs/devlog/BRAINSTORM.md`.

## UNIXUSAT=1793868538000 · commit 85b7b18 · the first batch is done

The reforge stands: the core builds a workshop, watches it and inspects all of
it, and the inspection of this host's real workshop (334 projects) is quick and
clean. What I'd keep from this round:

- **The Host is worth its weight.** Everything above `hosts/node.ts` is plain
  TypeScript over an interface, so a browser, a remote or a fake host for tests
  is one class away. It cost about 100 lines.
- **One declaration, two uses.** A model says once what it has (dirname,
  children, descriptors); `ensure` creates from it and `inspect` reads from it.
  That's how the dry run plans exactly what the real run does, which a test
  checks.
- **The devlog as data** matters more than it looks: phase completion read
  from TODO.md is what the loop needs for its Y / I bumps, so phase 2 can be
  small.
- **The noise in the real forge** (325 projects on `master`) is the most
  interesting finding: the shape of the forge and what is in it have drifted
  apart. Q6 asks what the owner wants there; I'd rather move mirrors out than
  soften the rule.

What I'd like next: the loop engine (phase 2) on top of `loop.json`, so the
branch flow in AGENTS.md stops being prose. And `opening`, the first procedure
from `scripts/shell-procedures/`, because it is where `dev/<name>` branches
start to exist by code.
