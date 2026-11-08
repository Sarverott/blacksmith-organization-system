// Creating the forge's elements: a scope, a project seeded with the standard anatomy, a
// clone brought in; never overwriting.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { fill, parseSource, targetName } from "../src/index.ts";
import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], {
    cwd,
    encoding: "utf8",
  }).trim();

describe("creating", () => {
  it("reads what to clone", () => {
    expect(parseSource("gh:Sarverott/gitrecon")).toEqual({
      url: "https://github.com/Sarverott/gitrecon.git",
      owner: "Sarverott",
      repo: "gitrecon",
    });
    expect(parseSource("Sarverott/gitrecon").url).toBe("https://github.com/Sarverott/gitrecon.git");
    expect(parseSource("git@gitlab.com:someone/tool.git")).toMatchObject({
      owner: "someone",
      repo: "tool",
    });
    expect(parseSource("../local/repo")).toMatchObject({ url: "../local/repo", repo: "repo" });
    expect(fill("{{name}} by {{author}} {{unknown}}", { name: "x", author: "Sett" })).toBe(
      "x by Sett {{unknown}}",
    );
    expect(targetName("_gitignore")).toBe(".gitignore");
  });

  it("creates a scope and a project with the standard anatomy, then only what is missing", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();

    const planned = await bos.create("project", "tools/anvil", { dryRun: true });
    expect(planned.changes).toContain(join(root, "forge/tools/.bos/scope.json"));
    expect(existsSync(join(root, "forge/tools"))).toBe(false);

    const made = await bos.create("project", "tools/anvil");
    expect(made.changes).toEqual(planned.changes);
    const project = join(root, "forge/tools/anvil");
    expect(made.anatomy?.missing).toEqual([]);
    expect(git(project, "symbolic-ref", "--short", "HEAD")).toBe("development");
    expect(readFileSync(join(project, "README.md"), "utf8")).toContain("# anvil");
    expect(readFileSync(join(project, "LICENSE"), "utf8")).toMatch(/Copyright \(c\) \d{4} \S/);
    expect(readFileSync(join(project, "CLAUDE.md"), "utf8")).toBe("@AGENTS.md\n");
    expect(existsSync(join(project, ".gitignore"))).toBe(true);
    expect(existsSync(join(project, ".github/dependabot.yml"))).toBe(true);
    expect(JSON.parse(readFileSync(join(root, "forge/tools/.bos/scope.json"), "utf8"))).toEqual({
      version: "0.0.0.0",
    });
    const workspace = join(root, "forge/tools/tools.code-workspace");
    expect(JSON.parse(readFileSync(workspace, "utf8")).folders).toEqual([
      { path: "anvil" },
      { path: "." },
    ]);

    write(join(project, "README.md"), "mine");
    const again = await bos.create("project", "tools/anvil");
    expect(again).toMatchObject({ existed: true, changes: [] });
    expect(readFileSync(join(project, "README.md"), "utf8")).toBe("mine");

    // a second project joins the workspace; what the owner put in it stays
    const data = JSON.parse(readFileSync(workspace, "utf8"));
    data.settings = { "editor.tabSize": 2 };
    write(workspace, JSON.stringify(data));
    await bos.create("project", "tools/tongs");
    const after = JSON.parse(readFileSync(workspace, "utf8"));
    expect(after.folders.map((f: { path: string }) => f.path)).toEqual(["anvil", ".", "tongs"]);
    expect(after.settings).toEqual({ "editor.tabSize": 2 });

    const report = await bos.inspect();
    expect(report.findings.filter((f) => f.path.includes("forge/tools"))).toEqual([]);
  });

  it("imports a clone into the scope of its owner, seeded on asking", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    const source = join(root, "../elsewhere/someone/hammer");
    gitRepo(source, "master");
    write(join(source, "README.md"), "a hammer");
    git(source, "add", ".");
    git(source, "commit", "-qm", "first");
    git(source, "branch", "development");

    const brought = await bos.create("import", source, { seed: true });
    const project = join(root, "forge/someone/hammer");
    expect(brought).toMatchObject({
      path: project,
      scope: "someone",
      url: source,
      branch: "development",
    });
    expect(readFileSync(join(project, "README.md"), "utf8")).toBe("a hammer");
    expect(brought.anatomy?.missing).toEqual([]);
    await expect(bos.create("import", source)).rejects.toThrow("there already");
    // asked for another branch, or none named development: as asked, or the default one
    const other = await bos.create("import", source, { name: "hammer-master", branch: "master" });
    expect(other.branch).toBe("master");
    await expect(bos.create("project", "bad name/x")).rejects.toThrow("not a scope name");
  });

  it("notes a clone whose canon is not master", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    const source = join(root, "../elsewhere/someone/croaker");
    gitRepo(source, "main");
    write(join(source, "README.md"), "croak");
    git(source, "add", ".");
    git(source, "commit", "-qm", "first");
    await bos.create("import", source, { scope: "rauson" });
    const findings = (await bos.inspect()).findings.filter((f) => f.rule === "canon-not-master");
    expect(findings.map((f) => f.path)).toEqual([join(root, "forge/rauson/croaker")]);
    expect(findings[0]?.message).toContain("default branch is main");
  });
});
