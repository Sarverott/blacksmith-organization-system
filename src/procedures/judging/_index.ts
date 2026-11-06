import { Procedure } from "../../core/procedure.ts";
import type { JudgeContext } from "./context.ts";
import { categorize, judge, read } from "./steps.ts";

export type { JudgeContext };

export const judging = new Procedure<JudgeContext>("judging", [
  { name: "read", run: read },
  { name: "categorize", run: categorize },
  { name: "judge", run: judge },
]);
