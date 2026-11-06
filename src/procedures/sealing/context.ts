import type { Context } from "../../core/context.ts";
import type { Allocators, Drift, Hallow, Sealed } from "../../core/omnis.ts";

export type SealOutcome = {
  action: "none" | "would-write" | "written";
  file: string;
  // the halo of the files now, and when the one on disk was sealed (null: never)
  files: number;
  sealedAt: number | null;
  drift: Drift | null;
};

export type SealContext = Context & {
  // the model's root: a project (a git working tree) or any directory, e.g. an area
  projectPath: string;
  allocators: Allocators;
  seal: boolean;
  sealed: Sealed | null;
  halo: Hallow[];
  outcome: SealOutcome;
};

export function unsealed(file: string): SealOutcome {
  return { action: "none", file, files: 0, sealedAt: null, drift: null };
}
