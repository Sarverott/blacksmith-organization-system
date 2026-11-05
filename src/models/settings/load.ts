// Reads <project>/.github/bos.json; a project without it runs on the defaults.
import type { Host } from "../../core/host.ts";
import { join } from "../../core/paths.ts";
import { BUMPS, DEFAULT_VERSIONING, type SettingsData, type VersioningData } from "./data.ts";

export type Settings = { source: string; data: SettingsData };

export function settingsFile(projectPath: string): string {
  return join(projectPath, ".github", "bos.json");
}

export function settingsOf(host: Host, projectPath: string): Settings {
  const file = settingsFile(projectPath);
  const text = host.readText(file);
  if (text === null) return { source: "default", data: {} };
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`${file} is not JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) throw new Error(`${file} is not an object`);
  return { source: file, data: data as SettingsData };
}

export function versioningOf(settings: Settings): VersioningData {
  const own = settings.data.versioning ?? {};
  const versioning: VersioningData = {
    ...DEFAULT_VERSIONING,
    ...own,
    bumps: { ...DEFAULT_VERSIONING.bumps, ...own.bumps },
    commits: { ...DEFAULT_VERSIONING.commits, ...own.commits },
  };
  if (!BUMPS.includes(versioning.commits.bump)) {
    throw new Error(
      `${settings.source}: versioning.commits.bump is "${versioning.commits.bump}", not one of ${BUMPS.join(", ")}`,
    );
  }
  for (const [branch, bump] of Object.entries(versioning.bumps)) {
    if (!BUMPS.includes(bump)) {
      throw new Error(`${settings.source}: versioning.bumps.${branch} is "${bump}", not one of ${BUMPS.join(", ")}`);
    }
  }
  return versioning;
}

// does a branch match one of the patterns ("dev/*": a prefix, else the name)
export function branchMatches(branch: string, patterns: string[]): boolean {
  return patterns.some((p) => (p.endsWith("*") ? branch.startsWith(p.slice(0, -1)) : branch === p));
}
