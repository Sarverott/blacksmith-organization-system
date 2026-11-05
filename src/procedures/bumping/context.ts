import type { Git } from "../../bridges/git.ts";
import type { Context } from "../../core/context.ts";
import type { Bump, VersioningData } from "../../models/_index.ts";

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
  versioning: VersioningData;
  git: Git;
  outcome: BumpOutcome;
};

export function unbumped(): BumpOutcome {
  return { action: "none", reason: "", bump: null, from: null, to: null };
}
