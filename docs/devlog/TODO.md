# TODO

What is being worked on now. The idea of every phase: [VISION.md](VISION.md);
versions: [ROADMAP.md](ROADMAP.md); questions: [BRAINSTORM.md](BRAINSTORM.md);
history: [../changelog/](../changelog/phase-0.md).

## Phase 0: clear the ground

- [x] AGENTS.md and CLAUDE.md for the core; Cleo's conclusions in `docs/.agents/CLEO.md`
- [x] Branch `development` created from `developement` (Q1)
- [x] `development` pushed to GitHub; `developement` removed here (Q1)
- [x] `developement` removed on GitHub (Q1; by the owner)
- [x] Remotes: this repo → `Sarverott/blacksmith-organization-system`, bos-skillset → `Sarverott/bos-skillset` (Q2; local git config)
- [x] Read the Docs: the core has its own MkDocs site (RTD builds the core's repository since the rename) (Q2)
- [x] npm: `package.json` of the core is `blacksmith-organization-system`, repository URL the core's (Q2)
- [ ] bos-skillset follows the rename: its remote, package name, AGENTS.md (left in `forge/NOTES-for-repositories.md`; not edited from here) (Q2)
- [x] Legacy core tagged `legacy/v0.6.1` and removed (Q3)
- [x] Shell scripts moved from `src/` to `scripts/`
- [x] Devlog in its standard look: README, VISION, ROADMAP, TODO, BRAINSTORM, PROPOSALS, ORDERS, INQUIRIES, Taskfile; draft and old devlog archived in the changelog
- [x] TypeScript toolchain: tsc, vitest, biome, commitizen, commitlint, husky hooks through Taskfile, CI `check`

## Phase 1: proof of work

- [x] Core: Host, element anatomy, procedures, tool format, semver + GRIH
- [x] Models: workshop, .BOS and its parts, devarmory, forge, scope, project, craftbook, archive, devlog
- [x] `bos workshop bootstrap`: the base of the environment, never overwriting
- [x] `bos workshop watch`: changes as events in area › scope › project, recorded in storylines
- [x] `bos workshop status`: the whole workshop as one report with findings
- [x] `bos scope version` / `bos scope bump`: GRIH in `<scope>/.bos/scope.json` (Q5)
- [x] `bos devlog state`: phases, questions, proposals, waiting orders → STATE.md
- [x] README of the core rewritten for the reforged BOS
- [x] The procedures of `scripts/shell-procedures/` listed as the next procedures of the core (`scripts/README.md`)
- [x] Development workshop: `WORKSHOP_ROOT` / `WORKSHOP_RENAME`, the checkout's `.env` (now `/run/media/sarverott/setternet-A62/__WORKSHOP`)
- [x] Watching never goes deaf: one watcher per directory, noise not watched, an exhausted inotify is an error
- [x] Q6–Q9 answered (changelog phase 1); old local branches tagged or deleted (Q9)
- [x] Version `1.0.0`: the flip of the reforge (Q7)

## Phase 2: the loop as code

- [x] Documentation: `docs/architecture/` (models, interfaces, bridges) from the `about-*` pages, which are removed
- [x] Documentation: `docs/scrapnote-example.md` archived in the changelog, its ideas placed, the file removed
- [x] Documentation: one audience per README - `README.md` (npm and everywhere), `docs/README.md` (the documentation's index), `.github/README.md` (GitHub)
- [x] Documentation: `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for the contributors committee
- [x] Glossary: `grih` and `craft-loop` (from the legacy `docs/README.md`)
- [x] The loop as data: stations, directions, `rejection`, contributors, automerge per station (from gitrecon); default in `src/models/loop/data.ts`, a project's own `.bos/loop.json`
- [x] `bos flow explain` / `next` / `next-pr` / `automerge`, through the GitHub bridge (`Host.run` → `gh`)
- [x] Settings in `.github/bos.json`: `loop` (replaces `.bos/loop.json`) and `versioning` (bumps per station) (chat 2)
- [x] `bos flow bump <station>`: the project's version bumped per `versioning`, only when already released (tagged) (chat 2)
- [ ] Checks split: one reusable `checks.yml` (types, lint, tests, build, docs, commits, package); `check.yml` runs only what a push changed; `pr-checks.yml` runs all (chat 3)
- [ ] Workflows of the routine: `revision.yml` (minor bump), `release.yml` (tag, GitHub release, npm, wiki, webhooks, back into development), `flow.yml` (full loop, `workflow_dispatch` only); all with `workflow_dispatch` (Q10, Q11)
- [x] GitHub wiki: `docs/.gh-wiki` (ignored), `scripts/gh-wiki.py` + `resources/docs-templates/`, `task docs:wiki` (inquiry)
- [x] AGENTS.md: the routine, and what an agent pushes without asking (chat 1)
- [ ] First run of the routine: `development` pushed, PR `development → master`, `development` pushed to `revision`
- [ ] `scripts/` inventory: what is required, what moves into the core (inquiry)
- [ ] Tag `v1.0.0` and npm: by `release.yml` when the first PR to `master` is merged (needs the `npm_token` secret)
- [ ] The full loop driven (`revision → testing → releasing → master`), `testing`/`releasing` moved to `master` (Q9, Q10: later)
- [ ] Rulesets (`docs/rulesets/`): meaning [TODO] from the owner
- [ ] Mirrors: glossary page `archive/.repos-mirrors` (each mirror a sarcophag) (Q6)
- [ ] Procedure `archiving`: `bos archive mirror <forge path>` → bare clone `archive/.repos-mirrors/<scope>___<project>.git`, dry run first, the forge copy removed only on confirmation (Q6)
- [ ] Inspecting: a finding for clones in the forge that belong among the mirrors (Q6)
- [ ] Mirrors tried on the development workshop; the home workshop's clones move on the owner's order (Q6)

## Phase 3: workplaces

- [ ] Containers: one per agent host CLI (Codex, Claude Code), one for the owner
- [ ] Workmodes: sets of Taskfile tasks with file watchers and git hooks
- [ ] The git bridge (`src/bridges/git.ts`, tags only so far) grows: status, add, commit
- [ ] Scrapnote vaults: `craftbook/<scope>___<project>/scrapnotes/` as a git repository (Obsidian vault), `<project>/docs/.scrapnotes` its link, ignored by the project (Q8)
- [ ] Workmode `scrapnotes`: commit every saved note after a quiet moment; `.obsidian/workspace*.json` ignored (Q8)
