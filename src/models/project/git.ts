// What git says about a project, read from the files in .git without running git.
import type { Host } from "../../core/host.ts";
import { join, normalize } from "../../core/paths.ts";

export type GitState = { branch: string | null; detached: boolean } | null;

// .git is a directory, or (submodules, worktrees) a file "gitdir: <path>"
export function gitDir(host: Host, root: string): string | null {
  const dotgit = join(root, ".git");
  if (host.isDirectory(dotgit)) {
    return dotgit;
  }
  const pointer = host
    .readText(dotgit)
    ?.match(/^gitdir:\s*(.+)$/m)?.[1]
    ?.trim();
  if (!pointer) {
    return null;
  }
  return pointer.startsWith("/") ? normalize(pointer) : join(root, pointer);
}

export function isRepository(host: Host, root: string): boolean {
  return host.exists(join(root, ".git"));
}

export function readGit(host: Host, root: string): GitState {
  const dir = gitDir(host, root);
  const head = dir ? host.readText(join(dir, "HEAD"))?.trim() : null;
  if (!head) {
    return null;
  }
  const branch = head.match(/^ref: refs\/heads\/(.+)$/)?.[1] ?? null;
  return { branch, detached: branch === null };
}
