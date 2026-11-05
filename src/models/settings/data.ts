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
};

// the routine of phase 2: landing on revision is a minor bump, reaching
// master without it a patch ("hotfix"); only a released version is bumped
export const DEFAULT_VERSIONING: VersioningData = {
  bumps: { revision: "minor", master: "patch" },
  tagPrefix: "v",
};

export type SettingsData = {
  loop?: Partial<LoopData>;
  versioning?: Partial<VersioningData>;
};
