# System (`.BOS`)

> DRAFT. Older names: `.__BOS`, and separate top-level `.SETUP`, `.DATA`, `.NESTRELM`, `.STORYLINES`.

## What it is

The internal directory where BOS keeps itself inside a workshop: its settings,
keys, customization, working data and records. It is the only hidden area;
everything else in the workshop is the owner's work.

## Why it exists

It keeps everything BOS needs to run a workshop (and to rebuild it on another
host) in one place, apart from crafted work, so the four crafting areas stay
clean.

## Where

`__WORKSHOP/.BOS/`. Mandatory: if missing, BOS initializes it at boot.

## Contains

| Item | Role |
| ---- | ---- |
| [`setup/`](setup.md) | access and connectivity setup |
| [`data/`](data.md) | data BOS works from |
| [`nests/`](nestrelm.md) | container and VM volumes |
| [`storylines/`](storylines.md) | history and records |
| `workshop.json` | workshop definition: its areas, and *(assumed)* its role |
| `Taskfile.yaml` | workshop procedures ([Task](https://taskfile.dev) runner) |
| `.omnis.toml` | [`TODO`] |
| `package.json` | Node dependencies of the local BOS |
| `Dockerfile`, `compose.yaml` | containerized BOS services |

See [element anatomy](element-anatomy.md) for the descriptor files.

## Open questions

- What `.omnis.toml` holds [`TODO`]
- Does the BOS code itself live here, or elsewhere (e.g. forge or devarmory)? [`TODO`]
