// bos devlog <tool>: the devlog of the project around the current directory
import { createContext } from "../core/context.ts";
import { tool } from "../core/tool.ts";
import type { BOS } from "../main.ts";
import { Devlog } from "../models/devlog/class.ts";
import { projectAround } from "../models/project/around.ts";
import { type DevlogState, stateMarkdown } from "../views/devlog.ts";

const dirArg = { name: "dir", type: "string", info: "a path inside the project (default: current directory)" } as const;

function readState(bos: BOS, dir?: string): DevlogState {
  const project = projectAround(bos.host, dir);
  const devlog = project.child(Devlog);
  const report = project.report();
  return {
    project: project.name,
    branch: report.git?.branch ?? null,
    version: report.version?.version ?? null,
    phases: devlog.phases(),
    questions: devlog.questions(),
    proposals: devlog.proposals(),
    waiting: { orders: devlog.waiting("ORDERS.md"), inquiries: devlog.waiting("INQUIRIES.md") },
    missing: devlog.missingFiles(),
  };
}

export const devlogTools = [
  tool({
    model: "devlog",
    name: "state",
    info: "where the project stands: phases of TODO.md, open questions and proposals, waiting orders",
    args: [dirArg, { name: "write", type: "boolean", info: "write docs/devlog/STATE.md instead of printing" }],
    run: (bos, input) => {
      const state = readState(bos, input.dir as string | undefined);
      if (input.write) {
        const devlog = projectAround(bos.host, input.dir as string | undefined).child(Devlog);
        const context = createContext(bos.host);
        bos.host.writeText(devlog.file("STATE.md"), stateMarkdown(state));
        context.changes.push(devlog.file("STATE.md"));
        return { state, written: context.changes };
      }
      return { state, written: [] as string[] };
    },
    render: (result) => (result.written.length ? `wrote ${result.written.join(", ")}` : stateMarkdown(result.state)),
  }),
];
