import type { Context } from "../../core/context.ts";
import type { Archive } from "../../models/index.ts";

export type ArchiveOutcome = {
  project: string;
  // archive/.repos-mirrors/<scope>___<project>.git
  mirror: string;
  // where the mirror fetches from later: the project's origin, null without one
  upstream: string | null;
  action: "none" | "would-mirror" | "mirrored" | "would-update" | "updated";
  // what is not committed in the forge copy (git status --porcelain)
  uncommitted: string[];
  removal: "kept" | "would-remove" | "removed" | "refused";
  reason: string | null;
};

export type ArchiveContext = Context & {
  workshopForge: string;
  archive: Archive;
  confirm: boolean;
  outcome: ArchiveOutcome;
};

export function unarchived(project: string): ArchiveOutcome {
  return {
    project,
    mirror: "",
    upstream: null,
    action: "none",
    uncommitted: [],
    removal: "kept",
    reason: null,
  };
}
