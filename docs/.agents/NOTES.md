# NOTES

Findings, assumptions and what is untried, by the agents working here.
Newest on top, dated. People read this file; they answer in `docs/devlog/`.

## 2026-11-08 · Joker · Dependabot batch and recurring checks

The core had 13 open bot PRs. Several docs updates touched only the export,
while the lock already contained those versions. A consistency guard now
checks the real pyproject → lock → export chain, with regression fixtures;
reusable CI audits npm and builds locked docs. Weekly groups and a dependency
health/container workflow prepare a smaller recurring queue.

TypeScript 7 and Inquirer 14 have incompatible peers. Task 3.54.0 introduced
five high-severity audit findings through its proxy chain in a clean trial,
versus zero on the baseline; it is held too. Node's runtime major needs its
own validation. Evidence, exact initial heads, disposition and activation
state are in [JOKER.md](JOKER.md).

## 2026-11-05 · Cleo · the owner's review notes, mirrors

**Found**

- `@go-task/cli` (a devDependency since this batch) installs `node_modules/.bin/task`.
  It is a Node wrapper (`run-task.js`) that returns the binary's status and never
  exits with it, so it always exits 0. Husky puts `node_modules/.bin` first in PATH
  (`npm run` and `npx` do too, with an absolute path). So every hook passed, even
  when biome, tsc or vitest failed: 14 of the owner's commits went in without their
  formatting fixes, and two of them with lint errors. `.husky/task` now runs the task
  binary from PATH without any `node_modules/.bin`, else the binary the package
  downloaded. `tests/hooks.test.ts` keeps it so. Upstream: worth an issue at
  go-task/task (the npm wrapper should `process.exit(status)`).
- Every mirror page (gitea.com, gitlab.com, bitbucket.org, git.sr.ht) answers
  200 today, so the repositories exist. Whether gitea.com runs Gitea Actions for
  this account is untried.

## 2026-11-05 · Cleo · second batch (development workshop, Q6–Q9)

**Found**

- VSCodium held 64,826 of this user's 65,536 inotify watches
  (`fs.inotify.max_user_watches`). Node's recursive `fs.watch` then reported no
  change and no error: `bos workshop watch` was deaf without saying so. The core
  now watches one directory per watcher and skips `.git`, `node_modules` and
  storylines, and running out of watches is an error. All 41 tests pass in a
  `node:24-slim` container (root has its own quota); on this host the live watch
  test skips itself while the watches are taken, and `bos workshop watch` on the
  development workshop stops with the limit's message.
- The development workshop `/run/media/sarverott/setternet-A62/__WORKSHOP` was
  already bootstrapped by the owner (10:54, 14 paths); the dry run finds nothing
  missing, status shows 0 scopes and no findings.
- Every commit of the deleted local branches is reachable from a tag, GitHub or
  `development`: nothing was lost (Q9).

**Assumed**

- The owner's message named `WORKSHOP_PATH`; `.env.example` names
  `WORKSHOP_ROOT` (the directory holding `__WORKSHOP`) and `WORKSHOP_RENAME`.
  The code follows the file. *(assumed)*
- A mirror's and a scrapnote vault's name: `<scope>___<project>`; a nested scope
  joins its parts with `___` too. *(assumed)*

**Untried**

- The live watch on this host until watches are free (close VSCodium windows on
  big trees, or `sudo sysctl fs.inotify.max_user_watches=524288`).
- `npm publish --tag next` of `1.0.0` and the tag `v1.0.0`: waiting for the owner.

## 2026-11-05 · Cleo · first batch (Q1–Q5, inquiries)

**Found**

- GitHub was already renamed by the owner: `Sarverott/blacksmith-organization-system` is this
  core (its `developement` head was `c7da0df`, same as here), `Sarverott/bos-skillset` is the
  skills. Read the Docs (`blacksmith-organization-system`) points at the core's URL.
- This repo's `origin` still says `OLD-VERSIONS_blacksmith-organization-system`; GitHub
  redirects it, so it works. bos-skillset's `origin` says `Sarverott/blacksmith-organization-system`,
  which is now the core: **a push from bos-skillset would go to the core's repository.**
  Repointing both remotes was refused by the permission check (not by the owner); the commands
  are in TODO.md and in `forge/NOTES-for-repositories.md`.
- A `git fetch` run in bos-skillset before that was known fetched the core's branches into
  its `origin/*` refs (`origin/reforge`). Harmless; `git fetch --prune` after the repoint clears it.
- `bos workshop status` on this host: 15 scopes, 334 projects, 0 errors; 325 projects on
  `master`/`main` (Q6), 2 still on `developement` (BOS and bos-skillset), `.claude` in the
  workshop root (now allowed next to `CLAUDE.md`). The whole run takes about 0.1 s.
- npm: `blacksmith-organization-system` has `0.4.2` (latest) and `1.0.0-dev.3` (dev);
  bos-skillset published `1.0.1` under the same name on GitHub Packages (Q7).

**Assumed**

- Scope versions live in `<scope>/.bos/scope.json` (lowercase `.bos`, Q5's *Lean:*), next to
  the workshop's `.BOS`. A scope without one counts from `0.0.0.0`.
- A project is any git repository below a scope, at most 3 levels down, not searched inside;
  the scope itself may also be a repository.
- ORDERS.md and INQUIRIES.md: the owner writes below their `---`; `bos devlog state` reads
  "waiting" from there.

**Done on GitHub**

- `development` pushed (Q1). Deleting `developement` there was refused by the permission
  check; its head `c7da0df` is contained in `development`, so the owner can delete it safely.

**Untried**

- `check.yml` ran green on GitHub for `development` (run 41997472302, tests + docs).
  `npm-publish.yml` has not run: no release yet; it needs the `npm_token` secret.
- `NodeHost.watch` uses `fs.watch` recursive: tested on Linux; macOS and Windows not tried.
- Read the Docs builds from `master` or the default branch: until `development` reaches
  `master`, the site still shows the old state.
