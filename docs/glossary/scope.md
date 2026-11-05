# Scope

> DRAFT. Formerly *superproject*.

## What it is

A repository that holds a thematic family of [projects](project.md),
[shemes](sheme.md) and their shared [throwbox](throwbox.md), with shared
workspace automation, configs, secret setups and publication setup. Its members
are git submodules. Scopes can nest.

A scope repository is **non-public**. It is carried by a self-hosted server
(e.g. Gitea), which also stores pre-public draft repositories.

## Why it exists

Real work is rarely one repository. A scope keeps the family together, so
shared automation and configuration apply to all of it. Hosting it privately
makes syncing between scattered work stations simple.

## Where

`forge/<scope>/`, e.g. `forge/blacksmith-organization-system/`.
Created with `new-scope <name>`.

## Lifecycle

Opened in the forge, synced through the private server, and archived as
sarcophags (one per member) when closed.

## Open questions

- Which host role runs the private Gitea server? [`TODO`]
