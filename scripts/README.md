# scripts/

Only what is still required (inquiry of phase 2: "reduce content of scripts/
to only required ones; all that can be ported to typescript should be ported
to typescript").

## Tools

| Script | What | Run by |
| ------ | ---- | ------ |
| `gh-wiki.py` | the docs into the GitHub wiki's checkout (`docs/.gh-wiki`), with Home, _Sidebar, _Footer from `resources/docs-templates/` | `task docs:wiki`, `release.yml` |
| `workflows/*.sh` | the steps of the GitHub workflows, one script each (`_common.sh`: strict mode, the bot's identity, outputs); `workflows/Taskfile.yml` names them | `task workflows:<name>`, `.github/workflows/` |

`gh-wiki.py` is Python on purpose: a build-side tool of the docs, run in the
docs' uv project next to MkDocs. The workflow steps are shell, taken out of
the workflow files so each is readable and runnable by hand (owner, phase 2).
Everything BOS itself does is TypeScript, in `src/`.

## Sketches still to port

Shell scripts of the legacy core (v0.6.1), kept as the first sketch of a
procedure the core has not coded yet. They are read, never run or called from
the core; each is removed when its procedure is coded
(`src/procedures/<name>/`).

| Script | Procedure of the core | When |
| ------ | --------------------- | ---- |
| `shell-procedures/open-project.sh` | `opening`: a project into the forge, on its `dev/<name>` | next |
| `shell-procedures/sweep-into-throwbox.sh` | `sweeping`: loose files of a scope into its throwbox | next |
| `shell-procedures/new-superproject.sh` | `scoping`: a new scope in the forge (with `.bos/scope.json`) | next |
| `shell-procedures/new-sheme.sh` | `sheming`: a new sheme inside a scope | next |
| `archive_mirrors.sh`, `shell-procedures/pull-archive.sh` | `archiving` / `mirroring`: bare mirrors in `archive/.repos-mirrors/` (Q6) | phase 2 |
| `shell-procedures/project-to-sarcophag.sh` | `entombing`: a project into a sarcophag in the archive | later |
| `shell-procedures/synchronize.sh`, `push-to-bos-server.sh` | `synchronizing`: between workshops of the setternet | later |
| `shell-procedures/pack-backup.sh` | `packing`: a backup of a workshop | later |
| `shell-procedures/publicate.sh` | `publishing` through the market-stall host (npm and GitHub releases are `release.yml` now) | later |
| `shell-procedures/purge-workshop.sh` | `sinking` / purging (destructive: needs its own safeguards) | later |
| `assets/container-*.sh`, `assets/interface-creators.sh` | workplaces: a container per contributor | phase 3 |

Procedure names are proposals *(assumed)*; each gets its glossary meaning
checked before it is coded.

## Removed (phase 2)

Replaced by the core, the Taskfile or the workflows; all of them are in the
tag `legacy/v0.6.1` under `src/toolsets/`:
`shell-procedures/deploy-new-workshop.sh`, `env-init.sh` (`bos workshop
bootstrap`); `shell-procedures/start-cli-interface.sh`, `default-runner.sh`
(`cli.ts`); `git-branch.hosts.sh` (`bos flow`); `installer.sh`,
`updater.sh`, `builder.sh`, `deployer.sh`, `tester.sh` (Taskfile tasks,
`release.yml`); `submodule_bos.sh`, `bos_component_create.sh` (the `bos.*`
subrepositories, dropped by Q4).
