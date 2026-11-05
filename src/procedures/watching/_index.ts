import { Procedure } from "../../core/procedure.ts";
import type { WatchContext } from "./context.ts";
import { start } from "./start.ts";
import { wait } from "./wait.ts";

export { classify, isNoise } from "./classify.ts";
export type { WatchContext, WorkshopEvent } from "./context.ts";

export const watching = new Procedure<WatchContext>("watching", [
  { name: "start", run: start },
  { name: "wait", run: wait },
]);
