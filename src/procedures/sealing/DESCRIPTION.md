# sealing

Writes a model's halo, `.bos/.omnis.toml` (glossary: [omnis](../../../docs/glossary/omnis.md),
decisions Q15 and Q16), and says what drifted since it was last sealed: files added,
changed, removed. With it, BOS can tell at once whether anything changed while a
project was closed, and notice what nobody meant to change (an injection).

The files are what no `.gitignore` leaves out (git: `LocalGit.files()`), without
what lies in another model (a directory with a `.bos/` of its own). Ignored
directories (`node_modules`, `.venv`) are never entered: their lock files are
counted and stand for them.

Steps: `read` (the sealed halo, if any) → `gather` (the halo now) → `compare`
(the drift) → `write` (only when sealing; with `dryRun` it only says so).
`bos project omnis` runs it without writing; `bos project seal` writes.
