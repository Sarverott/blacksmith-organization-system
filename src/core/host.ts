// The one door between the core and the machine it runs on. Models and procedures
// touch files, clocks and the environment only through a Host, so the same core can
// run on Node (hosts/node.ts) today and on other runtimes later.

export type Entry = { name: string; directory: boolean };

// what changed under a watched root: path relative to that root
export type Change = { path: string; kind: "change" | "rename" };

export interface Host {
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  list(path: string): Entry[];
  readText(path: string): string | null;
  writeText(path: string, text: string): void;
  appendText(path: string, text: string): void;
  mkdir(path: string): void;
  // calls onChange for every change below root until the returned function is called;
  // onError once when the watcher can no longer listen (it never fails silently);
  // skip(relative) true: that directory and everything below it is not watched
  watch(
    root: string,
    onChange: (change: Change) => void,
    onError: (error: Error) => void,
    skip?: (relative: string) => boolean,
  ): () => void;
  env(name: string): string | undefined;
  home(): string;
  cwd(): string;
  hostname(): string;
  user(): string;
  // UNIXUSAT: unix time in milliseconds
  now(): number;
}
