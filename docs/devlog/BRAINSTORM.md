# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q12
in phase 2.

## Q13. One way to declare what a model is made of

What a model declares is written in three ways today: `static children` and
`static descriptors` on the class (`descriptors` are functions giving a
file's default content), `ANATOMY` and `ALIASES` as tables in
`models/project/anatomy.ts`, and the loop's defaults as data in
`models/loop/data.ts`. The owner (a review note in `anatomy.ts`): "it looks
fine but we need to unify way we declare things like that". The owner also
made an empty `src/models/devarmory/descriptors/shema.manifest.json`, which
reads as declarations kept as files beside the model.

- a) Everything static on the class, as `children` / `descriptors` are: the
  anatomy becomes `Project.anatomy`, and the loop's defaults `Loop.defaults`.
- b) Everything as files in `<model>/descriptors/`: each descriptor's default
  content and its JSON Schema (`<name>.json`, `schema.<name>.json`). The class
  only names them.
- c) b) for files with content (manifests, settings), a) for structure
  (children, anatomy).

*Lean:* c). Structure is code and is checked by `tsc`. A file's content and
its schema are data that a person, the docs and other tools read without
TypeScript. And `bos workshop status` could then check a file against its
schema.
