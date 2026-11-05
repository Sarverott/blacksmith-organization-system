// The craft loop and its outcomes as text for people (`bos flow explain | next-pr | automerge | bump`).
import type { LoopData, LoopStep, VersioningData } from "../models/index.ts";
import type { BumpOutcome, FlowOutcome } from "../procedures/index.ts";

export type Explained = {
  source: string;
  steps: LoopStep[];
  data: LoopData;
  versioning: VersioningData;
};

// one step of the loop:  "revision       → master       a person merges  (or back to rejection)"
export function stepText(step: LoopStep): string {
  const from = step.from.padEnd(14);
  const to = step.to.padEnd(12);
  const merge = step.automerge ? "merges by itself" : "a person merges";
  const back = step.back.length ? `  (or back to ${step.back.join(", ")})` : "";
  return `${from} → ${to} ${merge}${back}`;
}

// the contributors' branches flow into development like a step
function contributorsText({ contributors }: LoopData): string {
  return `${contributors.pattern.padEnd(14)} → ${contributors.into.padEnd(12)} a person merges`;
}

function pullRequestsText({ autocreate, release }: LoopData): string {
  const by = autocreate ? "by the loop" : "by people (autocreate is off)";
  return `pull requests of forward steps are opened ${by}; releases on ${release}`;
}

function bumpsText(versioning: VersioningData): string {
  const bumps = Object.entries(versioning.bumps).map(([branch, bump]) => `${bump} on ${branch}`);
  const released = `each once the line it leaves is released (${versioning.tagPrefix}<line>)`;
  return `version bumps: ${bumps.join(", ") || "none"}, ${released}`;
}

function commitsText({ commits }: VersioningData): string {
  return `every commit on ${commits.branches.join(", ")}: ${commits.bump}`;
}

export function explainText({ source, steps, data, versioning }: Explained): string {
  const title = `craft loop (${source === "default" ? "the default loop" : source})`;
  return [
    title,
    "",
    ...steps.map((step) => `  ${stepText(step)}`),
    `  ${contributorsText(data)}`,
    "",
    pullRequestsText(data),
    bumpsText(versioning),
    commitsText(versioning),
  ].join("\n");
}

// what next-pr / automerge did, with the step it was about
export function outcomeText(outcome: FlowOutcome): string {
  const step = outcome.step ? `${outcome.step.from} → ${outcome.step.to}: ` : "";
  return `${step}${outcome.reason || outcome.action}`;
}

// what a bump did: its reason when it says more than its action
export function bumpText(outcome: BumpOutcome): string {
  return outcome.reason || outcome.action;
}
