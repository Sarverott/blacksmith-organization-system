// bos daemon <tool> <name>: long-running services of the workshop (glossary: daemon)

import { tool } from "../core/tool.ts";
import type { DaemonAction } from "../procedures/index.ts";
import { daemonText } from "../views/daemon.ts";

const nameArg = {
  name: "name",
  type: "string" as const,
  info: "the service: resources/daemons/<name>.json or the workshop's .BOS/setup/daemons/<name>.json",
  positional: true,
  required: true,
};
const dryRun = { name: "dryRun", type: "boolean" as const, info: "only say what would be done" };

const action = (name: DaemonAction, info: string, readOnly = false) =>
  tool({
    model: "daemon",
    name,
    info,
    readOnly,
    args: readOnly ? [nameArg] : [nameArg, dryRun],
    run: (bos, input) => bos.daemon(String(input.name), name, { dryRun: Boolean(input.dryRun) }),
    render: daemonText,
  });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const daemonTools = [
  tool({
    model: "daemon",
    name: "list",
    info: "the services the workshop knows, and which run",
    run: async (bos) => {
      const daemons = bos.daemons();
      return daemons.names().map((name) => ({ name, alive: daemons.alive(daemons.state(name)) }));
    },
    render: (list) =>
      list.map(({ name, alive }) => `${alive ? "●" : "○"} ${name}`).join("\n") || "no services",
  }),
  action("start", "start the service under BOS's supervisor, detached (nothing when it runs)"),
  action(
    "run",
    "run the service under the supervisor in this terminal, its log lines shown; Ctrl+C stops it",
  ),
  action("stop", "stop it: every instance gets TERM, KILL after the grace time"),
  action("reload", "restart every instance (SIGHUP to the supervisor)"),
  action("rotate", "rotate its log: <name>.log → <name>.log.1 (SIGUSR1)"),
  action("status", "its supervisor, instances, restarts, readiness and alerts", true),
  tool({
    model: "daemon",
    name: "logs",
    info: "the last lines of its log (--alerts: of its alerts); --follow keeps printing new ones until Ctrl+C",
    args: [
      nameArg,
      { name: "lines", type: "string", info: "how many (default 40)" },
      { name: "alerts", type: "boolean", info: "the alerts instead of the whole log" },
      { name: "follow", type: "boolean", info: "keep printing new lines" },
    ],
    run: async (bos, input, io) => {
      const files = bos.daemons().files(String(input.name));
      const path = input.alerts ? files.alerts : files.log;
      const count = Number(input.lines ?? 40);
      let text = bos.host.readText(path) ?? "";
      for (const line of text.split("\n").filter(Boolean).slice(-count)) {
        io.print(line);
      }
      while (input.follow && !io.signal.aborted) {
        await sleep(500);
        const now = bos.host.readText(path) ?? "";
        // rotated: start from the new file's beginning
        const fresh = now.startsWith(text) ? now.slice(text.length) : now;
        for (const line of fresh.split("\n").filter(Boolean)) {
          io.print(line);
        }
        text = now;
      }
      return path;
    },
    render: (path) => `(${path})`,
  }),
];
