import { categorize as inWords, judgeCase } from "../../core/ruling.ts";
import { almanacOf } from "../../models/index.ts";
import type { JudgeContext } from "./context.ts";

export function read(context: JudgeContext): void {
  context.almanac = almanacOf(context.host, context.projectPath);
}

// fields as they are; JSON text parsed; words through the categorizer
export function categorize(context: JudgeContext): void {
  const { description, almanac } = context;
  if (typeof description !== "string") {
    context.case = inWords("", almanac.rulesets, description);
    return;
  }
  const text = description.trim();
  context.case = text.startsWith("{")
    ? inWords("", almanac.rulesets, JSON.parse(text))
    : inWords(text, almanac.rulesets);
}

export function judge(context: JudgeContext): void {
  context.judgement = judgeCase(context.almanac.rulesets, context.case);
}
