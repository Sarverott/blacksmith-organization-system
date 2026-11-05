# versioning

Raises a scope's GRIH version (`vG.R.I.H`) for one event of the craft loop:
`step` → H, `phase` → I, `milestone` → R, `flip` → G (`core/version.ts`).
The version lives in `<scope>/.bos/scope.json` (decision Q5); a scope without
one starts from `0.0.0.0`.

1. `bump`: compute and write the new version (only planned with `dryRun`).
2. `record`: append the bump to the workshop's storylines.

Project versions (semver `vX.Y.Z`) follow the same events; wiring them to the
loop (a step per commit, a phase from `docs/devlog/TODO.md`) is phase 2.
