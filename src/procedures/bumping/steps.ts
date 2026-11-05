import { join } from "../../core/paths.ts";
import { bumpSemver, type LoopEvent } from "../../core/version.ts";
import type { Bump } from "../../models/_index.ts";
import type { BumpContext } from "./context.ts";

const EVENT_OF: Record<Bump, LoopEvent> = { major: "milestone", minor: "phase", patch: "step" };

type Manifest = { version?: string; packages?: Record<string, { version?: string }> };

function readManifest(context: BumpContext, name: string): Manifest | null {
  const text = context.host.readText(join(context.projectPath, name));
  return text === null ? null : (JSON.parse(text) as Manifest);
}

export function read(context: BumpContext): void {
  const { outcome, station } = context;
  const version = readManifest(context, "package.json")?.version;
  if (!version) throw new Error(`no version in ${join(context.projectPath, "package.json")}`);
  outcome.from = version;
  outcome.bump = context.everyCommit ? context.versioning.commits.bump : (context.versioning.bumps[station] ?? null);
  if (!outcome.bump) outcome.reason = `nothing bumps on ${station}: ${version} stays`;
}

// the tags that release the line a bump leaves: patch 1.2.3 → v1.2.3,
// minor → v1.2.*, major → v1.*
function lineOf(context: BumpContext, version: string, bump: Bump): string {
  const [x, y] = version.split(".");
  const prefix = context.versioning.tagPrefix;
  return bump === "patch" ? `${prefix}${version}` : bump === "minor" ? `${prefix}${x}.${y}.*` : `${prefix}${x}.*`;
}

export function check(context: BumpContext): void {
  const { outcome } = context;
  if (outcome.reason || !outcome.from || !outcome.bump || context.everyCommit) return;
  const line = lineOf(context, outcome.from, outcome.bump);
  if (context.git.tags(line).length === 0) {
    Object.assign(outcome, { action: "kept", to: outcome.from, reason: `${line} is not released yet: it stays` });
  }
}

export function write(context: BumpContext): void {
  const { outcome } = context;
  if (outcome.reason || !outcome.from || !outcome.bump) return;
  const to = bumpSemver(outcome.from, EVENT_OF[outcome.bump]);
  outcome.to = to;
  context.changes.push(`version ${outcome.from} → ${to} (${outcome.bump}, ${context.station})`);
  if (context.dryRun) {
    Object.assign(outcome, { action: "would-bump", reason: `would bump ${outcome.from} → ${to}` });
    return;
  }
  for (const name of ["package.json", "package-lock.json"]) {
    const manifest = readManifest(context, name);
    if (!manifest) continue;
    manifest.version = to;
    const root = manifest.packages?.[""];
    if (root) root.version = to;
    context.host.writeText(join(context.projectPath, name), `${JSON.stringify(manifest, null, 2)}\n`);
  }
  Object.assign(outcome, { action: "bumped", reason: `bumped ${outcome.from} → ${to} (${outcome.bump})` });
}
