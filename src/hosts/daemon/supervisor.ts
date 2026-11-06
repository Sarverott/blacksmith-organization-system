// BOS's supervisor of one daemon (glossary: daemon; decisions in src/core/daemon.ts):
//   node supervisor.ts <service.json> <state.json> <log> <alerts> [--foreground]
// Started detached by NodeHost.supervise. It runs the service's instances as child
// processes, restarts them by the service's policy, writes every line they print into the
// log, hands the lines to a pool of monitor threads that flag alerts, keeps the state file
// current, and answers signals: TERM/INT stop, HUP restart, USR1 rotate the log, USR2 state.
// --foreground: the lines also go to this process's stdout (bos daemon run).
import { type ChildProcess, spawn } from "node:child_process";
import {
  appendFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  type WriteStream,
  writeFileSync,
} from "node:fs";
import { dirname, extname } from "node:path";
import { Worker } from "node:worker_threads";
import {
  backoff,
  type DaemonState,
  instanceEnv,
  logLine,
  restarts,
  type Service,
} from "../../core/daemon.ts";

const [servicePath = "", statePath = "", logPath = "", alertsPath = "", ...flags] =
  process.argv.slice(2);
const foreground = flags.includes("--foreground");
const service = JSON.parse(readFileSync(servicePath, "utf8")) as Service;
const separate = service.context === "separate";

for (const file of [statePath, logPath, alertsPath]) {
  mkdirSync(dirname(file), { recursive: true });
}

type Slot = {
  n: number;
  child: ChildProcess | null;
  restarts: number;
  startedAt: number | null;
  exit: number | string | null;
  failed: boolean;
  timer: NodeJS.Timeout | null;
  // stopped on purpose (HUP): start again at once, not counted as a failure
  reloading: boolean;
};

const state: DaemonState = {
  name: service.name,
  supervisor: process.pid,
  status: "running",
  startedAt: Date.now(),
  ready: service.ready ? false : null,
  lines: 0,
  alerts: 0,
  threads: Math.max(1, service.threads ?? 2),
  instances: [],
};
const slots: Slot[] = Array.from({ length: Math.max(1, service.instances ?? 1) }, (_, n) => ({
  n,
  child: null,
  restarts: 0,
  startedAt: null,
  exit: null,
  failed: false,
  timer: null,
  reloading: false,
}));
let stopping = false;

function save(): void {
  state.instances = slots.map(({ n, child, restarts, startedAt, exit, failed }) => ({
    n,
    pid: child?.pid ?? null,
    restarts,
    startedAt,
    exit,
    failed,
  }));
  const temporary = `${statePath}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(temporary, statePath);
}

// the log: one stream, reopened when rotated
let log: WriteStream = createWriteStream(logPath, { flags: "a" });
function write(line: string): void {
  state.lines++;
  log.write(`${line}\n`);
  if (foreground) {
    process.stdout.write(`${line}\n`);
  }
}
const say = (text: string) => write(logLine(service.name, "supervisor", "info", text));

// the monitor: a pool of threads, lines handed round by round
const monitorFile = new URL(
  `./monitor${extname(new URL(import.meta.url).pathname)}`,
  import.meta.url,
);
const monitors = Array.from(
  { length: state.threads },
  () => new Worker(monitorFile, { workerData: { patterns: service.alerts ?? [] } }),
);
let turn = 0;
for (const monitor of monitors) {
  monitor.on("message", (alert: string) => {
    state.alerts++;
    appendFileSync(alertsPath, `${alert}\n`);
  });
  monitor.on("error", (error) => say(`monitor thread failed: ${error.message}`));
}
function monitor(line: string): void {
  if (!service.alerts?.length) {
    return;
  }
  monitors[turn % monitors.length]?.postMessage(line);
  turn++;
}

function lines(slot: Slot, stream: "out" | "err", source: NodeJS.ReadableStream | null): void {
  let rest = "";
  source?.setEncoding("utf8");
  source?.on("data", (chunk: string) => {
    const parts = (rest + chunk).split("\n");
    rest = parts.pop() ?? "";
    for (const text of parts) {
      const line = logLine(service.name, slot.n, stream, text);
      write(line);
      monitor(line);
    }
  });
  source?.on("end", () => {
    if (rest) {
      write(logLine(service.name, slot.n, stream, rest));
    }
  });
}

function start(slot: Slot): void {
  slot.timer = null;
  const child = spawn(service.command, service.args ?? [], {
    cwd: service.cwd,
    env: instanceEnv(service, slot.n, process.env),
    // separate: a process group of its own; a signal to ours does not reach it
    detached: separate,
    stdio: ["ignore", "pipe", "pipe"],
  });
  slot.child = child;
  slot.startedAt = Date.now();
  lines(slot, "out", child.stdout);
  lines(slot, "err", child.stderr);
  let ended = false;
  const onEnd = (code: number | null, signal: string | null) => {
    if (ended) {
      return;
    }
    ended = true;
    slot.child = null;
    slot.exit = code ?? signal;
    say(`#${slot.n} ended: ${code !== null ? `exit ${code}` : signal}`);
    if (slot.reloading) {
      slot.reloading = false;
      start(slot);
    } else if (restarts(service, code, stopping)) {
      if (slot.restarts >= (service.maxRestarts ?? 10)) {
        slot.failed = true;
        say(`#${slot.n} given up after ${slot.restarts} restarts`);
      } else {
        const wait = backoff(slot.restarts++);
        say(`#${slot.n} starts again in ${wait} ms`);
        slot.timer = setTimeout(() => start(slot), wait);
      }
    }
    save();
    finishIfStopped();
  };
  child.on("error", (error) => {
    say(`#${slot.n} could not run ${service.command}: ${error.message}`);
    onEnd(127, null);
  });
  child.on("exit", onEnd);
  say(
    `#${slot.n} started: ${service.command} ${(service.args ?? []).join(" ")} (pid ${child.pid})`,
  );
  save();
}

function kill(slot: Slot, signal: NodeJS.Signals): void {
  const pid = slot.child?.pid;
  if (!pid) {
    return;
  }
  try {
    // separate: the whole group of the instance (what it started too)
    process.kill(separate ? -pid : pid, signal);
  } catch {
    // gone already
  }
}

// the ready URL asked every 2 s until it answers, then every 30 s (each ask may be a line of
// the service's own log)
let probe: NodeJS.Timeout | null = null;
if (service.ready) {
  const url = service.ready;
  const ask = async () => {
    const before = state.ready;
    try {
      state.ready = (await fetch(url, { signal: AbortSignal.timeout(1500) })).ok;
    } catch {
      state.ready = false;
    }
    if (state.ready !== before) {
      say(state.ready ? `ready: ${url} answers` : `not ready: ${url} does not answer`);
      save();
    }
    if (!stopping) {
      probe = setTimeout(ask, state.ready ? 30_000 : 2000);
    }
  };
  probe = setTimeout(ask, 2000);
}

function finishIfStopped(): void {
  if (!stopping || slots.some((slot) => slot.child)) {
    return;
  }
  if (probe) {
    clearTimeout(probe);
  }
  state.status = "stopped";
  say("stopped");
  save();
  for (const monitor of monitors) {
    void monitor.terminate();
  }
  log.end(() => process.exit(0));
}

function stop(signal: string): void {
  if (stopping) {
    return;
  }
  stopping = true;
  state.status = "stopping";
  say(`${signal}: stopping`);
  for (const slot of slots) {
    if (slot.timer) {
      clearTimeout(slot.timer);
      slot.timer = null;
    }
    kill(slot, "SIGTERM");
  }
  save();
  setTimeout(() => {
    for (const slot of slots) {
      kill(slot, "SIGKILL");
    }
  }, service.grace ?? 10_000).unref();
  finishIfStopped();
}

process.on("SIGTERM", () => stop("SIGTERM"));
process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGHUP", () => {
  say("SIGHUP: restarting every instance");
  for (const slot of slots) {
    slot.failed = false;
    slot.restarts = 0;
    if (slot.child) {
      slot.reloading = true;
      kill(slot, "SIGTERM");
    } else if (!slot.timer) {
      start(slot);
    }
  }
});
process.on("SIGUSR1", () => {
  const old = log;
  if (existsSync(logPath)) {
    renameSync(logPath, `${logPath}.1`);
  }
  log = createWriteStream(logPath, { flags: "a" });
  old.end();
  say("SIGUSR1: log rotated");
});
process.on("SIGUSR2", () => save());

say(
  `supervisor ${process.pid}: ${slots.length} instance(s), ${service.context ?? "shared"} context, ${state.threads} monitor thread(s)`,
);
for (const slot of slots) {
  start(slot);
}
