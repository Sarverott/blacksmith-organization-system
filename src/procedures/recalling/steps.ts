import { recall as known, learn, predict as next } from "../../core/patterning.ts";
import { almanacOf } from "../../models/index.ts";
import type { RecallContext } from "./context.ts";

export function read(context: RecallContext): void {
  context.almanac = almanacOf(context.host, context.projectPath);
}

export function predict(context: RecallContext): void {
  context.prediction = next(learn(context.almanac.chains), context.events);
}

export function recall(context: RecallContext): void {
  context.chains = known(context.almanac.chains, context.events);
}
