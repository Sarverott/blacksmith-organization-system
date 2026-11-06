import { LocalGit } from "../../bridges/index.ts";
import type { Host } from "../../core/host.ts";
import {
  type Allocators,
  drift,
  type Hallow,
  OMNIS_FILE,
  omnis,
  omnisToml,
  readOmnis,
  type Sealed,
  unchanged,
} from "../../core/omnis.ts";
import type { SealContext } from "./context.ts";

// the halo of a model (a git working tree) now
export function haloOf(host: Host, root: string, allocators?: Allocators): Hallow[] {
  return omnis(host, root, new LocalGit(host, root).files(), allocators);
}

// the halo sealed in a model's .bos/.omnis.toml, null when there is none
export function sealedOf(host: Host, root: string): Sealed | null {
  const text = host.readText(`${root}/${OMNIS_FILE}`);
  return text === null ? null : readOmnis(text);
}

export function read(context: SealContext): void {
  context.sealed = sealedOf(context.host, context.projectPath);
  // a sealed halo is compared with the allocators it was made with
  if (context.sealed && !context.seal) {
    context.allocators = context.sealed.allocators;
  }
  context.outcome.sealedAt = context.sealed?.unixusat ?? null;
}

export function gather(context: SealContext): void {
  context.halo = omnis(context.host, context.projectPath, context.git.files(), context.allocators);
  context.outcome.files = context.halo.length;
}

export function compare(context: SealContext): void {
  if (context.sealed) {
    context.outcome.drift = drift(context.sealed, context.halo);
  }
}

export function write(context: SealContext): void {
  const { outcome } = context;
  if (!context.seal || (outcome.drift && unchanged(outcome.drift))) {
    return;
  }
  context.changes.push(outcome.file);
  if (context.dryRun) {
    outcome.action = "would-write";
    return;
  }
  const text = omnisToml(context.halo, context.host.now(), context.allocators);
  context.host.mkdir(`${context.projectPath}/.bos`);
  context.host.writeText(outcome.file, text);
  outcome.action = "written";
}
