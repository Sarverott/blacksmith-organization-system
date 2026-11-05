# Forge

> DRAFT

## What it is

The active workspace, the equivalent of a desk. It holds only projects that are
open and under active development. If something is in the forge, it is being
worked on.

## Why it exists

It separates active work from everything else. BOS can then give active work
special treatment (watching, autocommit on save, signing, automation) while
leaving the rest alone, and the forge shows at a glance what is in progress.

## Where

`__WORKSHOP/forge/`

## Contains

- [scopes](scope.md): `forge/<scope>/<repository>`, e.g. `forge/blacksmith-organization-system/bos-skillset`
- a periodic [throwbox](throwbox.md)

## Lifecycle

- The forge defines the working branch: artefacts in it are in dev mode and
  carry the user's mid-sync signature.
- On save: a commit is produced (idea: autocommit on every save), signing
  routines run, automation starts.
- When work is closed it leaves the forge; its canon goes to the [archive](archive.md). [`TODO`] exact procedure

## Open questions

- What "mid-sync signature" is technically [`TODO`]
- Naming of the working branch [`TODO`]
