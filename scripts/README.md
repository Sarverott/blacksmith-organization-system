# scripts/

Shell scripts of the legacy core (v0.6.1, tag `legacy/v0.6.1`), moved out of
`src/toolsets/` so `src/` holds only the TypeScript core.

They are **reference material**, not part of the running core: each one is
the first sketch of a procedure (`shell-procedures/open-project.sh`,
`sweep-into-throwbox.sh`, `project-to-sarcophag.sh`, `pull-archive.sh`…).
When the core gains that procedure as code (`src/procedures/<name>/`), the
script it replaces is removed. Until then, read them; don't call them from the
core.

| Here | Was a sketch of |
| ---- | --------------- |
| `shell-procedures/` | workshop and project procedures, one per file |
| `assets/` | container build, prepare, publish; interface creators |
| `*.sh` | installer, updater, builder, deployer, tester, env init, mirrors, submodules |
