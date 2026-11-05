# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q14
in phase 2.

## Q15. `.craft/`: what it replaces, and what `.omnis.toml` is

The owner's answer to Q14 gives each element a `.craft/` folder of presets:
`bos.json`, `setup.yaml`, `.omnis.toml` "with blind checksum halo table",
`meta.ini`, and the model's type and bridges. Three things are open:

1. **What it replaces.** BOS already keeps a place's settings in two other
   spots: a scope's version in `<scope>/.bos/scope.json` (Q5), and a
   project's loop and versioning in `.github/bos.json`.
   - a) `.craft/` replaces both. `.bos/scope.json` becomes
     `.craft/bos.json`. A project's `.github/bos.json` moves to
     `.craft/bos.json`, and the workflows read it there.
   - b) `.craft/` replaces `.bos/` only. `.github/bos.json` stays, because
     it belongs to the GitHub workflows of that one repository.
   - c) Both stay, and `.craft/bos.json` names them.

   *Lean:* a). One place per element is the point of Q13. The workflows can
   read any path.
2. **Four formats** (JSON, YAML, TOML, INI): does each file have its own
   reader on purpose (`setup.yaml` for people to write, `meta.ini` for other
   tools), or can BOS's own files share one format? *Lean:* what BOS writes
   is `bos.json`, with a JSON Schema in `<model>/descriptors/` (Q13). The
   other files are read only where an outside tool needs that format.
3. **`.omnis.toml`, "blind checksum halo table":** [`TODO`]. *Assumed so
   far:* a table of the checksums of the element's files, as the devarmory
   manifest has. It would be "blind" because it holds only hashes, not names
   or content, so it can be shared or mirrored without showing what it
   guards. The "halo" would be the element and what is around it. Please say
   what it is.

