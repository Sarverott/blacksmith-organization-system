import type { Context } from "../../core/context.ts";
import type { Workshop } from "../../models/index.ts";

export type WorkshopEvent = {
  unixusat: number;
  kind: "change" | "rename";
  path: string;
  area: string | null;
  scope: string | null;
  project: string | null;
  inner: string | null;
};

export type WatchContext = Context & {
  workshop: Workshop;
  signal: AbortSignal;
  onEvent: (event: WorkshopEvent) => void;
  record: boolean;
  quietMs: number;
  stop?: () => void;
  // set when the watcher fails; wake ends the wait early
  failure?: Error;
  wake?: () => void;
};
