# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q13
in phase 2.

## Q14. How a bridge is applied to a model

The owner (`src/bridges/README.md`): "bridges should be applicable to models
and depending on how behaviour is defined of each model class it acts
otherwise", and in `git-integration/index.ts`: "plugins that can be applied
to various models to extend their capabilities, propably as interfaces".
Today a procedure makes the bridge it needs (`new LocalGit(host,
project.path)` in `bos.ts`); no model knows its bridges.

- a) Composition: a model lists the bridges it takes (`static bridges =
  [LocalGit, GitHub]`) and gets one of each on demand (`project.bridge(GitHub)`),
  made with its host and its path.
- b) Mixins: `class Project extends withGit(Element)`; the bridge's methods
  become the model's own.
- c) Interfaces only: a model declares it *is* a git repository or a
  publishable package (TypeScript `implements`), and the procedures pick the
  bridges by that.

*Lean:* a). It fits Q13's decision (structure declared on the class, the
shared shape in `Element`), keeps a model's own methods apart from an outside
system's, and a test can hand a model scripted bridges. b) mixes the two and
cannot be undone per model; c) leaves the choosing in every procedure.

