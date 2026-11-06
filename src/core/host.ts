// The one door between the core and the machine it runs on. Models and procedures
// touch files, clocks and the environment only through a Host, so the same core can
// run on Node (hosts/node.ts) today and on other runtimes later.
import type { DaemonFiles } from "./daemon.ts";

export type Entry = { name: string; directory: boolean };

// what changed under a watched root: path relative to that root
export type Change = { path: string; kind: "change" | "rename" };

// what a command left behind; status 127 when it could not be started
export type RunResult = { status: number; stdout: string; stderr: string };

// digests of a file's raw content, as lowercase hex (.omnis.toml: core/omnis.ts)
export type DigestAlgorithm = "sha1" | "md5" | "crc32";

export interface Host {
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  list(path: string): Entry[];
  readText(path: string): string | null;
  writeText(path: string, text: string): void;
  appendText(path: string, text: string): void;
  // the digest of a regular file's raw bytes; null when it is not a regular file
  // (a directory, a link, a pipe, a device) or cannot be read
  digest(path: string, algorithm: DigestAlgorithm): string | null;
  mkdir(path: string): void;
  // remove a directory and everything in it (only procedures that checked what is lost call it)
  removeTree(path: string): void;
  // calls onChange for every change below root until the returned function is called;
  // onError once when the watcher can no longer listen (it never fails silently);
  // skip(relative) true: that directory and everything below it is not watched
  watch(
    root: string,
    onChange: (change: Change) => void,
    onError: (error: Error) => void,
    skip?: (relative: string) => boolean,
  ): () => void;
  // run BOS's supervisor of a daemon (src/hosts/daemon/) on these files: detached, its pid
  // returned at once; foreground: attached to this terminal, its exit code when it ends
  supervise(files: DaemonFiles, options?: { foreground?: boolean }): number;
  // send a signal to a process ("SIGTERM", "SIGHUP"…; 0 only asks whether it lives);
  // false when there is no such process
  signal(pid: number, signal: string | 0): boolean;
  // run a program and wait for it; only bridges (src/bridges/) call this
  run(command: string, args: string[], options?: { cwd?: string }): RunResult;
  env(name: string): string | undefined;
  home(): string;
  cwd(): string;
  hostname(): string;
  user(): string;
  // UNIXUSAT: unix time in milliseconds
  now(): number;
}
