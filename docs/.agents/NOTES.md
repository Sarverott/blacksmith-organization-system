# NOTES

Findings, assumptions and what is untried, by the agents working here.
Newest on top, dated. People read this file; they answer in `docs/devlog/`.

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
