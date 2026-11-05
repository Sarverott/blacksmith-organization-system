import type { WatchContext } from "./context.ts";

export async function wait(context: WatchContext): Promise<void> {
  const { signal } = context;
  if (!signal.aborted) await new Promise<void>((resolve) => signal.addEventListener("abort", () => resolve()));
  context.stop?.();
}
