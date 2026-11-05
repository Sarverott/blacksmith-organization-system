import type { Git } from "../../bridges/git-integration/git-base.ts";
import type { Context } from "../../core/context.ts";

export type ReconcileOutcome = {
  action: "merged" | "conflict";
  // the version all sides were given; null when neither side has one
  version: string | null;
};

export type ReconcileContext = Context & {
  git: Git;
  files: { base: string; ours: string; theirs: string };
  texts: { base: string; ours: string; theirs: string };
  outcome: ReconcileOutcome;
};

export function unreconciled(): ReconcileOutcome {
  return { action: "merged", version: null };
}
