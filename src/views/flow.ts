// The craft loop and its outcomes as text for people.
import type { LoopData, LoopStep, VersioningData } from "../models/_index.ts";
import type { BumpOutcome, FlowOutcome } from "../procedures/_index.ts";

export function stepText(step: LoopStep): string {
  const merge = step.automerge ? "merges by itself" : "a person merges";
  const back = step.back.length ? `  (or back to ${step.back.join(", ")})` : "";
  return `${step.from.padEnd(14)} → ${step.to.padEnd(12)} ${merge}${back}`;
}

export type Explained = {
  source: string;
  steps: LoopStep[];
  data: LoopData;
  versioning: VersioningData;
};

export function explainText({ source, steps, data, versioning }: Explained): string {
  const { contributors, autocreate, release } = data;
  const bumps = Object.entries(versioning.bumps).map(([branch, bump]) => `${bump} on ${branch}`);
  return [
    `craft loop (${source === "default" ? "the default loop" : source})`,
    "",
    ...steps.map((step) => `  ${stepText(step)}`),
    `  ${contributors.pattern.padEnd(14)} → ${contributors.into.padEnd(12)} a person merges`,
    "",
    `pull requests of forward steps are opened ${autocreate ? "by the loop" : "by people (autocreate is off)"}; releases on ${release}`,
    `version bumps: ${bumps.join(", ") || "none"}, each once the line it leaves is released (${versioning.tagPrefix}<line>)`,
    `every commit on ${versioning.commits.branches.join(", ")}: ${versioning.commits.bump}`,
  ].join("\n");
}

export function outcomeText(outcome: FlowOutcome): string {
  const step = outcome.step ? `${outcome.step.from} → ${outcome.step.to}: ` : "";
  return `${step}${outcome.reason || outcome.action}`;
}

export function bumpText(outcome: BumpOutcome): string {
  return outcome.reason || outcome.action;
}
