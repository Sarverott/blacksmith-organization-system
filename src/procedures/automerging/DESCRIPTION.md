# automerging

Merges a loop pull request when the loop allows it: `bos flow automerge <pr>`.
Run by the loop's workflow when the checks of a pull request pass.

1. `read`: the pull request from GitHub. Nothing to do when it is not open.
2. `decide`: it merges by itself only when it is the forward step of its head
   branch in the project's loop, that step has `automerge` on, and it comes
   from this repository (never from a fork). A contributor's branch never
   merges by itself. Otherwise it waits for a person.
3. `merge`: merge it (a merge commit, so the loop's history shows every
   step). A dry run stops before merging.

From gitrecon's `flow.py automerge`.
