// A project's BOS settings: <project>/.github/bos.json (like gitrecon's
// .github/bos.config.json and Amoorion's .github/flow.toml). Every section is
// optional; what is left out keeps the default.
import type { LoopData } from "../loop/data.ts";

// how far a version moves: semver X, Y or Z
export const BUMPS = ["major", "minor", "patch"] as const;
export type Bump = (typeof BUMPS)[number];

export type VersioningData = {
  // a branch (a station) → the bump made when work lands on it
  bumps: Record<string, Bump>;
  // the tag of a released version: <prefix><version>
  tagPrefix: string;
  // every commit on these branches (a pattern may end with *) bumps the version,
  // released or not: each commit has its own version (git hook pre-commit)
  commits: { branches: string[]; bump: Bump };
};

// the routine of phase 2: every commit on a contributor's branch is a patch,
// landing on revision is a minor bump, reaching master without it a patch
// ("hotfix"); a station bumps only when the version's line is released
export const DEFAULT_VERSIONING: VersioningData = {
  bumps: { revision: "minor", master: "patch" },
  tagPrefix: "v",
  commits: { branches: ["dev/*"], bump: "patch" },
};

export type SettingsData = {
  loop?: Partial<LoopData>;
  versioning?: Partial<Omit<VersioningData, "commits">> & {
    commits?: Partial<VersioningData["commits"]>;
  };
};
