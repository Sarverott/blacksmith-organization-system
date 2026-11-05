import type { Git } from "../../bridges/git-integration/git-base.ts";
import type { Context } from "../../core/context.ts";
import type { AuthorsLine, Identity } from "../../models/index.ts";

export type CreditOutcome = {
  action: "none" | "would-write" | "written";
  file: string;
  // new entries and updated ones, as written
  added: string[];
  updated: string[];
};

export type CreditContext = Context & {
  file: string;
  git: Git;
  lines: AuthorsLine[];
  identities: Identity[];
  outcome: CreditOutcome;
};

export function uncredited(file: string): CreditOutcome {
  return { action: "none", file, added: [], updated: [] };
}
