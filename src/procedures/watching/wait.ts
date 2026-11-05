import type { WatchContext } from "./context.ts";

export async function wait(context: WatchContext): Promise<void> {
  const { signal } = context;
  if (!signal.aborted && !context.failure) {
    await new Promise<void>((resolve) => {
      context.wake = resolve;
      signal.addEventListener("abort", () => resolve());
    });
  }
  context.stop?.();
  if (context.failure) {
    throw context.failure;
  }
}
