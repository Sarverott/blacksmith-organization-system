import { Procedure } from "../../core/procedure.ts";
import type { CreditContext } from "./context.ts";
import { match, read, write } from "./steps.ts";

export { type CreditContext, type CreditOutcome, uncredited } from "./context.ts";

export const crediting = new Procedure<CreditContext>("crediting", [
  { name: "read", run: read },
  { name: "match", run: match },
  { name: "write", run: write },
]);
