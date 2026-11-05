// Tests build their own workshops in the system's temp directory; never the real one.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { BOS, NodeHost } from "../src/index.ts";

export function tempWorkshop(): string {
  return join(mkdtempSync(join(tmpdir(), "bos-test-")), "__WORKSHOP");
}

export function bosFor(root: string): BOS {
  return new BOS(new NodeHost(), { workshop: root });
}

export function write(path: string, text = ""): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

// a git repository with one branch checked out
export function gitRepo(path: string, branch = "development"): void {
  mkdirSync(path, { recursive: true });
  execFileSync("git", ["init", "-q", "-b", branch, path]);
}
