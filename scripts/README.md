# scripts/

Only what is still required (inquiry of phase 2: "reduce content of scripts/
to only required ones; all that can be ported to typescript should be ported
to typescript").

## Tools

| Script | What | Run by |
| ------ | ---- | ------ |
| `gh-wiki.py` | the docs into the GitHub wiki's checkout (`docs/.gh-wiki`), with Home, _Sidebar, _Footer from `resources/docs-templates/` | `task docs:wiki`, `loop-master-release-and-publish.yml` |
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
| `shell-procedures/new-superproject.sh` | `scoping`: a new scope in the forge (with `.bos/scope.json`) | next |
| `archive_mirrors.sh` | `archiving` / `mirroring`: bare mirrors in `archive/.repos-mirrors/` (Q6) | phase 2 |
| `shell-procedures/pack-backup.sh` | `packing`: a backup of a workshop | later |

The owner removed the empty and trivial sketches (phase 2); the procedures
they named stay planned without one: `opening` (a project into the forge),
`sweeping` (into a throwbox), `sheming`, `entombing` (into a sarcophag),
`synchronizing` (between workshops), `publishing` through the market-stall
host, purging, and the workplaces' containers (now the `Dockerfile`, phase
3). They are all in the tag `legacy/v0.6.1`.

Procedure names are proposals *(assumed)*; each gets its glossary meaning
checked before it is coded.

## Removed (phase 2)

Replaced by the core, the Taskfile or the workflows; all of them are in the
tag `legacy/v0.6.1` under `src/toolsets/`:
`shell-procedures/deploy-new-workshop.sh`, `env-init.sh` (`bos workshop
bootstrap`); `shell-procedures/start-cli-interface.sh`, `default-runner.sh`
(`cli.ts`); `git-branch.hosts.sh` (`bos flow`); `installer.sh`,
`updater.sh`, `builder.sh`, `deployer.sh`, `tester.sh` (Taskfile tasks,
the release workflow); `submodule_bos.sh`, `bos_component_create.sh` (the `bos.*`
subrepositories, dropped by Q4).
