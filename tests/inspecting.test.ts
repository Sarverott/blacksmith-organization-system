import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

const rules = (findings: { rule: string }[]) => findings.map((f) => f.rule);

describe("inspecting", () => {
  it("an empty place reports every missing area as an error", async () => {
    const report = await bosFor(tempWorkshop()).inspect();
    const missing = report.findings.filter((f) => f.rule === "missing-area");
    expect(missing.length).toBeGreaterThanOrEqual(5);
    expect(missing.every((f) => f.level === "error")).toBe(true);
  });

  it("reads scopes and the projects below them, at any depth", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    gitRepo(join(root, "forge/sarverott/github-repos/gitrecon"));
    gitRepo(join(root, "forge/bos/core"), "master");
    write(join(root, "forge/bos/core/package.json"), '{"version":"0.6.1"}');
    gitRepo(join(root, "forge/bos/core/vendor/inner")); // inside a project: not searched
    const report = await bos.inspect();
    const scopes = Object.fromEntries(report.forge.scopes.map((s) => [s.name, s.projects]));
    expect(scopes.sarverott?.map((p) => p.name)).toEqual(["gitrecon"]);
    expect(scopes.bos?.map((p) => [p.name, p.git?.branch, p.version?.version])).toEqual([["core", "master", "0.6.1"]]);
    expect(rules(report.findings)).toContain("work-on-master");
  });

  it("is coherent: complete workshop, strays and misspelt branches are named", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    write(join(root, "loose.txt"));
    write(join(root, "forge/NOTES.md"));
    gitRepo(join(root, "forge/s/p"), "developement");
    const report = await bos.inspect();
    expect(report.findings.filter((f) => f.level === "error")).toEqual([]);
    expect(report.strays).toEqual(["loose.txt"]);
    expect(rules(report.findings)).toEqual(
      expect.arrayContaining(["stray-in-root", "loose-in-forge", "misspelt-branch"]),
    );
  });
});
