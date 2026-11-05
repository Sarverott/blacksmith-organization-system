# TODO

What is being worked on now. The idea of every phase: [VISION.md](VISION.md);
versions: [ROADMAP.md](ROADMAP.md); questions: [BRAINSTORM.md](BRAINSTORM.md);
history: [../changelog/](../changelog/phase-0.md).

## Phase 0: clear the ground

- [x] AGENTS.md and CLAUDE.md for the core; Cleo's conclusions in `docs/.agents/CLEO.md`
- [x] Branch `development` created from `developement` (Q1)
- [x] `development` pushed to GitHub; `developement` removed here (Q1)
- [ ] `developement` removed on GitHub: `git push origin --delete developement` (Q1; its head `c7da0df` is in `development`; the owner runs it, refused to agents by the permission check)
- [ ] Remotes: this repo → `Sarverott/blacksmith-organization-system`, bos-skillset → `Sarverott/bos-skillset` (Q2; local git config)
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

- [ ] Tag `v1.0.0` and `npm publish --tag next` (Q7; the owner's go-ahead first)
- [ ] `resources/loop.json`: stations, directions, `rejection`, automerge flags (from gitrecon)
- [ ] `bos flow explain` / `next-pr` / `automerge`
- [ ] Project versions: a step per commit, a phase when TODO.md completes one
- [ ] GitHub workflows that only call `bos flow`
- [ ] `revision`, `testing`, `releasing` moved to `master` when the loop starts (Q9)
- [ ] Mirrors: glossary page `archive/.repos-mirrors` (each mirror a sarcophag) (Q6)
- [ ] Procedure `archiving`: `bos archive mirror <forge path>` → bare clone `archive/.repos-mirrors/<scope>___<project>.git`, dry run first, the forge copy removed only on confirmation (Q6)
- [ ] Inspecting: a finding for clones in the forge that belong among the mirrors (Q6)
- [ ] Mirrors tried on the development workshop; the home workshop's clones move on the owner's order (Q6)

## Phase 3: workplaces

- [ ] Containers: one per agent host CLI (Codex, Claude Code), one for the owner
- [ ] Workmodes: sets of Taskfile tasks with file watchers and git hooks
- [ ] A git bridge in `hosts/` (status, add, commit), the only door to git
- [ ] Scrapnote vaults: `craftbook/<scope>___<project>/scrapnotes/` as a git repository (Obsidian vault), `<project>/docs/.scrapnotes` its link, ignored by the project (Q8)
- [ ] Workmode `scrapnotes`: commit every saved note after a quiet moment; `.obsidian/workspace*.json` ignored (Q8)
