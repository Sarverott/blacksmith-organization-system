# Host role

> DRAFT. From the author's scrapnote (PL). The Polish names are the originals.

## What it is

The job a host does in the [setternet](setternet.md). A workshop exists
everywhere; its role decides what that host is for.

| Role | Original (PL) | Purpose |
| ---- | ------------- | ------- |
| **Master's outpost** | Posterunek Mistrza | Workspace with remote management of every BOS host in the setternet |
| **Forging point** | Punkt Kuźniczy | Workspace for development, compilation and similar work |
| **Trial hall** | Sala Prób | Workspace for virtual machines and testing |
| **Market stall** | Kram Targowy | Publication-only workspace: automatic social media posts and similar actions |
| **Canon monolith** | Monolit Kanonu | Remote archive only: the master record of all projects. Requires complete continuity. Exactly one per setternet. See [canon](canon.md) |
| **Side catacomb** | Katakumb Poboczny | Archive dedicated to one function (publisher, autotester, co-work…), e.g. Ollama, deployments |

## Why it exists

Different machines suit different work. Naming the roles lets BOS know what
to run where, e.g. publish only from the market stall, and keep the full
history only on the canon monolith.

## Where

*(assumed)* Declared in `.BOS/workshop.json` or `.BOS/setup/setternet/`. [`TODO`]

## Relations

- Forging point ↔ [forge](forge.md), [devarmory](devarmory.md)
- Trial hall ↔ [nestrelm](nestrelm.md)
- Canon monolith, side catacomb ↔ [archive](archive.md)
- Market stall ↔ publication (release posts, [postroad](postroad.md)?)

## Open questions

- Can one host hold several roles? [`TODO`]
