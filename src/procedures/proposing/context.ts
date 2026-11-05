import type { GitHub } from "../../bridges/git-integration/github.ts";
import type { Context } from "../../core/context.ts";
import type { Loop, LoopStep } from "../../models/index.ts";

export type FlowOutcome = {
  action: "none" | "exists" | "would-open" | "opened" | "would-merge" | "merged";
  reason: string;
  step: LoopStep | null;
  pullRequest: number | null;
};

export type ProposeContext = Context & {
  loop: Loop;
  github: GitHub;
  branch: string;
  outcome: FlowOutcome;
};

export function undecided(): FlowOutcome {
  return { action: "none", reason: "", step: null, pullRequest: null };
}
