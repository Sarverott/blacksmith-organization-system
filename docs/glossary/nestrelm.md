# Nestrelm (`.BOS/nests`)

> DRAFT. Older name: `.NESTRELM`.

## What it is

The place for all volumes and disk files of containers and virtual machines
("nests").

## Why it exists

Containers and VMs keep state that isn't source code, but has to survive and
stay traceable. Collecting it here keeps it out of projects, and the index and
manifest guard it. *(assumed)*

## Where

`__WORKSHOP/.BOS/nests/`. Mandatory, and must always contain `.index.json` and
`.manifest.json`.

## Contains

- files, volumes and directories used by containers
- virtual machine directories
- setups of specific daemons
- `.index.json`: what is where
- `.manifest.json`: checksums and other data that guard security

## Relations

VMs and test environments here serve the *trial hall* [host role](host-role.md).
