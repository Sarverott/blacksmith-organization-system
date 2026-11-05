# reconciling

A git merge driver for the version of `package.json` and
`package-lock.json`: `bos flow merge-version <base> <ours> <theirs>`. Every
commit on a contributor's branch bumps the patch (versioning `commits`), so
two branches meeting in `development` always differ in the version line and
a plain merge would conflict there every time. Registered by `.gitattributes`
(`merge=bos-version`) and `git config merge.bos-version.driver` (the
pre-commit hook and the workflows' merges set it; without it git merges as
usual).

1. `read`: the three sides git hands over (base, ours, theirs) and the
   version of ours and theirs.
2. `align`: the higher of the two versions is written into all three, so
   the version is no longer a difference between them.
3. `merge`: the usual three-way merge of what is left (`git merge-file`)
   into ours; a real conflict elsewhere stays a conflict.

From the owner's inquiry (phase 2): "every commit in dev branches bumps
hotfix".
