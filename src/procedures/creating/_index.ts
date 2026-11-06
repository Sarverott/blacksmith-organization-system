import { Procedure } from "../../core/procedure.ts";
import type { CreateContext } from "./context.ts";
import { locate, make, report, scope, seed, workspace } from "./steps.ts";

export {
  type CreateContext,
  type CreateKind,
  type CreateOutcome,
  uncreated,
} from "./context.ts";
export { PROJECT_TEMPLATE, parseSource } from "./steps.ts";

export const creating = new Procedure<CreateContext>("creating", [
  { name: "locate", run: locate },
  { name: "scope", run: scope },
  { name: "make", run: make },
  { name: "seed", run: seed },
  { name: "workspace", run: workspace },
  { name: "report", run: report },
]);
