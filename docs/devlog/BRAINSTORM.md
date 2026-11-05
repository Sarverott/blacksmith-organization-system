# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered (phase 0 of the changelog).

## Q6. The forge holds 325 projects checked out on `master` or `main`

`bos workshop status` on this host: 15 scopes, 334 projects; 325 of them are
on `master`/`main`, many of them clones of others' or the owner's public
repositories (e.g. `forge/sarverott/github-repos/*`). The forge's glossary
says what is in the forge is being worked on, and work happens on
`development`. So either these clones are not forge material, or the rule is
too strict for them.

*Lean:* mirrors and read-only clones belong in `archive/` (glossary: archive
holds mirrors); the warning stays. A scope can mark a folder as mirrors in its
`.bos/scope.json` (`"mirrors": ["github-repos"]`) until they are moved.

## Q7. Which version does the reforged core start from?

`package.json` says `0.6.1` (legacy). npm has `blacksmith-organization-system`
`0.4.2` (latest) and `1.0.0-dev.3` (dev); bos-skillset published `1.0.1` under
the same name on GitHub Packages. The reforge flips the script (CommonJS →
TypeScript, new mechanics).

*Lean:* a flip: `1.0.0` once phase 1 is complete, published to npm as `next`
until phase 2; bos-skillset publishes under `bos-skillset` from then on.

## Q8. Where do scrapnotes of a project go?

gitrecon keeps `docs/devlog/scrapnote-<UNIXUSAT>.md`; the workshop rules put
the owner's loose notes in `craftbook/scrapnotes/`; this repo has
`docs/scrapnote-example.md` and an empty `docs/.scrapnotes/`.

*Lean:* notes of a working round on this project: `docs/devlog/scrapnote-<UNIXUSAT>.md`
(`task devlog:scrapnote`); notes not tied to one project: `craftbook/scrapnotes/`.
`docs/scrapnote-example.md` moves into the devlog.

## Q9. The other local branches of this repo

`drafting`, `moderation`, `publishing`, `dev/reforge`, `dev/submodule-gits`
and the old `revision`, `testing`, `releasing` point at commits of the legacy
core. `dev/reforge` holds one commit not on GitHub.

*Lean:* keep `revision`, `testing`, `releasing` and move them to `master` when
the loop starts (phase 2); tag `dev/reforge` as `legacy/reforge` and delete
the rest locally.
