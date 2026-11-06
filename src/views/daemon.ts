// What `bos daemon <tool>` found and did, as text for people.
import type { DaemonState } from "../core/daemon.ts";
import type { DaemonOutcome } from "../procedures/index.ts";

const DONE = {
  none: "",
  started: "started",
  "would-start": "would be started",
  "running-already": "runs already",
  ran: "ran in the foreground",
  signalled: "signalled",
  "would-signal": "would be signalled",
  "not-running": "does not run",
};

const ago = (ms: number) => {
  const s = Math.round(ms / 1000);
  return s < 120 ? `${s} s` : s < 7200 ? `${Math.round(s / 60)} min` : `${Math.round(s / 3600)} h`;
};

export function stateLines(state: DaemonState | null, alive: boolean, now = Date.now()): string[] {
  if (!state) {
    return ["  never started"];
  }
  const lines = [
    `  supervisor ${state.supervisor}: ${alive ? state.status : "not alive"}${alive ? `, for ${ago(now - state.startedAt)}` : ""}`,
  ];
  if (state.ready !== null && alive) {
    lines.push(`  ready: ${state.ready ? "yes" : "not yet"}`);
  }
  lines.push(
    `  ${state.lines} log lines, ${state.alerts} alerts, ${state.threads} monitor threads`,
  );
  for (const instance of state.instances) {
    const what = instance.pid
      ? `pid ${instance.pid}`
      : instance.failed
        ? "given up"
        : `ended (${instance.exit ?? "-"})`;
    lines.push(`  #${instance.n}: ${what}, ${instance.restarts} restarts`);
  }
  return lines;
}

export function daemonText(outcome: DaemonOutcome): string {
  const head = `${outcome.name}${DONE[outcome.done] ? `: ${DONE[outcome.done]}` : ""}`;
  return [
    head,
    ...(outcome.done === "ran"
      ? [`  exit ${outcome.exit}`]
      : stateLines(outcome.state, outcome.alive)),
    `  log: ${outcome.files.log}`,
    ...(outcome.state?.alerts ? [`  alerts: ${outcome.files.alerts}`] : []),
  ].join("\n");
}
