import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { tempWorkshop } from "./helpers.ts";

const bos = (...args: string[]) => spawnSync(process.execPath, ["src/cli.ts", ...args], { encoding: "utf8" });

describe("bos (cli)", () => {
  it("prints its version and help", () => {
    expect(bos("--version").stdout.trim()).toBe(JSON.parse(readFileSync("package.json", "utf8")).version);
    expect(bos("help").stdout).toContain("bos workshop status");
  });

  it("bootstraps and reports as JSON", () => {
    const root = tempWorkshop();
    expect(bos("workshop", "bootstrap", `--workshop=${root}`).status).toBe(0);
    const status = bos("workshop", "status", `--workshop=${root}`, "--json");
    expect(JSON.parse(status.stdout).findings.filter((f: { level: string }) => f.level === "error")).toEqual([]);
  });

  it("fails with a message on a wrong call", () => {
    const result = bos("forge", "melt");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('unknown model "forge"');
  });
});
