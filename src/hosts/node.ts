// Host for Node.js: the real file system, clock and environment.
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  watch,
  writeFileSync,
} from "node:fs";
import { homedir, hostname, userInfo } from "node:os";
import { resolve } from "node:path";

import type { Change, Entry, Host } from "../core/host.ts";

export class NodeHost implements Host {
  exists(path: string): boolean {
    return existsSync(path);
  }

  isDirectory(path: string): boolean {
    try {
      return statSync(path).isDirectory();
    } catch {
      return false;
    }
  }

  list(path: string): Entry[] {
    try {
      return readdirSync(path, { withFileTypes: true }).map((entry) => ({
        name: entry.name,
        directory: entry.isDirectory(),
      }));
    } catch {
      return [];
    }
  }

  readText(path: string): string | null {
    try {
      return readFileSync(path, "utf8");
    } catch {
      return null;
    }
  }

  writeText(path: string, text: string): void {
    writeFileSync(path, text);
  }

  appendText(path: string, text: string): void {
    appendFileSync(path, text);
  }

  mkdir(path: string): void {
    mkdirSync(path, { recursive: true });
  }

  watch(root: string, onChange: (change: Change) => void): () => void {
    const watcher = watch(root, { recursive: true }, (kind, filename) => {
      if (filename) onChange({ path: String(filename), kind: kind === "rename" ? "rename" : "change" });
    });
    return () => watcher.close();
  }

  env(name: string): string | undefined {
    return process.env[name];
  }

  home(): string {
    return homedir();
  }

  cwd(): string {
    return resolve(process.cwd());
  }

  hostname(): string {
    return hostname();
  }

  user(): string {
    return userInfo().username;
  }

  now(): number {
    return Date.now();
  }
}
