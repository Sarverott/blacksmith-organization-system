// bos workshop <tool>
import { tool } from "../core/tool.ts";
import { eventText } from "../views/event.ts";
import { bootstrapText, statusText } from "../views/status.ts";

export const workshopTools = [
  tool({
    model: "workshop",
    name: "locate",
    info: "the active workshop and the rule that found it",
    run: (bos) => ({ root: bos.workshop.path, source: bos.workshop.located?.source ?? null }),
    render: (result) => `${result.root}  (found by: ${result.source})`,
  }),
  tool({
    model: "workshop",
    name: "status",
    info: "inspect the whole workshop: areas, scopes, projects, findings (reads only)",
    args: [{ name: "all", type: "boolean", info: "show notes too, not only errors and warnings" }],
    run: (bos) => bos.inspect(),
    render: (report, input) => statusText(report, { all: Boolean(input.all) }),
  }),
  tool({
    model: "workshop",
    name: "bootstrap",
    info: "create the missing areas and descriptors of the workshop; never overwrites",
    readOnly: false,
    args: [{ name: "dryRun", type: "boolean", info: "only list what would be created" }],
    run: async (bos, input) => {
      const context = await bos.bootstrap({ dryRun: Boolean(input.dryRun) });
      return { dryRun: context.dryRun, changes: context.changes };
    },
    render: (result) => bootstrapText(result.changes, result.dryRun),
  }),
  tool({
    model: "workshop",
    name: "watch",
    info: "listen to changes in the workshop until Ctrl+C; one line per change",
    args: [
      { name: "record", type: "boolean", info: "also append every change to .BOS/storylines/logs/workshop.jsonl" },
      { name: "json", type: "boolean", info: "one JSON object per line" },
    ],
    run: async (bos, input, io) => {
      let count = 0;
      await bos.watch({
        signal: io.signal,
        record: Boolean(input.record),
        onEvent: (event) => {
          count++;
          io.print(input.json ? JSON.stringify(event) : eventText(event));
        },
      });
      return { events: count };
    },
    render: (result) => `stopped after ${result.events} changes`,
  }),
];
