# bootstrapping

Builds the base of the environment: a workshop with its five mandatory areas
(`.BOS`, `devarmory`, `forge`, `craftbook`, `archive`), the parts of `.BOS`
and every descriptor file (`workshop.json`, `nests/.index.json`…).

Creates only what is missing and never overwrites. With `dryRun` nothing is
written; `context.changes` then lists what would be created. When something
was created, the event is recorded in `.BOS/storylines/logs/workshop.jsonl`.

Steps: `ensure-tree` → `record`.
