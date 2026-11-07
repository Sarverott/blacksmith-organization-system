# repairing

Solves what `bos workshop status` finds as `areas-beside-workshop`: areas of a
workshop (`.BOS`, `devarmory`, `forge`, `craftbook`, `archive`) lying beside
`__WORKSHOP`, in the directory that holds it - a second workshop half-made
there, e.g. when a partition root was given where `__WORKSHOP` was meant.
The bootstrap refuses to run while they are there.

Steps: `find` (the misplaced areas) → `plan` (for everything in them: a
directory whose counterpart inside the workshop is missing is **moved** whole,
git repositories with it; a file whose counterpart is missing is moved; one
identical to its counterpart is a **duplicate**; a file BOS writes itself
(`.BOS/workshop.json`, `devarmory/manifest.json`…) whose counterpart exists is
**scaffolding**; anything else that differs is a **conflict**, left where it
is) → `apply` (only with `confirm`: moves, removes duplicates and scaffolding,
then the directories left empty; conflicts stay, with the area that holds
them, for the owner to settle).

Without `confirm` it only says what it would do. Nothing that differs from
what the workshop holds is ever removed.
