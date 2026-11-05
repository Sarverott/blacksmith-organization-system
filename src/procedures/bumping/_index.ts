import { Procedure } from "../../core/procedure.ts";
import type { BumpContext } from "./context.ts";
import { check, read, write } from "./steps.ts";

export { type BumpContext, type BumpOutcome, unbumped } from "./context.ts";

export const bumping = new Procedure<BumpContext>("bumping", [
  { name: "read", run: read },
  { name: "check", run: check },
  { name: "write", run: write },
]);
