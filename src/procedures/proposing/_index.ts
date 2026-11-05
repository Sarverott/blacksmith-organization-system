import { Procedure } from "../../core/procedure.ts";
import type { ProposeContext } from "./context.ts";
import { open, route, weigh } from "./steps.ts";

export { type FlowOutcome, type ProposeContext, undecided } from "./context.ts";

export const proposing = new Procedure<ProposeContext>("proposing", [
  { name: "route", run: route },
  { name: "weigh", run: weigh },
  { name: "open", run: open },
]);
