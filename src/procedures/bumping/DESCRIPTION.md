# bumping

Moves the project's version when work lands on a station of the loop:
`bos flow bump <station>`. Run by the routine's workflows (`loop-revision-bump-checks-pull-request.yml`,
`loop-master-release-and-publish.yml`); safe by hand with `--dryRun`. Which station bumps what is
the `versioning` section of `.github/bos.json` (default: `revision` minor,
`master` patch).

Every commit on a contributor's branch (`versioning.commits`, default
`dev/*`: a patch) bumps too: `bos flow bump-commit`, run by the pre-commit
hook, so each commit has its own version. Two branches meeting then differ
in the version; the procedure `reconciling` merges it.

1. `read`: the version in `package.json` and the bump of the station (or
   of a commit). Nothing to do when the station has no bump.
2. `check`: a station bumps only once the line it leaves is released: a
   patch needs the tag of that very version (`v1.2.3`), a minor any tag of
   its `X.Y` (`v1.2.*`), a major any of its `X` (`v1.*`). So `1.2.7`, the
   seventh commit after `v1.2.0`, becomes `1.3.0` on `revision`, and
   `master` releases it unbumped; work that reaches `master` released
   already gets the patch (a hotfix). A commit's bump is never checked.
3. `write`: the new version into `package.json` and `package-lock.json`.
   Committing and pushing is left to the caller (the workflow). A dry run
   stops before writing.

From Amoorion's release (a version is released once, by its tag) and the
owner's routine (phase 2, changelog).
