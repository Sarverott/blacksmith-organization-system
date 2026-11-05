import { classify, isNoise } from "./classify.ts";
import type { WatchContext } from "./context.ts";

export function start(context: WatchContext): void {
  const { workshop, host } = context;
  if (!workshop.exists()) throw new Error(`${workshop.path} does not exist (bos workshop bootstrap creates it)`);
  const lastSeen = new Map<string, number>();
  context.stop = host.watch(
    workshop.path,
    (change) => {
      const event = classify(workshop, change);
      if (!event) return;
      const key = `${event.kind}:${event.path}`;
      const previous = lastSeen.get(key);
      lastSeen.set(key, event.unixusat);
      if (previous !== undefined && event.unixusat - previous < context.quietMs) return;
      if (context.record) workshop.system.storylines.record({ event: "change", ...event }, context);
      context.onEvent(event);
    },
    (error) => {
      context.failure = error;
      context.wake?.();
    },
    isNoise,
  );
}
