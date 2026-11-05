import { Procedure } from "../../core/procedure.ts";
import type { AutomergeContext } from "./context.ts";
import { decide, merge, read } from "./steps.ts";

export type { AutomergeContext } from "./context.ts";

export const automerging = new Procedure<AutomergeContext>("automerging", [
  { name: "read", run: read },
  { name: "decide", run: decide },
  { name: "merge", run: merge },
]);
