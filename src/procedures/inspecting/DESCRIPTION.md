# inspecting

Reads the whole workshop as one coherent environment and changes nothing:

1. `read-areas`: the tree of mandatory areas and descriptors, what exists;
   anything else lying in the workshop root.
2. `read-forge`: every scope in the forge, its GRIH version, and every project
   (git repository) below it: branch, declared version, anatomy.
3. `read-omnis`: every project with a sealed halo (`.bos/.omnis.toml`), against
   its files now.
4. `read-mirrors`: the bare mirrors in `archive/.repos-mirrors/` (Q6), so a
   forge copy that has one is found.
5. `judge`: findings, each with a level (`error`, `warning`, `info`), the path
   and what is wrong. One rule per concern in `rules.ts`.

The report is plain data: the text view draws it, `--json` hands it to
machines as it is.
