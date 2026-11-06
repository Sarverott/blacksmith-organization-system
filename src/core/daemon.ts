// Daemons (glossary: daemon): a long-running program (ollama serve…) kept alive by BOS's
// supervisor (src/hosts/daemon/), a detached Node process of its own. What is decided here
// is plain data and pure functions; the supervisor only carries it out.
//
//   service  resources/daemons/<name>.json (the package) or .BOS/setup/daemons/<name>.json
//            (the workshop's own, it wins)
//   state    .BOS/data/daemons/<name>.state.json      written by the supervisor
//   logs     .BOS/storylines/daemons/<name>.log         every line of every instance
//            .BOS/storylines/daemons/<name>.alerts.log  the lines the monitor threads flagged
//
// Signals to the supervisor: TERM/INT stop every instance (TERM, then KILL after the grace
// time), HUP restarts them, USR1 rotates the log (<name>.log → <name>.log.1), USR2 writes
// the state now.

export type ServiceContext = "shared" | "separate";

export type Service = {
  name: string;
  command: string;
  args?: string[];
  cwd?: string;
  // shared: an instance gets the supervisor's environment, and stays in its process group;
  // separate: only PATH, HOME, USER, LANG and the names in inherit, in a process group of
  // its own (a signal to the supervisor's group never reaches it)
  context?: ServiceContext;
  env?: Record<string, string>;
  inherit?: string[];
  // how many instances run side by side, each with BOS_INSTANCE=<n> (a cluster)
  instances?: number;
  restart?: "always" | "on-failure" | "never";
  // restarts in a row before an instance is given up (failed)
  maxRestarts?: number;
  // log lines matching one of these (regular expressions, case-insensitive) are alerts
  alerts?: string[];
  // threads of the log monitor (worker_threads), so a flood of lines never holds up signals
  threads?: number;
  // a URL that answers once the service is up (ollama: http://127.0.0.1:11434/)
  ready?: string;
  // ms between TERM and KILL when stopping
  grace?: number;
};

export type InstanceState = {
  n: number;
  pid: number | null;
  restarts: number;
  startedAt: number | null;
  // the last exit: its code, or the signal that ended it
  exit: number | string | null;
  failed: boolean;
};

export type DaemonState = {
  name: string;
  supervisor: number;
  status: "running" | "stopping" | "stopped";
  startedAt: number;
  // null: the service has no ready URL
  ready: boolean | null;
  lines: number;
  alerts: number;
  threads: number;
  instances: InstanceState[];
};

export type DaemonFiles = { service: string; state: string; log: string; alerts: string };

export function daemonFiles(workshopRoot: string, name: string): DaemonFiles {
  const data = `${workshopRoot}/.BOS/data/daemons`;
  const stories = `${workshopRoot}/.BOS/storylines/daemons`;
  return {
    service: `${data}/${name}.service.json`,
    state: `${data}/${name}.state.json`,
    log: `${stories}/${name}.log`,
    alerts: `${stories}/${name}.alerts.log`,
  };
}

const BASIC_ENV = ["PATH", "HOME", "USER", "LANG"];

// the environment of instance n
export function instanceEnv(
  service: Service,
  n: number,
  parent: Record<string, string | undefined>,
): Record<string, string> {
  const names =
    (service.context ?? "shared") === "shared"
      ? Object.keys(parent)
      : [...BASIC_ENV, ...(service.inherit ?? [])];
  const env: Record<string, string> = {};
  for (const name of names) {
    const value = parent[name];
    if (value !== undefined) {
      env[name] = value;
    }
  }
  return { ...env, ...service.env, BOS_DAEMON: service.name, BOS_INSTANCE: String(n) };
}

// ms before the next restart: 0.5 s, 1 s, 2 s… up to 30 s
export function backoff(restarts: number): number {
  return Math.min(30_000, 500 * 2 ** restarts);
}

// should an instance that exited be started again
export function restarts(service: Service, code: number | null, stopping: boolean): boolean {
  if (stopping) {
    return false;
  }
  const policy = service.restart ?? "on-failure";
  return policy === "always" || (policy === "on-failure" && code !== 0);
}

export function alertMatcher(patterns: string[] = []): (line: string) => boolean {
  const regexes = patterns.map((pattern) => new RegExp(pattern, "i"));
  return (line) => regexes.some((regex) => regex.test(line));
}

// one line of the log: when, which instance, which stream, the text
export function logLine(name: string, n: number | "supervisor", stream: string, text: string) {
  const who = n === "supervisor" ? `${name}/supervisor` : `${name}#${n}`;
  return `${new Date().toISOString()} ${who} ${stream} ${text}`;
}

// a service's spec checked: what is wrong with it, nothing when it can run
export function serviceProblems(service: Partial<Service>): string[] {
  const problems: string[] = [];
  if (!service.name || !/^[\w.-]+$/.test(service.name)) {
    problems.push("name: letters, digits, _ . - only");
  }
  if (!service.command) {
    problems.push("command: missing");
  }
  if (service.instances !== undefined && !(service.instances >= 1)) {
    problems.push("instances: at least 1");
  }
  if (service.context && !["shared", "separate"].includes(service.context)) {
    problems.push("context: shared or separate");
  }
  for (const pattern of service.alerts ?? []) {
    try {
      new RegExp(pattern);
    } catch {
      problems.push(`alerts: not a regular expression: ${pattern}`);
    }
  }
  return problems;
}
