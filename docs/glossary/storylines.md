# Storylines (`.BOS/storylines`)

> DRAFT. Older name: `.STORYLINES`.

## What it is

The records of what happened in the workshop:

- **ttystories:** raw shell history dumps, taken often and from parallel
  terminals, so every command used is kept without gaps. File names:
  `ttystory.txt`, `ttystory-$UNIXUSAT.txt`, `ttystory-$HOSTNAME-$UNIXUSAT.txt`.
  `UNIXUSAT` ("unix-us-at") is a Unix timestamp in milliseconds.
- **workshop history:** creation metadata, system launches and shutdowns,
  openings and closings of projects.

## Why it exists

- to reuse every known pattern of commands
- to teach AI to use the shell the way BOS does
- to record how the tree of ttystories grows and branches
- to investigate recognizable patterns in command combinations

## Where

`__WORKSHOP/.BOS/storylines/`. Not required to launch. It is created during
active use of the workshop.

## Contains

- `ttystories/`
- `logs/`: logs of BOS and related tools from devarmory or forge
- `metadata.json`: origin of the workshop instance (which host created it, and when)
- `manifests/`: recorded identities of repositories, system elements and file
  checksums. Later compressed, garbage-collected or otherwise reduced [`TODO`] method

## Open questions

- Can the history be proven, e.g. timestamped with OpenTimestamps or on a blockchain? [`TODO`]
