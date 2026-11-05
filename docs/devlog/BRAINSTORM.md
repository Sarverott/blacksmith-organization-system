# BRAINSTORM: open questions

Questions for the owner, `Q<n>`, each with a *Lean:* (what the agent would
pick). Answer in `docs/devlog/ORDERS.md` or in the chat; answered questions
move word for word into `docs/changelog/phase-<n>.md` with their
**Decision:**.

## Q1. `developement` or `development`?

BOS repos here use `developement`; gitrecon and Amoorion use `development`.
The loop config and the workflows need one name (or both as aliases).

*Lean:* rename to `development` in this repo during phase 0 and accept both
in the loop engine as aliases, so old repos keep working.

## Q2. Which repository gets the name `Sarverott/blacksmith-organization-system`?

The core is built here, but this repo's origin is
`OLD-VERSIONS_blacksmith-organization-system`, while `bos-skillset` owns the
canonical name and the npm/GitHub package `blacksmith-organization-system`
(v1.0.1).

*Lean:* the core takes the canonical name and the npm package; bos-skillset
becomes `Sarverott/bos-skillset` (the URL already listed in DRAFT.md).
Renames on GitHub are the owner's to do.

## Q3. What happens to the legacy `src/`?

*Lean:* tag it (`legacy/v0.6.1`), remove it in the first commit of phase 0;
keep only the procedure names as glossary/TODO entries.

## Q4. The `bos.*` subrepositories (models, commands, toolsets, actions, events, factors, interfaces, listeners, methods, controllers)

Submodules, npm dependencies, or folded into `src/` of the core?

*Lean:* fold into `src/` while the core is rebuilt (one repo is easier to
change), split out later only what another project really imports.

## Q5. GRIH: where does a scope keep its version?

*Lean:* a file in the scope directory (e.g. `forge/<scope>/.bos/scope.json`,
`version: "G.R.I.H"`), bumped by the core when any of its projects bumps.
