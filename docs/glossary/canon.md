# Canon

> DRAFT

## What it is

The authoritative, complete record of all work. It is held by the one
*canon monolith* host in the [setternet](setternet.md), and in the repository
flow by the `canonical` branch, which only the **Canon Keeper** confirms.

## Why it exists

With many hosts and many copies, one of them has to be the truth. Canon is the
copy that must be complete and continuous. Everything else can be rebuilt
from it.

## Lifecycle

forge → archive (sarcophags) → canon monolith

Repository flow (from `docs/README.md`): development → testing → master
(release candidate) → canonical (confirmed by the Canon Keeper). A release is a
commit confirmed into canon.

## Open questions

- Who or what the Canon Keeper is (a person, an automated procedure, both?) [`TODO`]
- How the new branches (drafting, moderation, publishing, testing, revision, releasing) map onto this flow [`TODO`]
