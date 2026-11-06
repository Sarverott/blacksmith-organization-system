import { LocalGit } from "../../bridges/index.ts";
import { inside, normalize } from "../../core/paths.ts";
import type { ArchiveContext } from "./context.ts";

const clone = (context: ArchiveContext) => new LocalGit(context.host, context.outcome.project);

export function locate(context: ArchiveContext): void {
  const { outcome, host, workshopForge } = context;
  const project = normalize(outcome.project);
  outcome.project = project;
  const relative = inside(workshopForge, project);
  if (!relative) {
    throw new Error(`${project} is not in the forge (${workshopForge})`);
  }
  if (!relative.includes("/")) {
    throw new Error(`${project} is a scope, not a project: forge/<scope>/<project>`);
  }
  if (!host.exists(`${project}/.git`)) {
    throw new Error(`${project} is not a git repository`);
  }
  outcome.mirror = context.archive.mirrorOf(relative);
  outcome.upstream = clone(context).remoteUrl();
}

export function check(context: ArchiveContext): void {
  context.outcome.uncommitted = clone(context).uncommitted();
}

export function mirror(context: ArchiveContext): void {
  const { outcome, host } = context;
  const exists = host.exists(outcome.mirror);
  context.changes.push(outcome.mirror);
  if (context.dryRun) {
    outcome.action = exists ? "would-update" : "would-mirror";
    return;
  }
  if (exists) {
    new LocalGit(host, outcome.mirror).fetchMirror(outcome.project);
    outcome.action = "updated";
    return;
  }
  host.mkdir(context.archive.mirrorsPath);
  new LocalGit(host, context.archive.mirrorsPath).cloneMirror(outcome.project, outcome.mirror);
  if (outcome.upstream) {
    new LocalGit(host, outcome.mirror).setRemoteUrl("origin", outcome.upstream);
  }
  outcome.action = "mirrored";
}

// the forge copy goes only when nothing of it would be lost
export function remove(context: ArchiveContext): void {
  const { outcome, host } = context;
  if (!context.confirm) {
    return;
  }
  if (outcome.uncommitted.length) {
    outcome.removal = "refused";
    outcome.reason = `${outcome.uncommitted.length} uncommitted: commit or drop them first`;
    return;
  }
  if (context.dryRun) {
    outcome.removal = "would-remove";
    context.changes.push(outcome.project);
    return;
  }
  const archived = new LocalGit(host, outcome.mirror);
  const missing = clone(context)
    .refCommits()
    .filter((sha) => !archived.hasCommit(sha));
  if (missing.length) {
    outcome.removal = "refused";
    outcome.reason = `the mirror lacks ${missing.length} commits of the forge copy`;
    return;
  }
  host.removeTree(outcome.project);
  context.changes.push(outcome.project);
  outcome.removal = "removed";
}
