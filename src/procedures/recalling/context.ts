import type { Context } from "../../core/context.ts";
import type { Chain, Prediction } from "../../core/patterning.ts";
import type { Almanac } from "../../models/index.ts";

export type RecallContext = Context & {
  projectPath: string;
  events: string[];
  almanac: Almanac;
  prediction: Prediction | null;
  chains: Chain[];
};
