// The context every procedure step shares: the host, whether to only plan,
// what was (or would be) created, and the trace of steps that ran.
import type { Host } from "./host.ts";

export type TraceEntry = {
  procedure: string;
  step: string;
  ok: boolean;
  ms?: number;
  error?: string;
};

export type Context = {
  host: Host;
  dryRun: boolean;
  changes: string[];
  trace: TraceEntry[];
};

export function createContext(host: Host, { dryRun = false } = {}): Context {
  return { host, dryRun, changes: [], trace: [] };
}

// create target with create() only when it is missing; never overwrite.
// In a dry run nothing is written, but the plan is still recorded in changes.
export function createIfMissing(context: Context, target: string, create: () => void): boolean {
  if (context.host.exists(target)) {
    return false;
  }
  if (!context.dryRun) {
    create();
  }
  context.changes.push(target);
  return true;
}
