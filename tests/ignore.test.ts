// .gitignore read by BOS itself (Q16): a model outside git is counted as git would count it.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ignored, ignoreRules, NodeHost, treeFiles } from "../src/index.ts";
import { bosFor, tempWorkshop, write } from "./helpers.ts";

const host = new NodeHost();

describe("ignore", () => {
  it("reads the patterns of gitignore(5)", () => {
    const rules = ignoreRules(
      "# a comment\n*.log\n!keep.log\n/build\ncache/\ndocs/**/*.tmp\na?c\n[xy].txt\n",
    );
    const left = (path: string, directory = false) => ignored(rules, path, directory);
    expect(left("app.log")).toBe(true);
    expect(left("deep/in/app.log")).toBe(true);
    expect(left("keep.log")).toBe(false);
    expect(left("build", true)).toBe(true);
    expect(left("src/build", true)).toBe(false);
    expect(left("cache", true)).toBe(true);
    expect(left("cache")).toBe(false);
    expect(left("docs/a/b/x.tmp")).toBe(true);
    expect(left("docs/x.tmp")).toBe(true);
    expect(left("abc")).toBe(true);
    expect(left("x.txt")).toBe(true);
    expect(left("z.txt")).toBe(false);
  });

  it("lists what git would list, outside a repository", () => {
    const root = mkdtempSync(join(tmpdir(), "bos-ignore-"));
    write(join(root, ".gitignore"), "node_modules/\n*.log\n");
    write(join(root, "notes/.gitignore"), "draft-*\n!draft-kept\n");
    for (const file of [
      "README.md",
      "app.log",
      "node_modules/x/index.js",
      "notes/a.md",
      "notes/draft-1",
      "notes/draft-kept",
      "inner-model/.bos/bos.json",
      "inner-model/file",
      "inner-repo/file",
    ]) {
      write(join(root, file), "x");
    }
    mkdirSync(join(root, "inner-repo/.git"));
    const walked = treeFiles(host, root);
    expect(walked).toEqual([
      ".gitignore",
      "README.md",
      "notes/.gitignore",
      "notes/a.md",
      "notes/draft-kept",
    ]);
    // the same as git says, once it is a repository
    execFileSync("git", ["init", "-q", root]);
    const git = execFileSync(
      "git",
      ["-C", root, "ls-files", "--others", "--exclude-standard", "--", ".", ":!inner-*"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .sort();
    expect(walked).toEqual(git);
  });

  it("seals an area of the workshop, which is no repository", async () => {
    const workshop = tempWorkshop();
    const craftbook = join(workshop, "craftbook");
    write(join(craftbook, "recipes/bread.md"), "flour");
    const bos = bosFor(workshop);
    expect(await bos.omnis({ dir: craftbook, seal: true })).toMatchObject({
      action: "written",
      files: 1,
    });
    write(join(craftbook, "recipes/bread.md"), "flour, water");
    expect((await bos.omnis({ dir: craftbook })).drift).toEqual({
      added: [],
      changed: ["recipes/bread.md"],
      removed: 0,
    });
  });
});
