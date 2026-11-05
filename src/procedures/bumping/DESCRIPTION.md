# bumping

Moves the project's version when work lands on a station of the loop:
`bos flow bump <station>`. Run by the routine's workflows (`loop-revision-bump-checks-pull-request.yml`,
`loop-master-release-and-publish.yml`); safe by hand with `--dryRun`. Which station bumps what is
the `versioning` section of `.github/bos.json` (default: `revision` minor,
`master` patch).

1. `read`: the version in `package.json` and the bump of the station.
   Nothing to do when the station has no bump.
2. `check`: a version is bumped only once it is released, i.e. tagged
   (`v<version>`). An unreleased version is kept, so a release that passes
   `revision` and then `master` is bumped once, by `revision`, and
   `master` releases it; work that reaches `master` without `revision` gets
   the patch.
3. `write`: the new version into `package.json` and `package-lock.json`.
   Committing and pushing is left to the caller (the workflow). A dry run
   stops before writing.

From Amoorion's release (a version is released once, by its tag) and the
owner's routine (phase 2, changelog).
