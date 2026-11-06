import { Procedure } from "../../core/procedure.ts";
import type { RecallContext } from "./context.ts";
import { predict, read, recall } from "./steps.ts";

export type { RecallContext };

export const recalling = new Procedure<RecallContext>("recalling", [
  { name: "read", run: read },
  { name: "predict", run: predict },
  { name: "recall", run: recall },
]);
