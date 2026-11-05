# ROADMAP

Where the core goes, on the version scales of the craft loop. The why is in
[VISION.md](VISION.md), the checklist in [TODO.md](TODO.md).

## Versions

| Event | Project (semver `vX.Y.Z`) | Scope (GRIH `vG.R.I.H`) |
| ----- | ------------------------- | ----------------------- |
| step: one finished, checked piece of work, one commit | Z | H |
| phase: every item of a TODO phase ticked | Y | I |
| milestone: a group of phases that changes what BOS can do | X | R |
| flip: pre-alpha → alpha, a key concept changes | X | G |

`bos version bump <version> <event> [--grih]` computes them;
`bos scope bump <scope> <event>` writes a scope's version into
`<scope>/.bos/scope.json`.

## Milestones

| Milestone | Phases | What BOS can do after it |
| --------- | ------ | ------------------------ |
| M1: the core stands | 0, 1 | build, watch and inspect a workshop from TypeScript |
| M2: the loop runs itself | 2 | move work from `dev/<name>` to `master` and version it without hand work |
| M3: everyone has a workplace | 3 | agents and the owner each work in their own container and branch, in workmodes |
| M4: one BOS | 4 | the skillset, the apps and integrations build on this core |

The reforge is a flip: the core is `1.0.0` from the end of phase 1 (decision
Q7), on npm under the tag `next` until phase 2 is done.
