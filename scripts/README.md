# scripts/

Shell scripts of the legacy core (v0.6.1, tag `legacy/v0.6.1`), moved out of
`src/toolsets/` so `src/` holds only the TypeScript core.

They are **reference material**, not part of the running core: each one is
the first sketch of a procedure. When the core gains that procedure as code
(`src/procedures/<name>/`), the script it replaces is removed. Until then,
read them; don't call them from the core.

## The procedures they sketch

| Script | Procedure of the core | Status |
| ------ | --------------------- | ------ |
| `shell-procedures/deploy-new-workshop.sh`, `env-init.sh` | `bootstrapping` | coded (`bos workshop bootstrap`) |
| `shell-procedures/start-cli-interface.sh`, `default-runner.sh` | `cli.ts` | coded |
| `shell-procedures/open-project.sh` | `opening`: a project into the forge, on its `dev/<name>` | next |
| `shell-procedures/sweep-into-throwbox.sh` | `sweeping`: loose files of a scope into its throwbox | next |
| `shell-procedures/new-superproject.sh` | `scoping`: a new scope in the forge (with `.bos/scope.json`) | next |
| `shell-procedures/new-sheme.sh` | `sheming`: a new sheme inside a scope | next |
| `shell-procedures/project-to-sarcophag.sh` | `entombing`: a project into a sarcophag in the archive | later |
| `shell-procedures/pull-archive.sh`, `archive_mirrors.sh` | `mirroring`: `.BOS/data/<pack>.gitlist` into `archive/<pack>/` | later |
| `shell-procedures/synchronize.sh`, `push-to-bos-server.sh` | `synchronizing`: between workshops of the setternet | later |
| `shell-procedures/pack-backup.sh` | `packing`: a backup of a workshop | later |
| `shell-procedures/publicate.sh` | `publishing`: a release, through the market-stall host | later |
| `shell-procedures/purge-workshop.sh` | `sinking` / purging (destructive: needs its own safeguards) | later |
| `git-branch.hosts.sh` | the loop engine (`bos flow`) | phase 2 |
| `installer.sh`, `updater.sh`, `builder.sh`, `deployer.sh`, `tester.sh` | Taskfile tasks (`install`, `build`, `check`) | replaced |
| `assets/container-*.sh`, `assets/interface-creators.sh` | workplaces: a container per contributor | phase 3 |
| `submodule_bos.sh`, `bos_component_create.sh` | the `bos.*` subrepositories (Q4: folded into the core for now) | dropped |

Procedure names in the middle column are proposals *(assumed)*; each gets its
glossary meaning checked before it is coded.
