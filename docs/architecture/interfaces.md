# Interfaces

The standard ways to interact with BOS. Every interface stands on the same
`BOS` class (`src/bos.ts`) and the same tool entries (`src/tools/`), so a
command behaves the same however it is reached.

| Interface | State | Where |
| --------- | ----- | ----- |
| CLI: `bos <model> <tool> [operands] [--flags]` | works | `src/cli.ts` |
| Library: `import { BOS, NodeHost } from "blacksmith-organization-system"` | works | `src/index.ts` |
| Task: `task status`, `task watch`… | works | `Taskfile.yml` |
| Machines: `--json` on every tool, one JSON object per line when streaming | works | `src/cli.ts` |
| Serve as an API (HTTP, MCP) | [`TODO`] | bos-skillset has an MCP server today (phase 4) |
| Desktop features (tray, notifications) | [`TODO`] | |

## One tool, every interface

A tool (`src/core/tool.ts`) is one entry: its model and name, its help line, whether it writes, its
arguments (operands and flags, typed), `run(bos, input, io)` and, for people,
`render`. The CLI's help is made from the same entries, and so will be the
next interfaces: an API endpoint or an MCP tool per entry.

```ts
tool({
  model: "workshop",
  name: "status",
  info: "inspect the whole workshop: areas, scopes, projects, findings (reads only)",
  args: [{ name: "all", type: "boolean", info: "show notes too, not only errors and warnings" }],
  run: (bos) => bos.inspect(),
  render: (report, input) => statusText(report, { all: Boolean(input.all) }),
});
```

## From the legacy layout

The legacy core had `system/interfaces/<interface>/` with `index.js`
(declaration), `init.js` (initializer), `loop.js` (execution looper),
`setup.js` (setup object for the main hook) and `on-<event>.js`. Now:
declaration and setup are the tool entries and `cli.ts`; the loop is a
procedure (`watching` waits until stopped); events are storylines records.
