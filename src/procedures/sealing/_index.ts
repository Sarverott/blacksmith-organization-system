import { Procedure } from "../../core/procedure.ts";
import type { SealContext } from "./context.ts";
import { compare, gather, read, write } from "./steps.ts";

export { type SealContext, type SealOutcome, unsealed } from "./context.ts";
export { haloOf, sealedOf } from "./steps.ts";

export const sealing = new Procedure<SealContext>("sealing", [
  { name: "read", run: read },
  { name: "gather", run: gather },
  { name: "compare", run: compare },
  { name: "write", run: write },
]);
