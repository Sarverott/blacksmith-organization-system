// Decision Q6: a read-only clone of the forge → a bare mirror in archive/.repos-mirrors/;
// the forge copy goes only on confirm, and only when nothing of it would be lost.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], {
    cwd,
    encoding: "utf8",
  }).trim();

describe("archiving", () => {
  it("mirrors a clone, then removes the forge copy only when nothing is lost", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    const project = join(root, "forge/others/github-repos/tool");
    gitRepo(project, "master");
    write(join(project, "README.md"), "a tool");
    git(project, "add", ".");
    git(project, "commit", "-qm", "first");
    git(project, "remote", "add", "origin", "https://example.org/someone/tool.git");
    const mirror = join(root, "archive/.repos-mirrors/others___github-repos___tool.git");

    const planned = await bos.archiveMirror(project, { confirm: true, dryRun: true });
    expect(planned).toMatchObject({ mirror, action: "would-mirror", removal: "would-remove" });
    expect(existsSync(mirror)).toBe(false);

    const mirrored = await bos.archiveMirror(project);
    expect(mirrored).toMatchObject({ action: "mirrored", removal: "kept" });
    expect(git(mirror, "rev-parse", "--is-bare-repository")).toBe("true");
    expect(git(mirror, "remote", "get-url", "origin")).toBe("https://example.org/someone/tool.git");
    const report = await bos.inspect();
    expect(report.findings.map((finding) => finding.rule)).toContain("mirrored-in-forge");

    write(join(project, "notes.md"), "not committed");
    const refused = await bos.archiveMirror(project, { confirm: true });
    expect(refused).toMatchObject({ action: "updated", removal: "refused" });
    expect(refused.uncommitted).toEqual(["?? notes.md"]);
    expect(existsSync(project)).toBe(true);

    git(project, "add", ".");
    git(project, "commit", "-qm", "second");
    const head = git(project, "rev-parse", "HEAD");
    const removed = await bos.archiveMirror(project, { confirm: true });
    expect(removed).toMatchObject({ action: "updated", removal: "removed" });
    expect(existsSync(project)).toBe(false);
    expect(git(mirror, "rev-parse", "master")).toBe(head);
  });

  it("takes only a project of the forge", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    gitRepo(join(root, "craftbook/notes"));
    await expect(bos.archiveMirror(join(root, "craftbook/notes"))).rejects.toThrow(
      "not in the forge",
    );
    await expect(bos.archiveMirror(join(root, "forge/scope"))).rejects.toThrow("a scope");
  });
});
