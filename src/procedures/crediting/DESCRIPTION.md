# crediting

Keeps a project's `.github/AUTHORS` complete: `bos project authors`. Every
entity of the commits (people, AI agents, bots) is named there (glossary:
authors). Run by the `revision` step of the routine
(`task workflows:authors`); safe by hand with `--dryRun`.

1. `read`: the AUTHORS file (a missing one is empty) and everyone in the
   history of `HEAD` from git: authors, committers, `Co-authored-by`
   trailers, oldest first, each once.
2. `match`: an identity no entry names becomes a new entry (nickname and
   email); one that completes a mentioned entry (a nickname without email,
   an email without nickname) updates it, and the updated entry moves to
   the bottom. Everything else stays as written.
3. `write`: the file, only when something changed. A dry run stops before
   writing.

From the owner's inquiry (phase 2): "all entities present among commits
should be placed there; new one appends file if not present there already".
