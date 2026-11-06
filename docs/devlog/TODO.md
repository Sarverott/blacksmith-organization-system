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
- [x] Checks split: one reusable set (types, lint, tests, build, docs, commits, package); on push only what changed; on pull requests all (chat 3)
- [x] Workflows of the routine: revision (minor bump), release (tag, GitHub release, npm, wiki, webhooks, back into development), the full loop by hand; all with `workflow_dispatch` (Q10, Q11)
- [x] GitHub wiki: `docs/.gh-wiki` (ignored), `scripts/gh-wiki.py` + `resources/docs-templates/`, `task docs:wiki` (inquiry)
- [x] AGENTS.md: the routine, and what an agent pushes without asking (chat 1)
- [x] First run of the routine: `development` pushed, PR `development → master`, `development` pushed to `revision`
- [x] `scripts/` reduced to what is required: replaced scripts removed (they stay in `legacy/v0.6.1`), the rest listed as sketches to port (inquiry)
- [x] Tag `v1.0.0` and GitHub pre-release: by the release workflow when PR #3 was merged; the wiki synced
- [x] Publishing secrets from the environment `publish-env` (`NPM_TOKEN`, `READTHEDOCS_API_TOKEN`); Read the Docs activates and builds each release
- [x] Workflow steps as scripts: `scripts/workflows/*.sh`, run as `task workflows:<name>`
- [x] 1.x on npm under `next`: `v1.1.0` (PR #4); `v1.0.0` itself is not on npm (its tag predates the publish step)
- [x] The old `reforge` branch deleted on GitHub (all of it in `development`)
- [x] Workflows named by what they are: `checks-*`, `loop-*`, `<registry>-<kind>-publish` (inquiry)
- [x] The pull request to `master` opened by the revision workflow (`revision → master`), not by the agent (inquiry)
- [x] `.github/AUTHORS`: `bos project authors` (procedure `crediting`, glossary `authors`), kept by the revision workflow (inquiry)
- [x] Badges: one row in the GitHub, npm and documentation READMEs (inquiry)
- [x] Publishing: npm on GitHub Packages (pre-releases too); container images on Docker Hub and ghcr.io for a full release (`Dockerfile`) (the owner's stubs)
- [x] Rulesets, as the almanac's coded half (PP1 taken up): `resources/almanac/rulesets/` (every project) and `docs/almanac/rulesets/` (this one), judged by `core/ruling.ts`, `bos almanac rules | judge` (inquiry)
- [x] Patterning: chains of solved situations, `core/patterning.ts` (next events with probabilities, chains recalled), `bos almanac recall` (inquiry)
- [x] Q12: every full release is stable (images); an LTS line once two majors live side by side
- [x] A version per commit on `dev/*` (pre-commit hook, `bos flow bump-commit`); versions merge by the higher (`bos flow merge-version`, `.gitattributes`); a station bumps once its line is released (inquiry)
- [x] Releases that move: `nightly` (revision), `latest` (every release), each with the package's `.tgz` (inquiry)
- [x] Package reports in every README (bundlephobia, socket.dev, Snyk, npmgraph); release files to VirusTotal (inquiry)
- [x] Mirrors of the source: gitea.com, gitlab.com, bitbucket.org, sr.ht, every branch and tag, a status badge per place, the checks on each mirror's CI (inquiry)
- [x] The four mirror secrets in `publish-env`: `MIRROR_GITEA_TOKEN`, `MIRROR_GITLAB_TOKEN`, `MIRROR_BITBUCKET_TOKEN`, `MIRROR_SOURCEHUT_SSH_KEY` (the owner)
- [x] First run with them: gitea.com and sr.ht take every branch and tag (200 OK); a Bitbucket API token (`ATATT…`) signs in as `x-bitbucket-api-token-auth` (found)
- [x] gitlab.com: the fine-grained token needs the project permission *Code: Push* (the owner; 200 OK since run 42139753049)
- [x] bitbucket.org: green on the next run, else the token's scope `write:repository:bitbucket` and the workspace `apokryf` (the owner; 200 OK since run 42139753049)
- [x] The owner's review notes in the code: biome in more lines, `bos.ts`, namespaces, `BOS.<Model>`, `index.ts`, `JsonFile`, `packagePath`, a readable `cli.ts` and views, `Element` emits events (review)
- [x] Git hooks fail again when a check fails: `.husky/task` runs the task binary, not `@go-task/cli`'s npm wrapper (found)
- [x] Lint green again on what the version bump writes: `package.json` formatted as npm writes it (expand `always`); actions/checkout and setup-node v5, on Node 24 (found)
- [x] The owner's map of bridges: `Bridge` (base.ts) → `Git` → `LocalGit` / `RemoteGit` → GitHub, Gitea, GitLab, Bitbucket, SourceHut; `bridges/index.ts` exports them all (owner)
- [x] `.omnis.toml`, a draft: `core/omnis.ts` (a12y, crc32, adler32, base32, the TOML), `Host.digest`, `LocalGit.files()`; glossary page (Q15)
- [x] `.omnis.toml` written and checked: `.bos/.omnis.toml` per model, changeable allocators, the walk stops at another model, `bos project omnis | seal`, the finding `omnis-drift` (Q16)
- [x] Mirrors sync on a push to `development` only, and a failed mirror never fails the run; mirrors only check, never publish (owner)
- [x] An open pull request `revision → master` follows its version: title and description edited on each run (found: PR #9 said v1.4.9, released v1.4.10)
- [x] Examples: `examples/01-getting-started/`, the library step by step; the owner's `00-draft-snippets/` kept as written (inquiry)
- [x] A `--workshop` not named `__WORKSHOP` holds one (found by the draft snippets: a second workshop in the partition root); `new BOS()` asks for a host; `workshop.areas`

## Summary 1 _(between `Phase 2` and `Phase 3`, contains `27` steps from previous phases and summaries)_: extrasteps that was left not done in previous phases

- `steps from Phase 0` - related with clearing the ground:
    - [ ] bos-skillset follows the rename: remote, package name, AGENTS.md and `development` done there locally (2026-11-06); left: pushing `development`, deleting `developement` on GitHub with its dependabot PRs, its own Read the Docs project (the owner; `forge/NOTES-for-repositories.md`) (Q2)
- `steps from Phase 1` - related with the proof of work: none left
- `steps from Phase 2` - related with the loop as code:
    - [ ] The full loop driven (`revision → testing → releasing → master`), `testing`/`releasing` moved to `master` (Q9, Q10: later)
    - [ ] A language-model categorizer behind a bridge: ollama in a docker container (volume in the workshop's nests, the GPU), through its OpenAI-compatible endpoint; words → a case's fields, the verdict stays code (Q17)
    - [ ] Sentiment of the flow, not of people: project linkings, abstractions, a writer's fingerprint (human or LLM, personal tone), code below our standard (Q17)
    - [ ] Rulesets stay JSON; a Markdown page per ruleset generated from a template (as `.gh-wiki`), for the GitHub wiki and Read the Docs (Q18)
    - [ ] Chains learned by BOS itself, from storylines and the commit history (cataclistics: "where in commits history it appears") (inquiry)
    - [ ] The almanac's other sections read by code: roles (agent profiles, ollama modelfiles), scenarios, simulations (inquiry)
    - [ ] A bare new project starts with the same flow: `bos project init` seeds the anatomy, the almanac, hooks, `.github/bos.json` and the workflows (inquiry)
    - [ ] `VIRUSTOTAL_API_KEY` in `publish-env` (the owner)
    - [ ] `bos` without a command, in a terminal: a REPL (readline), each line one `<model> <tool>` (review)
    - [ ] Watching by the models: each element declares what of it is watched, instead of one tree watcher (review)
    - [ ] The release `stable`: what passed the tests of deployment and of dependent projects, on `releasing` (with the full loop)
    - [ ] An LTS line in `versioning` once two majors live side by side (Q12 b)
    - [ ] One shape of every model through `Element` (Q13 c): structure on the class (`Project.anatomy`, `Loop.defaults` beside `children`), a file's default content and its JSON Schema in `<model>/descriptors/`; `bos workshop status` checks a descriptor against its schema (Q13)
    - [ ] Bridges applied to models (Q14 c with a): a model declares its type and its bridges (class defaults), a place overrides them in its `.craft/`; procedures pick the bridges by that (Q14)
    - [ ] Presets of an element in its `.bos/` (Q15: `.bos/` stays, no `.craft/`): `bos.json` (model type, bridges), the rest reconsidered (Q15)
    - [ ] `.omnis.toml` outside a git repository (areas of the workshop): `.gitignore` read by BOS itself (Q16)
    - [ ] What seals a model besides `bos project seal`: `bos close`, the routine (Q16)
    - [ ] A scope's VS Code workspace file in the scope, launched when the scope is opened; repositories in a scope are projects by default (Q15)
    - [ ] The other kinds of bridges, from the owner's map: devops-integration, docs-publishers, apps-extensions, dedicated-implements, project-profiles, scoping-families (owner)
    - [ ] The homepage: `resources/web/public/` (webmanifest, robots.txt, sitemap.xml, llms.txt) generated from package.json, bos.json and the docs; built for GitHub Pages (owner)
    - [ ] Examples: react, vue, astro, each a submodule with its own package.json, run by `examples/Taskfile.yml` (owner)
    - [ ] The second workshop the draft made in `/run/media/sarverott/setternet-A62/` (`.BOS`, `archive`, `craftbook`, `devarmory`, `forge` beside `__WORKSHOP`): removed (the owner)
    - [ ] Mirrors: glossary page `archive/.repos-mirrors` (each mirror a sarcophag) (Q6)
    - [ ] Procedure `archiving`: `bos archive mirror <forge path>` → bare clone `archive/.repos-mirrors/<scope>___<project>.git`, dry run first, the forge copy removed only on confirmation (Q6)
    - [ ] Inspecting: a finding for clones in the forge that belong among the mirrors (Q6)
    - [ ] Mirrors tried on the development workshop; the home workshop's clones move on the owner's order (Q6)

## Phase 3: workplaces 

- [x] A Docker image of BOS (`Dockerfile`; Docker Hub and ghcr.io, done in phase 2)
- [ ] The first image, with the first full release; then its badge in the READMEs
- [ ] Containers: one per agent host CLI (Codex, Claude Code), one for the owner
- [ ] Contexts that isolate: procedures run in `node:vm` contexts, WASI, child processes or a cluster (review: "this all can be used now")
- [ ] Workmodes: sets of Taskfile tasks with file watchers and git hooks
- [ ] The git bridge (`LocalGit` in `src/bridges/git-integration/`, tags only so far) grows: status, add, commit
- [ ] Scrapnote vaults: `craftbook/<scope>___<project>/scrapnotes/` as a git repository (Obsidian vault), `<project>/docs/.scrapnotes` its link, ignored by the project (Q8)
- [ ] Workmode `scrapnotes`: commit every saved note after a quiet moment; `.obsidian/workspace*.json` ignored (Q8)

## Later

- [ ] An API reference on Scalar (`SCALAR_API_TOKEN` in `publish-env`), once BOS has an HTTP API ([TODO] phase)
