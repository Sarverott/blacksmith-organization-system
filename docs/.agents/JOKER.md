# Joker: dependency maintenance

## 2026-11-08 · scope and initial inventory

User request: apply bos-skillset's `handling-dependabot-prs` skill to the core, handle the backlog, improve Dependabot/workflows, and keep the agent's reasoning here. Source: `../bos-skillset/skills/handling-dependabot-prs/SKILL.md` and its references.

Verified target: `Sarverott/blacksmith-organization-system`; default branch `master`; all 13 bot PRs target `development`. Work is isolated on `dev/Joker` in `/tmp/bos-core-dependabot`, starting at `85e126c`. The original checkout remains on `dev/Cleo`. Upstream owner SECURITY.md is preserved. No pending ORDERS/INQUIRIES or open BRAINSTORM questions.

The almanac's free-text categorizer returned UNKNOWN for a sentence containing several actions/branches. The explicit owner request and AGENTS.md routine authorize dependency maintenance and integration into development/revision; they do not authorize merging the release to master.

Baseline: Node 24.21.0; `task check` passed (26 files, 113 tests) on the original `35e906b` checkout. The worktree includes the newer owner security-policy commit. Existing docs `uv.lock` already resolves newer packages than requirements.txt; `uv export --locked` exposed baseline drift. The six documentation PRs do not fix that complete drift.

| PR | Initial head | Proposed change | Initial decision |
| --- | --- | --- | --- |
| [#18](https://github.com/Sarverott/blacksmith-organization-system/pull/18) | `c675c7ad13272513c03e0b6806c5320c19409e68` | build(deps): bump node from 24-alpine to 25-alpine | Defer runtime major: keep Node 24 until a separately validated runtime migration. |
| [#19](https://github.com/Sarverott/blacksmith-organization-system/pull/19) | `05ced407a8a8a49652cf27a49be905d558a86909` | build(deps): bump actions/checkout from 5 to 7 | Review migration and validate Actions v7 in CI. |
| [#20](https://github.com/Sarverott/blacksmith-organization-system/pull/20) | `5ba1a72f8ce0ebcc172ca4387f6688753a17418e` | build(deps): bump actions/setup-node from 5 to 7 | Review migration and validate Actions v7 in CI. |
| [#21](https://github.com/Sarverott/blacksmith-organization-system/pull/21) | `570c8ead5f0af0ed25ced38ab5b3aac9b15df980` | build(deps-dev): bump @biomejs/biome from 2.5.14 to 2.6.4 | Repair schema and account for newly enabled Markdown formatting; validate. |
| [#22](https://github.com/Sarverott/blacksmith-organization-system/pull/22) | `0660aa1a04ff1fd4dd2d896c58950709a269c9aa` | build(deps): bump mkdocs-material from 9.7.7 to 9.8.0 in /docs | Already in uv.lock (9.8.0); synchronize export and verify. |
| [#23](https://github.com/Sarverott/blacksmith-organization-system/pull/23) | `2eefbce5243a99367f4767f04149450cded16b03` | build(deps): bump certifi from 2026.7.22 to 2026.10.23 in /docs | Already in uv.lock (2026.10.23); synchronize export and verify. |
| [#24](https://github.com/Sarverott/blacksmith-organization-system/pull/24) | `5454c2809c1c0848bf2457b88f35b509ecfcfbc5` | build(deps-dev): bump inquirer from 12.11.1 to 14.2.5 | Blocked: @commitlint/cz-commitlint@21.2.4 requires Inquirer 9–12. |
| [#25](https://github.com/Sarverott/blacksmith-organization-system/pull/25) | `64ff62d6debd276c478688289842f25f7c3e88fb` | build(deps): bump pymdown-extensions from 12.1 to 12.3 in /docs | Already in uv.lock (12.3); synchronize export and verify. |
| [#26](https://github.com/Sarverott/blacksmith-organization-system/pull/26) | `3f282c59d3ae51527522161bf7f8ba0f11eac20c` | build(deps): bump markupsafe from 3.0.3 to 3.0.4 in /docs | Already in uv.lock (3.0.4); synchronize export and verify. |
| [#27](https://github.com/Sarverott/blacksmith-organization-system/pull/27) | `173d113cb3d6af1a16ca455ad5198823f59562e3` | build(deps): bump watchdog from 6.0.0 to 7.0.0 in /docs | Already in uv.lock (7.0.0); synchronize export and exercise live rebuild. |
| [#28](https://github.com/Sarverott/blacksmith-organization-system/pull/28) | `7fb688605ab4bcd96bc1585af8508355a07c50a8` | build(deps): bump backrefs from 8.0 to 8.1 in /docs | Already exceeded in uv.lock (8.2); synchronize export and verify. |
| [#29](https://github.com/Sarverott/blacksmith-organization-system/pull/29) | `6e10184f8426d92b99ecb5ddad9766d3f54b7878` | build(deps-dev): bump @go-task/cli from 3.45.4 to 3.54.0 | Blocked after trial: five high-severity npm audit findings via proxy-agent → pac-proxy-agent → get-uri → basic-ftp (GHSA-c475-qrg2-pj4r). Baseline reports zero; the candidate was removed. |
| [#30](https://github.com/Sarverott/blacksmith-organization-system/pull/30) | `be53da76bb1af1879d9046728f57cec09c103aea` | build(deps-dev): bump typescript from 5.9.3 to 7.0.2 | Blocked: openapi-typescript@7.13.0 requires TypeScript ^5.x; do not bypass peers. |

Complete initial inventory: authenticated paginated REST pull listing, November 8. Full file lists, status rollups, reviews and review threads inspected for every head: no review submissions or unresolved threads. Green old CI alone is insufficient: docs PRs mostly changed only requirements.txt, while docs CI uses uv.lock.

Diagnosed red jobs: #30 and #24 fail npm peer resolution; #21 has a stale schema plus 64 formatting errors after Markdown formatting became active; #27 fails the daemon log race already repaired by `124fd7f` on current development.

## Plan

1. Consolidate compatible npm updates and synchronize the docs export from the existing lock; run clean install, checks, build/package and frozen docs plus live rebuild.
2. Group routine updates weekly with three version PRs per ecosystem; keep majors separate, retain npm/uv/Actions/Docker, remove the absent Compose updater.
3. Add a non-mutating docs lock/export check to existing CI and a read-only scheduled/manual dependency-health workflow. No bot approval or privileged PR code execution.
4. Commit checked steps on dev/Joker, merge with --no-ff into development, push development to revision, and verify remote artifacts before closing superseded PRs.
5. Refresh the queue and record exact landed SHAs, test evidence and activation state. Dependabot policy only activates after the owner merges the routine revision → master PR.

## Reviewed candidate and local verification

- Accepted equivalents: #19, #20, #21, #22, #23, #25, #26, #27, #28.
  No bot PR is directly merged: contributor work follows the core's prescribed
  `dev/Joker → development → revision` route. Originals will be closed only
  after the remote target contains their replacement.
- Actions v7 reviewed against the maintainers' migration notes:
  <https://github.com/actions/checkout#whats-new> and
  <https://github.com/actions/setup-node#whats-new-in-v7>.
  Current workflows use hosted runners, no pull_request_target/workflow_run,
  no always-auth input, and provide real NODE_AUTH_TOKEN values in publishing
  jobs. Checkout's safer defaults remain enabled; hosted CI must verify the
  candidate before these original PRs are closed. Publishing is not exercised.
- Biome 2.6.4 and its schema agree. Its newly active Markdown/YAML formatters
  are explicitly disabled to preserve the previous formatting coverage,
  including verbatim owner history; existing code lint/format checks stay on.
- The docs lock is unchanged. The export now follows it, including baseline
  upgrades beyond the six PR titles: Backrefs 8.2, Markdown 3.11.2,
  Platformdirs 4.14.5, python-dateutil 4.0.0 and tzdata 2026.6 replacing six.
  These were already what uv-based CI installed; Read the Docs now agrees.
- `npm ci`: passed; no forced peer overrides. `npm audit --audit-level=high`:
  zero vulnerabilities. Task stays at 3.45.4; TypeScript 5.9.3; Inquirer 12.11.1.
- `task check`: passed, 26 files / 113 tests. A sandbox trial from /tmp could
  not spawn/read properly; the authorized unsandboxed rerun passed.
- `npm run build` and `task workflows:package`: passed; the packed CLI installed
  and printed its version in an empty temporary npm project.
- `task docs:check-lock`, `task docs:test-lock` (3 real uv regression fixtures),
  `task docs:build --strict`, and `uv pip check`: passed.
- A temporary MkDocs Material server with the locked environment served a page,
  detected an actual edit via Watchdog 7, rebuilt, and served the changed text.
  The server stopped and its fixture was removed; no real workshop was used.
- `docker build --tag bos-dependency-check-joker .` and its `--version` run:
  passed on Node 24 Alpine. No image was published or workshop mounted.
- Workflow and policy YAML parsed with duplicate-key rejection; `git diff
  --check` passed. Actions v7 still needs the exact committed candidate's hosted CI.

## Maintenance policy and next round

- Monday 07:00 Europe/Warsaw, one routine minor/patch group per ecosystem;
  majors remain separate. Limits: three for Actions/uv/Docker; four for npm
  so its three currently blocked PRs leave a slot for routine updates.
  Security updates retain GitHub's independent limit and default-branch route.
- The unused Compose updater is removed. npm remains enabled for the real core
  package; uv owns the docs project and its generated requirements file.
- Reusable code checks now gate on `npm audit --audit-level=high`; docs checks
  reject lock/export drift and build with `--locked`. Local repair command:
  `task docs:lock`; local verification: `task docs:check-lock` and
  `task docs:test-lock`.
- `checks-dependency-health.yml` repeats full checks weekly/on manual dispatch;
  it also builds/runs the image and checks image/config PRs. Read-only token,
  no publication, automatic approvals, or privileged execution of PR code.
- Keep #24 and #30 open until upstream peers support the requested majors;
  keep #29 open until its new proxy chain is fixed without peer/security bypass.
  Keep #18 open for a separately validated supported Node runtime migration.
- Activation remains pending: Dependabot and schedules read the default branch
  (`master`). The usual revision → master PR is the owner's review point.

## Hook isolation repair discovered during commit

The pre-commit test task inherited Git's repository-local hook environment
(`GIT_DIR`, `GIT_INDEX_FILE`, etc.). Fixture `git init`, `commit` and `checkout`
therefore targeted the actual repository metadata, even though their files
were temporary. The hook refused the commit. No polluted history was pushed.
This is independent of the dependency updates: ordinary `task check` passed.

A metadata snapshot was saved under `/tmp/bos-core-hook-recovery`. The test
commits remain reachable at local `refs/bos-recovery/2026-11-08-hook-fixtures`.
The affected `dev/Joker` ref, its index and `core.bare` were restored to the
recorded base without touching working files. Cleo's branch stayed at
`35e906b`; its checkout is again clean. The test-created local `dev/a` is left
in place, not pushed. No contributor commits were removed.

`.husky/test` now unsets the exact variable list from
`git rev-parse --local-env-vars` before running Vitest. Earlier staged-file
checks keep the commit's original index environment. A regression runs that
wrapper with real injected hook variables and verifies a new repository is
created in the fixture while the parent's config/index stay untouched.
