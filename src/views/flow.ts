// The craft loop and its outcomes as text for people.
import type { LoopData, LoopStep } from "../models/_index.ts";
import type { FlowOutcome } from "../procedures/_index.ts";

export function stepText(step: LoopStep): string {
  const merge = step.automerge ? "merges by itself" : "a person merges";
  const back = step.back.length ? `  (or back to ${step.back.join(", ")})` : "";
  return `${step.from.padEnd(14)} → ${step.to.padEnd(12)} ${merge}${back}`;
}

export function explainText({ source, steps, data }: { source: string; steps: LoopStep[]; data: LoopData }): string {
  const { contributors, autocreate, release } = data;
  return [
    `craft loop (${source === "default" ? "the default loop" : source})`,
    "",
    ...steps.map((step) => `  ${stepText(step)}`),
    `  ${contributors.pattern.padEnd(14)} → ${contributors.into.padEnd(12)} a person merges`,
    "",
    `pull requests of forward steps are opened ${autocreate ? "by the loop" : "by people (autocreate is off)"}; releases on ${release}`,
  ].join("\n");
}

export function outcomeText(outcome: FlowOutcome): string {
  const step = outcome.step ? `${outcome.step.from} → ${outcome.step.to}: ` : "";
  return `${step}${outcome.reason || outcome.action}`;
}
