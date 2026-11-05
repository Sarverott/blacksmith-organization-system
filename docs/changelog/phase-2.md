


## UNIXUSAT=1793893549104 · commit b567749

The owner merged PR #5, the first opened by the revision workflow: `v1.2.0`
released, on npm `next` and, for the first time, on GitHub Packages as
`@sarverott/blacksmith-organization-system`; the images were skipped (a
pre-release). Then Q12 answered in ORDERS.md and three inquiries; in chat:
"ready! proceede now".

### Q12. What is a "stable LTS full release"?

````text
## Q12
yes in this context you're right:
- a) now (the workflows do it), 
- b) once two majors live side by side
but also check inquiries and threat all naming as draft to be rafined - choice i leave to you
````

- **Decision:** a) now: every full release (not a pre-release) is stable
  and gets the container images; b) later: a marked LTS line (e.g.
  `versioning.lts`) once two majors live side by side. The names in the
  inquiries are drafts and the agent's choice: `latest` and `nightly` kept
  as the owner wrote them, `stable` left for the full loop.

### Inquiries

````text
## more to be printed about package among readme files

- https://bundlephobia.com/package/blacksmith-organization-system
- https://socket.dev/npm/package/blacksmith-organization-system
- https://snyk.io/advisor/npm-package/blacksmith-organization-system
- https://npmgraph.js.org/?q=blacksmith-organization-system
- feeding virustotal with all of release files: https://www.virustotal.com/


## release tag to be created and updated on each 
- latest release that was published:s https://github.com/Sarverott/blacksmith-organization-system/releases/tag/latest
- dev early revision pre-releasing: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/nightly
- that passes all tests from deployment and depending projects that also is placed in "releasing" branch [later on to be implemented]: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/stable

## every commit in dev branches bumps hotfix
it should at local level bump Z number before commit of semver (vX.Y.Z) so every commit has now own version. these can be placed in husky hooks but remember to invoke disabling var for husky while bumping version (increment command like `npm version` makes commit so if we place in pre-commit version shift it ends up with infinite loop of DDoS)
````

- **Decision (package reports):** a third badge row in every README:
  bundlephobia, socket.dev, Snyk advisor, npmgraph (each its report page),
  VirusTotal (the `latest` release, whose notes link the reports) and
  `nightly`. Static badges: the dynamic ones read npm's `latest` tag, still
  the legacy `0.4.2` while the core is on `next` (Q7). Every file of a
  versioned release (the package's `.tgz`, now attached, and the source
  archives) goes to VirusTotal; the release notes get a "VirusTotal" section.
  It needs `VIRUSTOTAL_API_KEY` in `publish-env` (the owner adds it; until
  then the step says so and scans nothing).
- **Decision (release tags):** tags that move, each with a GitHub release
  following it, never GitHub's "Latest": `nightly` (every push to
  `revision`, a pre-release with the `.tgz`, not on npm), `latest` (every
  release, with its `.tgz`), `stable` [TODO] (the `releasing` station, once
  the full loop runs). Script `rolling-release.sh`.
- **Decision (a patch per commit):** `versioning.commits` in
  `.github/bos.json` (default `dev/*`, `patch`): the pre-commit hook runs
  `bos flow bump-commit` with `HUSKY=0` and stages `package.json` and its
  lock into the commit, so nothing commits from inside the hook and nothing
  loops. Two consequences, solved in code: (1) two dev branches always meet
  with different versions, so `.gitattributes` gives both files the merge
  driver `bos flow merge-version` (procedure `reconciling`: the higher
  version on every side, then `git merge-file`), registered by the hook
  (`task hooks:merge-driver`) and by the workflows' merges; (2) a version
  with commit patches is never tagged itself, so a station's bump now asks
  whether the line it leaves is released: a minor on `revision` needs any
  `v<X.Y>.*` (`1.2.7` → `1.3.0`), a patch on `master` needs that very
  version (a hotfix) *(assumed: the rule that keeps the routine as it was)*.
