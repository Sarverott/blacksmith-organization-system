# Setup (`.BOS/setup`)

> DRAFT. Older names: `setup/`, `.SETUP`.

## What it is

General-purpose setup for access and connectivity: what the workshop needs to
reach other hosts and services.

## Why it exists

Keys, tunnels and aliases are needed by every project but belong to none. Kept
in one internal place, they can be backed up, audited and carried to a new host
together. *(assumed)*

## Where

`__WORKSHOP/.BOS/setup/`. Mandatory: created at boot if missing.

## Contains

- SSH keys
- VPN setup
- routing setup
- DNS and SSH aliasing
- access tokens and similar general-purpose credentials
- `setternet/`: the workshop's place in the [setternet](setternet.md) (older `.SETTERNET` dir)

## Open questions

- How secrets here are protected (encryption, permissions) [`TODO`]
