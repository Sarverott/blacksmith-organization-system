# Devarmory

> DRAFT. "Developer's armory". Element type `devtools`.

## What it is

The set of development tools needed for work in the forge, especially for a
particular scope. The tools are listed in a manifest index, so BOS can download
them automatically and make them reachable: desktop shortcuts, or entries in
the workspace shell's `PATH`.

Belongs here: every custom tool outside the standard `bin` files,
containerized production environments for building or compiling, IDE sets for
packing and uploading microcontroller firmware that share one configuration
across many cases, and every AppImage used by the user or an AI.

## Why it exists

To keep tools intact, and to make it easy to check which tool is missing and
whether its checksum is correct. [`NOTE`] the author has an earlier solution for this and will look it up.

## Where

`__WORKSHOP/devarmory/`

## Contains

- tools and environments
- a manifest index listing them, with checksums *(format [`TODO`])*

## Lifecycle

listed in manifest → downloaded → checksum-verified → linked (shortcut, `PATH`)

## Relations

Its logs go to `.BOS/storylines/logs/`. Craftsets in the craftbook can refer to
tools from here to set up a working session. *(assumed)*
