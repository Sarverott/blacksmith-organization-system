# Archive

> DRAFT

## What it is

Repositories at rest: the integrity base of the workshop. It holds scopes as
compressed, individual parts with their full history, mirrors buffering
between the craftspace and remote servers, and non-releasable repositories.

## Why it exists

Work must survive machine loss, version collisions and remote services going
away. The archive holds a local, trustworthy copy of everything, apart from the
fast-changing forge.

## Where

`__WORKSHOP/archive/`

## Contains

- [sarcophags](sarcophag.md): encrypted containers, one bare repository each
- [exhibits](exhibit.md)
- mirror packs: `archive/<pack>/<repo>`, filled from `.BOS/data/<pack>.gitlist` by `pull-archive`

## Lifecycle

Closed forge work and swept throwboxes arrive here as sarcophags. The local
archive feeds the [canon](canon.md) held by the *canon monolith* host.

## Open questions

- Encryption method for sarcophags [`TODO`]
