# proposing

Opens the pull request of a branch's forward step in the craft loop
(glossary: craft-loop): `bos flow next-pr <branch>`. Run by the loop's
workflow on every push to a station or a contributor's branch; safe to run by
hand with `--dryRun`.

1. `route`: the forward step from the project's loop (`.github/bos.json` or the
   default). Nothing to do when the branch is not in the loop, or when
   `autocreate` is off.
2. `weigh`: ask GitHub what the branch has that its target has not. Nothing
   to do when it has nothing, or only merge commits and release bumps
   (`chore(release):`, `bump:`) going back and forth. The release station
   coming back to `development` is the exception: it carries the release.
3. `open`: an open pull request for the step is reported as it is; else one is
   created, its body saying whether it will merge by itself. A dry run stops
   before creating.

From gitrecon's `flow.py next-pr`. Starting the checks of a pull request the
workflow token opened (GitHub starts none for it) comes with the workflows.
