import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BOS, NodeHost } from "../src/index.ts";
import { gitRepo, tempWorkshop, write } from "./helpers.ts";

// a project at version, tagged v<version> when released
function project(version: string, released: boolean): string {
  const dir = join(tempWorkshop(), "p");
  gitRepo(dir);
  write(join(dir, "package.json"), `${JSON.stringify({ name: "p", version }, null, 2)}\n`);
  write(
    join(dir, "package-lock.json"),
    `${JSON.stringify({ name: "p", version, packages: { "": { name: "p", version } } }, null, 2)}\n`,
  );
  const git = (...args: string[]) =>
    execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], { cwd: dir });
  git("add", ".");
  git("commit", "-qm", "chore: start");
  if (released) git("tag", `v${version}`);
  return dir;
}

const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

describe("flow: bumping", () => {
  it("bumps a released version by the station's bump, package.json and its lock", async () => {
    const dir = project("1.0.0", true);
    const outcome = await new BOS(new NodeHost()).bump("revision", { dir });
    expect(outcome).toMatchObject({ action: "bumped", bump: "minor", from: "1.0.0", to: "1.1.0" });
    expect(json(join(dir, "package.json")).version).toBe("1.1.0");
    expect(json(join(dir, "package-lock.json")).packages[""].version).toBe("1.1.0");
    expect(await new BOS(new NodeHost()).bump("master", { dir })).toMatchObject({ action: "kept", to: "1.1.0" });
  });

  it("keeps an unreleased version, so a release passing revision and master is bumped once", async () => {
    const dir = project("1.1.0", false);
    expect(await new BOS(new NodeHost()).bump("master", { dir })).toMatchObject({
      action: "kept",
      reason: "v1.1.0 is not released yet: it stays",
    });
  });

  it("patches what reaches master released, plans only on a dry run, ignores stations without a bump", async () => {
    const dir = project("1.1.0", true);
    const bos = new BOS(new NodeHost());
    expect(await bos.bump("master", { dir, dryRun: true })).toMatchObject({ action: "would-bump", to: "1.1.1" });
    expect(json(join(dir, "package.json")).version).toBe("1.1.0");
    expect(await bos.bump("testing", { dir })).toMatchObject({ action: "none", bump: null });
  });
});

describe("flow: a version per commit", () => {
  it("bumps minor on revision once the line is released, even when the patch is not", async () => {
    const dir = project("1.2.5", false);
    execFileSync("git", ["tag", "v1.2.0"], { cwd: dir });
    const bos = new BOS(new NodeHost());
    expect(await bos.bump("revision", { dir })).toMatchObject({ action: "bumped", from: "1.2.5", to: "1.3.0" });
    expect(await bos.bump("revision", { dir })).toMatchObject({
      action: "kept",
      reason: "v1.3.* is not released yet: it stays",
    });
  });

  it("bumps the patch of every commit on a contributor's branch, released or not; nothing elsewhere", async () => {
    const dir = project("1.3.0", false);
    const bos = new BOS(new NodeHost());
    expect(await bos.bumpCommit({ dir })).toMatchObject({ action: "none", reason: expect.stringContaining("no bump") });
    execFileSync("git", ["checkout", "-qb", "dev/Cleo"], { cwd: dir });
    expect(await bos.bumpCommit({ dir })).toMatchObject({ action: "bumped", to: "1.3.1" });
    expect(await bos.bumpCommit({ dir })).toMatchObject({ action: "bumped", to: "1.3.2" });
    expect(json(join(dir, "package-lock.json")).packages[""].version).toBe("1.3.2");
  });

  it("merges two branches' versions without a conflict: the higher wins, other changes merge as usual", async () => {
    const dir = project("1.3.0", false);
    const git = (...args: string[]) =>
      execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], { cwd: dir, encoding: "utf8" });
    // the driver as the pre-commit hook registers it, run from this checkout
    const cli = join(import.meta.dirname, "..", "src", "cli.ts");
    git("config", "merge.bos-version.driver", `node ${cli} flow merge-version %O %A %B`);
    write(join(dir, ".gitattributes"), "package.json merge=bos-version\npackage-lock.json merge=bos-version\n");
    git("add", ".");
    git("commit", "-qm", "chore: driver");
    const bos = new BOS(new NodeHost());
    // a manifest with room between what the two branches change
    const fields = { keywords: ["a", "b", "c", "d", "e"], license: "MIT", scripts: { x: "1", y: "2", z: "3" } };
    write(join(dir, "package.json"), `${JSON.stringify({ ...json(join(dir, "package.json")), ...fields }, null, 2)}\n`);
    git("commit", "-qam", "chore: fields");
    const step = async (branch: string, times: number, change: (m: Record<string, unknown>) => void) => {
      git("checkout", "-qB", branch, "development");
      for (let i = 0; i < times; i++) await bos.bumpCommit({ dir });
      const manifest = json(join(dir, "package.json"));
      change(manifest);
      write(join(dir, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
      git("commit", "-qam", `feat: ${branch}`);
    };
    await step("dev/a", 3, (m) => {
      m.license = "ISC";
    });
    await step("dev/b", 1, (m) => {
      m.scripts = { x: "1", y: "2", z: "changed" };
    });
    git("checkout", "-q", "development");
    git("merge", "-q", "--no-ff", "-m", "merge a", "dev/a");
    git("merge", "-q", "--no-ff", "-m", "merge b", "dev/b");
    const merged = json(join(dir, "package.json"));
    expect(merged).toMatchObject({ version: "1.3.3", license: "ISC", scripts: { z: "changed" } });
    expect(json(join(dir, "package-lock.json")).version).toBe("1.3.3");
  });
});
