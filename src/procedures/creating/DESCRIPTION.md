# creating

Makes the elements of the forge (glossary: [scope](../../../docs/glossary/scope.md),
[project](../../../docs/glossary/project.md)), or brings one in from elsewhere:

- `bos scope create <scope>`: `forge/<scope>/` with `.bos/scope.json` (its GRIH
  version, from `0.0.0.0`), its `throwbox/` and its VS Code workspace file.
- `bos project create <scope>/<project>`: the scope as above if missing, the
  project as a git repository on `development`, seeded with the standard
  anatomy from `resources/project-template/` (README, LICENSE, AGENTS.md,
  CLAUDE.md, Taskfile.yml, src/, docs/, tests/, .github/, .gitignore) and its
  `.bos/bos.json`. On a project that exists it only adds what is missing
  (so it is `init` too).
- `bos project import <url>`: a clone from GitHub, any git host or a path,
  into `forge/<scope>/<name>` (the scope: the URL's owner, or `--scope`);
  `--seed` adds the missing anatomy. A clone only kept for reading belongs
  in the archive afterwards (`bos archive mirror`).

Steps: `locate` (names checked, paths) → `scope` (the scope's parts) →
`make` (the repository: init or clone) → `seed` (the template, filled in) →
`workspace` (the scope's `<scope>.code-workspace` lists its projects) →
`report` (the project's anatomy now).

Everything goes through `createIfMissing`: nothing is overwritten; the
workspace file only gets the folders it lacks. A dry run plans exactly what
the real run does.
