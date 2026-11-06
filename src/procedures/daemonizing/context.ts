import type { Context } from "../../core/context.ts";
import type { DaemonFiles, DaemonState, Service } from "../../core/daemon.ts";
import type { Daemons } from "../../models/index.ts";

export type DaemonAction = "start" | "run" | "stop" | "reload" | "rotate" | "status";

export type DaemonOutcome = {
  name: string;
  action: DaemonAction;
  // what was done
  done:
    | "none"
    | "started"
    | "would-start"
    | "running-already"
    | "ran"
    | "signalled"
    | "would-signal"
    | "not-running";
  from: string | null;
  alive: boolean;
  state: DaemonState | null;
  files: DaemonFiles;
  // the exit code of a run in the foreground
  exit: number | null;
};

export type DaemonContext = Context & {
  daemons: Daemons;
  service: Service | null;
  // ms the settle step waits at most
  wait: number;
  outcome: DaemonOutcome;
};

export function quietDaemon(name: string, action: DaemonAction, files: DaemonFiles): DaemonOutcome {
  return {
    name,
    action,
    done: "none",
    from: null,
    alive: false,
    state: null,
    files,
    exit: null,
  };
}
