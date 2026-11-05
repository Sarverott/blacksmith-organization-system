# Craft loop

> The way every change travels through the branches of a BOS project, and
> the events (step, phase, milestone, flip) that version it. Phase 2 codes it.

## What it is

```
dev/<name> ──► development ──► revision ──► testing ──► releasing ──► master
                    ▲              │            │            │           │
                    │              └────────────┴─────┬──────┘           │
                    └──────────── rejection ◄─────────┘                  │
                    └────────────────────────────────────────────────────┘
                                 (the release comes back to development)
```

| Branch | Holds | Goes to |
| ------ | ----- | ------- |
| `dev/<name>` | one contributor's work, a person or an agent (`dev/Sarverott`, `dev/Cleo`) | `development`, merged when a batch is done |
| `development` | the accumulation of every contributor's work; here we code | `revision` |
| `revision` | work under review | `testing`, or `rejection` |
| `testing` | work under tests | `releasing`, or `rejection` |
| `releasing` | a release being made: version, changelog, authors | `master`, or `rejection` |
| `master` | the spine of canon; never committed to directly | `development` (the release comes back) |
| `rejection` | what failed a stage | `development` |

Every step between stations is a pull request. The loop opens it by itself;
whether it also merges by itself is a flag per direction (from gitrecon:
`automerge_loopedPR_<from>-<to>`). The data is `resources/loop.json`; the
engine is `bos flow` (phase 2).

## Events and versions

| Event | Project (semver) | Scope ([GRIH](grih.md)) |
| ----- | ---------------- | ----------------------- |
| step | Z | H |
| phase | Y | I |
| milestone | X | R |
| flip | X | G |

## The legacy concept

From the owner's legacy `docs/README.md` (word for word in changelog
phase 1). What became of each idea:

| Idea | Now |
| ---- | --- |
| `developement` as the add-ons sink | `development` (decision Q1), fed by `dev/<name>` |
| `testing` awaiting approval; `releasing` as PDF and a working environment | `revision`, `testing`, `releasing`; what a release carries is [`TODO`] |
| `gh-pages` generated from `master` | Read the Docs builds the documentation; `gh-pages` [`TODO`] |
| `canonical`: the anchor of the core's road, filtered `master` at milestones | [canon](canon.md) and the canon monolith host; the branch [`TODO`] |
| stages by layer: ALPHA in development, BETA in testing, release candidate in master, release after the Canon Keeper | [`TODO`]: pre-release names per station |
| commission: personal fork, PR into a separate sub-dev branch, automatic merge for approved users, approval by a closed issue, signing, the Canon Keeper confirms before releasing, publishing, archiving | `dev/<name>` per contributor and automerge flags (phase 2); approval by issue, signing and the Canon Keeper [`TODO`] |

## Relations

[GRIH](grih.md), [canon](canon.md), [scope](scope.md), [project](project.md).
