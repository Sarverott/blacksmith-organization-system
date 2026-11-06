import { serviceProblems } from "../../core/daemon.ts";
import type { DaemonContext } from "./context.ts";

const SIGNAL = { stop: "SIGTERM", reload: "SIGHUP", rotate: "SIGUSR1" } as const;

export function read(context: DaemonContext): void {
  const { daemons, outcome } = context;
  const found = daemons.service(outcome.name);
  if (!found && (outcome.action === "start" || outcome.action === "run")) {
    throw new Error(
      `no service "${outcome.name}" (known: ${daemons.names().join(", ") || "none"}; add ${daemons.setupPath}/${outcome.name}.json)`,
    );
  }
  if (found) {
    const problems = serviceProblems(found.service);
    if (problems.length) {
      throw new Error(`${found.from}: ${problems.join("; ")}`);
    }
  }
  context.service = found?.service ?? null;
  outcome.from = found?.from ?? null;
  outcome.state = daemons.state(outcome.name);
  outcome.alive = daemons.alive(outcome.state);
}

export function act(context: DaemonContext): void {
  const { daemons, outcome, host } = context;
  const { action } = outcome;
  if (action === "status") {
    return;
  }
  if (action === "start" || action === "run") {
    if (outcome.alive) {
      outcome.done = "running-already";
      return;
    }
    context.changes.push(outcome.files.service, outcome.files.state);
    if (context.dryRun) {
      outcome.done = "would-start";
      return;
    }
    host.mkdir(daemons.files(outcome.name).service.replace(/\/[^/]+$/, ""));
    host.writeText(outcome.files.service, `${JSON.stringify(context.service, null, 2)}\n`);
    if (action === "run") {
      outcome.exit = host.supervise(outcome.files, { foreground: true });
      outcome.done = "ran";
      return;
    }
    host.supervise(outcome.files);
    outcome.done = "started";
    return;
  }
  if (!outcome.alive || !outcome.state) {
    outcome.done = "not-running";
    return;
  }
  if (context.dryRun) {
    outcome.done = "would-signal";
    return;
  }
  host.signal(outcome.state.supervisor, SIGNAL[action]);
  outcome.done = "signalled";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// what was asked shows in the state: started (every instance has run) or stopped
export async function settle(context: DaemonContext): Promise<void> {
  const { daemons, outcome } = context;
  const wanted =
    outcome.done === "started"
      ? () => {
          const state = daemons.state(outcome.name);
          return Boolean(
            state && state.status === "running" && state.instances.every((i) => i.startedAt),
          );
        }
      : outcome.done === "signalled" && outcome.action === "stop"
        ? () => !daemons.alive(daemons.state(outcome.name))
        : null;
  if (wanted) {
    for (let waited = 0; waited < context.wait && !wanted(); waited += 100) {
      await sleep(100);
    }
  }
  outcome.state = daemons.state(outcome.name);
  outcome.alive = daemons.alive(outcome.state);
}
