import { compareSemver } from "../../core/version.ts";
import type { ReconcileContext } from "./context.ts";

type Manifest = { version?: string; packages?: Record<string, { version?: string }> };

function parse(text: string): Manifest | null {
  try {
    const data = JSON.parse(text);
    return typeof data === "object" && data !== null && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

const SIDES = ["base", "ours", "theirs"] as const;

export function read(context: ReconcileContext): void {
  for (const side of SIDES) {
    const text = context.host.readText(context.files[side]);
    if (text === null) throw new Error(`no ${side} file: ${context.files[side]}`);
    context.texts[side] = text;
  }
  const versions = [context.texts.ours, context.texts.theirs]
    .map((text) => parse(text)?.version)
    .filter((version): version is string => typeof version === "string" && /^\d+\.\d+\.\d+$/.test(version));
  context.outcome.version = versions.sort(compareSemver).at(-1) ?? null;
}

// the same version on every side (a lock also carries it in packages[""])
export function align(context: ReconcileContext): void {
  const { version } = context.outcome;
  if (!version) return;
  for (const side of SIDES) {
    const manifest = parse(context.texts[side]);
    if (!manifest || manifest.version === undefined) continue;
    manifest.version = version;
    const root = manifest.packages?.[""];
    if (root?.version !== undefined) root.version = version;
    // npm writes JSON with two spaces and a final newline
    context.host.writeText(context.files[side], `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

export function merge(context: ReconcileContext): void {
  const { base, ours, theirs } = context.files;
  if (context.git.mergeFile(ours, base, theirs)) context.outcome.action = "conflict";
}
