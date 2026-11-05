import type { GitHub, PullRequest } from "../../bridges/github.ts";
import type { Context } from "../../core/context.ts";
import type { Loop } from "../../models/_index.ts";
import type { FlowOutcome } from "../proposing/context.ts";

export type AutomergeContext = Context & {
  loop: Loop;
  github: GitHub;
  number: number;
  pullRequest?: PullRequest;
  outcome: FlowOutcome;
};
