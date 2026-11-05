import { Procedure } from "../../core/procedure.ts";
import type { ReconcileContext } from "./context.ts";
import { align, merge, read } from "./steps.ts";

export { type ReconcileContext, type ReconcileOutcome, unreconciled } from "./context.ts";

export const reconciling = new Procedure<ReconcileContext>("reconciling", [
  { name: "read", run: read },
  { name: "align", run: align },
  { name: "merge", run: merge },
]);
