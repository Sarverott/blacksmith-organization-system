// The git hooks must fail when their task fails, whatever `task` comes first in PATH.
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { write } from "./helpers.ts";

const runner = resolve(".husky/task");

describe(".husky/task", () => {
  it("passes on the failure of a task, even with a task that exits 0 first in PATH", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-hooks-"));
    // like husky: node_modules/.bin first, holding a `task` that always exits 0
    // (as @go-task/cli's npm wrapper does)
    write(join(dir, "node_modules/.bin/task"), "#!/bin/sh\nexit 0\n");
    chmodSync(join(dir, "node_modules/.bin/task"), 0o755);
    write(join(dir, "Taskfile.yml"), 'version: "3"\ntasks:\n  fails:\n    cmds: [exit 3]\n');
    const { status } = spawnSync("sh", [runner, "fails"], {
      cwd: dir,
      env: { ...process.env, PATH: `node_modules/.bin:${process.env.PATH}` },
    });
    expect(status).not.toBe(0);
  });
});

describe("package.json as the version bump writes it", () => {
  // the bump (here, and in the revision workflow, outside any hook) writes JSON.stringify(…, 2):
  // every array on its own lines; biome must take that as formatted, or CI's lint fails
  it("is formatted for biome", () => {
    const written = `${JSON.stringify({ name: "x", files: ["dist", "README.md"] }, null, 2)}\n`;
    const { status, stdout } = spawnSync(
      "npx",
      ["biome", "format", "--stdin-file-path=package.json"],
      { input: written, encoding: "utf8" },
    );
    expect(status).toBe(0);
    expect(stdout).toBe(written);
  });
});
