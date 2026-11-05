import type { Git } from "../../bridges/git-integration/git-base.ts";
import type { Context } from "../../core/context.ts";
import type { Bump, VersioningData } from "../../models/index.ts";

export type BumpOutcome = {
  action: "none" | "kept" | "would-bump" | "bumped";
  reason: string;
  bump: Bump | null;
  from: string | null;
  to: string | null;
};

export type BumpContext = Context & {
  projectPath: string;
  station: string;
  // a commit's bump: versioning.commits.bump, whether released or not
  everyCommit: boolean;
  versioning: VersioningData;
  git: Git;
  outcome: BumpOutcome;
};

export function unbumped(): BumpOutcome {
  return { action: "none", reason: "", bump: null, from: null, to: null };
}
