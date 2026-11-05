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

## Phase 2: the loop as code

- [ ] `resources/loop.json`: stations, directions, `rejection`, automerge flags (from gitrecon)
- [ ] `bos flow explain` / `next-pr` / `automerge`
- [ ] Project versions: a step per commit, a phase when TODO.md completes one
- [ ] GitHub workflows that only call `bos flow`
