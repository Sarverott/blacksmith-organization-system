# Workshop

> DRAFT

## What it is

A BOS instance enclosed in one folder: the root of all crafting on a host or
partition. A directory named `__WORKSHOP` is a workshop.

- **Per user:** `~/__WORKSHOP`
- **Per partition:** `/media/**/__WORKSHOP`

Every host in the [setternet](setternet.md) has its own workshop, and the
workshop defines the host's [role](host-role.md) in the multi-host system.

## Why it exists

A programmer's work gets scattered across machines, drives and servers, and
copies drift apart: "variantogeddon". A workshop gives every host the same
fixed shape, so:

- people and tools (BOS, AI agents) always know where things belong
- work in different states (tools, active, knowledge, at rest) is kept apart
- routine work (sorting, syncing, archiving, publishing) can be automated

## Contains

| Dir | Role |
| --- | ---- |
| [`.BOS/`](system.md) | BOS itself: setup, data, nests, storylines, workshop descriptors |
| [`devarmory/`](devarmory.md) | tools |
| [`forge/`](forge.md) | active work |
| [`craftbook/`](craftbook.md) | notes, recipes, procedures |
| [`archive/`](archive.md) | work at rest |

All five are mandatory. BOS creates any missing one at boot.

## Rules

- A machine can hold several workshops (home plus partitions). They are
  independent: nothing is moved or synced between them unless asked.
- The active workshop is the one named by `--workshop`, else `$BOS_WORKSHOP`
  (the workshop itself), else `$WORKSHOP_ROOT/__WORKSHOP` (the directory that
  holds it, e.g. a partition), else the nearest parent directory named
  `__WORKSHOP`, else `~/__WORKSHOP`.
- `$WORKSHOP_RENAME` gives the workshop directory another name (e.g.
  `.__WORKSHOP`); every rule above then looks for that name.
- A development workshop: the core is developed, tested by hand and
  demonstrated on a workshop of its own (`WORKSHOP_ROOT` in the core's `.env`),
  so the home workshop is not exposed every time BOS is worked on.

## Lifecycle

Its origin (which host created it, and when) is recorded in
`.BOS/storylines/metadata.json`. Launches, shutdowns, and project openings and
closings are recorded in storylines.

## Open questions

- Is a workshop named (`workshopName` in model data)? [`TODO`]
