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
