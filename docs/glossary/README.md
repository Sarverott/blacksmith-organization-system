# BOS glossary

> DRAFT. One page per element of the Blacksmith Organization System environment.
> Gaps are marked [`TODO`]. Interpretations not yet confirmed by the author are marked *(assumed)*.
> Sources: author's annotations, `docs/README.md`, `docs/devlog.md`, `docs/scrapnote-example.md` (PL).

## The skeleton: three layers

An ordered workspace is described at three levels. Each page below belongs to one of them.

### 1. Network: hosts

| Element | One line |
| ------- | -------- |
| [setternet](setternet.md) | The network of BOS hosts that belong to one owner |
| [host role](host-role.md) | What a host does in the setternet, defined by its workshop (forging point, canon monolith, …) |
| [canon](canon.md) | The authoritative, complete record of all work |

### 2. Workshop: one per host or partition

| Element | Path | Holds work in state |
| ------- | ---- | ------------------- |
| [workshop](workshop.md) | `~/__WORKSHOP`, `/media/**/__WORKSHOP` | root |
| [system](system.md) | `__WORKSHOP/.BOS/` | BOS itself (internal) |
| [devarmory](devarmory.md) | `__WORKSHOP/devarmory/` | tools: what work is done *with* |
| [forge](forge.md) | `__WORKSHOP/forge/` | active: what is being worked *on* |
| [craftbook](craftbook.md) | `__WORKSHOP/craftbook/` | knowledge: notes, recipes, procedures |
| [archive](archive.md) | `__WORKSHOP/archive/` | at rest: kept safe, full history |

Internal parts of `.BOS/`:

| Element | Path | One line |
| ------- | ---- | -------- |
| [setup](setup.md) | `.BOS/setup/` | Access and connectivity: keys, VPN, routing, aliases, tokens, setternet |
| [data](data.md) | `.BOS/data/` | Data BOS works from (e.g. `*.gitlist`) |
| [nestrelm](nestrelm.md) | `.BOS/nests/` | Volumes and disks of containers and virtual machines |
| [storylines](storylines.md) | `.BOS/storylines/` | Shell history (ttystories), logs, origin metadata, manifests |
| [views](views.md) | [`TODO`] | Every way BOS presents itself: CLI, web, mobile, extension, desktop, OpenAPI, MCP |

### 3. Elements: what lives inside the areas

| Element | Area | One line |
| ------- | ---- | -------- |
| [artefact](artefact.md) | any | Common name for every element BOS manages |
| [scope](scope.md) | forge | Private repository holding a family of related projects (formerly *superproject*) |
| [project](project.md) | forge | One concrete project repository |
| [sheme](sheme.md) | forge | Source material that isn't code: graphics, CAD, photos, templates, references |
| [throwbox](throwbox.md) | forge | Collector of loose files for one scope |
| [sarcophag](sarcophag.md) | archive | Encrypted container holding one bare repository |
| [exhibit](exhibit.md) | archive | [`TODO`] view built from sarcophags / archived references |
| [scrapnote](scrapnote.md) | craftbook | Any note not yet promoted to a document |
| [craftset](craftset.md) | craftbook | Reusable kit of notes, notebooks, scripts and session setup |
| [collection](collection.md) | craftbook? | [`TODO`] |
| [postroad](postroad.md) | ? | [`TODO`] |
| [element anatomy](element-anatomy.md) | any | The descriptor files that most elements carry |

## Tree

```
setternet
└── host  (role: master's outpost | forging point | trial hall | market stall | canon monolith | side catacomb)
    └── __WORKSHOP
        ├── .BOS/            workshop.json  Taskfile.yaml  .omnis.toml  package.json  Dockerfile  compose.yaml
        │   ├── setup/       (setternet/)
        │   ├── data/
        │   ├── nests/       .index.json  .manifest.json
        │   └── storylines/  ttystories/  logs/  manifests/  metadata.json
        ├── devarmory/       tools listed in a manifest
        ├── forge/
        │   └── <scope>/     private repository
        │       ├── <project>/
        │       ├── <sheme>/
        │       └── throwbox
        ├── craftbook/
        │   ├── scrapnotes/
        │   └── <craftset>/  .omnis.toml  metadata.json  manifest.json  Taskfile.yaml
        └── archive/
            ├── <sarcophag>
            ├── <exhibit>
            └── <pack>/<mirror repo>
```

## Lifecycles across the tree

- **work:** forge (open) → archive (closed, sarcophag) → canon monolith (authoritative record)
- **loose files:** throwbox → swept on close → anonymous sarcophag → sorted, reused or deleted
- **notes:** scrapnote → promoted to document, guide or publication (some stay scrapnotes: changelogs, release notes)
- **tools:** listed in the devarmory manifest → downloaded → checksum-verified → linked into PATH or desktop

## Older names

| Now | Before |
| --- | ------ |
| `.BOS/` | `.__BOS/`, `.SETUP`, `.DATA`, `.NESTRELM`, `.STORYLINES` as separate top-level dirs |
| scope | superproject |
| craftbook | scrapbook, `notes/`, CRAFTBOOKS |
| sheme | scheme |
| `~/__WORKSHOP` | `~/.__WORKSHOP` |
