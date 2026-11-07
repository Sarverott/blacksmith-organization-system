import { Procedure } from "../../core/procedure.ts";
import type { RepairContext } from "./context.ts";
import { apply, find, plan } from "./steps.ts";

export { type Move, type RepairContext, type RepairOutcome, unrepaired } from "./context.ts";

export const repairing = new Procedure<RepairContext>("repairing", [
  { name: "find", run: find },
  { name: "plan", run: plan },
  { name: "apply", run: apply },
]);
