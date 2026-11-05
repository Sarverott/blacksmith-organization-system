// A recursive watch built from one watcher per directory. Node's own recursive watch
// on Linux watches every file and, when inotify runs out, stops reporting without an
// error. Here a skipped directory (.git, node_modules…) costs no watch at all, a new
// directory is watched as soon as it appears, and running out of watches is an error.
import { type FSWatcher, readdirSync, statSync, watch } from "node:fs";

import type { Change } from "../core/host.ts";

// Linux gives every user a fixed number of inotify watches; editors watching big trees can take them all
export const WATCH_LIMIT =
  "no file watches left on this system (fs.inotify.max_user_watches); close other watchers (editors) or raise the limit";

export type TreeHandlers = {
  onChange: (change: Change) => void;
  onError: (error: Error) => void;
  skip: (relative: string) => boolean;
};

function asError(error: unknown): Error {
  const code = (error as NodeJS.ErrnoException | undefined)?.code;
  if (code === "ENOSPC") {
    return new Error(WATCH_LIMIT);
  }
  return error instanceof Error ? error : new Error(String(error));
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

export function watchTree(root: string, { onChange, onError, skip }: TreeHandlers): () => void {
  const watchers = new Map<string, FSWatcher>();
  let failed = false;
  const fail = (error: unknown) => {
    if (failed) {
      return;
    }
    failed = true;
    stop();
    onError(asError(error));
  };

  // relative: "" for the root, else "a/b"
  const add = (relative: string) => {
    if (failed || watchers.has(relative) || (relative && skip(relative))) {
      return;
    }
    const path = relative ? `${root}/${relative}` : root;
    let watcher: FSWatcher;
    try {
      watcher = watch(path, (kind, filename) => {
        if (!filename) {
          return;
        }
        const changed = relative ? `${relative}/${filename}` : String(filename);
        if (kind === "rename" && isDirectory(`${root}/${changed}`)) {
          add(changed);
        }
        if (kind === "rename" && !watchers.has(changed)) {
          drop(changed);
        }
        onChange({ path: changed, kind: kind === "rename" ? "rename" : "change" });
      });
    } catch (error) {
      // the directory vanished between listing and watching: nothing to watch
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }
      return fail(error);
    }
    watcher.on("error", fail);
    watchers.set(relative, watcher);
    let entries: string[] = [];
    try {
      entries = readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {}
    for (const name of entries) {
      add(relative ? `${relative}/${name}` : name);
    }
  };

  // a removed directory: close its watcher and those below it
  const drop = (relative: string) => {
    if (isDirectory(`${root}/${relative}`)) {
      return;
    }
    for (const [key, watcher] of watchers) {
      if (key === relative || key.startsWith(`${relative}/`)) {
        watcher.close();
        watchers.delete(key);
      }
    }
  };

  const stop = () => {
    for (const watcher of watchers.values()) {
      watcher.close();
    }
    watchers.clear();
  };

  add("");
  return stop;
}
