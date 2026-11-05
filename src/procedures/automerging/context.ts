import type { GitHub, PullRequest } from "../../bridges/git-integration/github.ts";
import type { Context } from "../../core/context.ts";
import type { Loop } from "../../models/index.ts";
import type { FlowOutcome } from "../proposing/context.ts";

export type AutomergeContext = Context & {
  loop: Loop;
  github: GitHub;
  number: number;
  pullRequest?: PullRequest;
  outcome: FlowOutcome;
};
