import type { Context } from "../../core/context.ts";
import type { Case, Judgement } from "../../core/ruling.ts";
import type { Almanac } from "../../models/index.ts";

export type JudgeContext = Context & {
  projectPath: string;
  // the case as given: in words, or already as fields
  description: string | Case;
  almanac: Almanac;
  case: Case;
  judgement: Judgement | null;
};
