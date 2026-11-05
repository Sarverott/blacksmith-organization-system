# Element anatomy

> DRAFT. A pattern seen across the author's annotations, written down to be
> confirmed: most BOS elements are **a directory plus descriptor files**.

## Descriptor files

| File | Role | Seen in |
| ---- | ---- | ------- |
| `metadata.json` | identity and origin: what it is, who or what host created it, when | craftset, storylines |
| `manifest.json` / `.manifest.json` | integrity: checksums and security data | craftset, nests, storylines `manifests/`, devarmory manifest |
| `.index.json` | map: what is where | nests |
| `Taskfile.yaml` | procedures: the element's commands ([Task](https://taskfile.dev)) | craftset, `.BOS` |
| `.omnis.toml` | [`TODO`] | craftset, `.BOS` |
| `workshop.json` | the workshop's own definition | `.BOS` |

## Why it matters

If every element describes itself the same way, BOS doesn't need special code
per element. One reader handles any directory: identify it (metadata), verify
it (manifest), navigate it (index) and operate it (Taskfile). This is the
"skeleton" of an ordered workspace. It also matches the old notes' wish for
"taskfile, husky and a standard command set".

## Open questions

- Is this the intended rule for all elements (scope, project, sarcophag…), or only some? [`TODO`]
- What `.omnis.toml` holds, and how it differs from `metadata.json` [`TODO`]
- JSON schemas for these files [`TODO`]
