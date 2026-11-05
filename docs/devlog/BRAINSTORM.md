# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1.

## Q10. Which loop steps merge by themselves?

The default loop (`src/models/loop/data.ts`) takes gitrecon's flags:
`development → revision`, `revision → testing`, `testing → releasing` merge
by themselves once their checks pass; a contributor's `dev/<name>` →
`development` never does. Two differ from gitrecon: `releasing → master`
waits for a person (gitrecon merged it by itself), as the legacy concept had
the Canon Keeper confirm every release; `master → development` (the release
coming back) waits too, as in gitrecon.

*Lean:* keep it so: one person's merge into `master` per release, everything
before it automatic. Also: should `dev/Cleo` → `development` merge by itself
when its checks pass (agents' batches), while `dev/Sarverott` stays manual?

## Q11. When does the loop start running on GitHub?

`bos flow` works, but nothing calls it yet. Starting it means: workflows on
push to `development`, `revision`, `testing`, `releasing`, `rejection`,
`dev/*` that run `bos flow next-pr`, and on passing checks `bos flow
automerge`; and the stations created on GitHub from `development` (today
`revision`, `testing`, `releasing` exist only here, on the legacy commit,
and `master` holds the legacy README). The first loop would carry the whole
reforge into `master`.

*Lean:* reset the local `revision`, `testing`, `releasing` to `development`,
push them, add the workflows with only `workflow_dispatch` first, run one
loop by hand to `releasing`, and let the owner merge the first `releasing →
master` (that is the `v1.0.0` release, published to npm by the release
workflow).
