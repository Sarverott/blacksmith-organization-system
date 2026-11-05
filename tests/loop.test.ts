import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOOP,
  DEFAULT_VERSIONING,
  Loop,
  loopOf,
  NodeHost,
  settingsOf,
  versioningOf,
} from "../src/index.ts";
import { tempWorkshop, write } from "./helpers.ts";

describe("the craft loop", () => {
  const loop = new Loop();

  it("moves every station forward, with its ways back", () => {
    expect(loop.step("development")).toEqual({
      from: "development",
      to: "revision",
      automerge: true,
      back: ["rejection"],
    });
    expect(loop.step("releasing")).toMatchObject({ to: "master", automerge: false });
    expect(loop.step("rejection")).toMatchObject({ to: "development", back: [] });
    expect(loop.steps().map((s) => s.from)).toEqual(DEFAULT_LOOP.stations);
  });

  it("sends a contributor's branch into development, never merging it by itself", () => {
    expect(loop.step("dev/Cleo")).toEqual({
      from: "dev/Cleo",
      to: "development",
      automerge: false,
      back: [],
    });
    expect(loop.step("feature/x")).toBeNull();
  });

  it("refuses a loop that goes nowhere or names unknown branches", () => {
    const broken = {
      ...DEFAULT_LOOP,
      stations: ["master", "development"],
      directions: { master: ["development"], development: ["review"] },
      automerge: { staging: true },
    };
    expect(() => new Loop(broken, "x.json")).toThrow(
      /x\.json.*"review" is not a station.*"staging" is not a station/,
    );
    expect(
      () => new Loop({ ...DEFAULT_LOOP, contributors: { pattern: "dev/", into: "development" } }),
    ).toThrow(/end with \*/);
  });

  it("reads the loop section of a project's .github/bos.json over the default", () => {
    const project = join(tempWorkshop(), "p");
    const file = join(project, ".github/bos.json");
    expect(loopOf(new NodeHost(), project).source).toBe("default");
    write(file, JSON.stringify({ versioning: { bumps: { testing: "patch" } } }));
    expect(loopOf(new NodeHost(), project).source).toBe("default");
    write(file, JSON.stringify({ loop: { automerge: { development: false } } }));
    const own = loopOf(new NodeHost(), project);
    expect(own.source).toBe(file);
    expect(own.step("development")?.automerge).toBe(false);
    expect(own.step("revision")?.to).toBe("testing");
    write(file, "{ nope");
    expect(() => loopOf(new NodeHost(), project)).toThrow(/is not JSON/);
  });
});

describe("versioning settings", () => {
  it("bumps minor on revision and patch on master unless .github/bos.json says otherwise", () => {
    const project = join(tempWorkshop(), "p");
    const host = new NodeHost();
    expect(versioningOf(settingsOf(host, project))).toEqual(DEFAULT_VERSIONING);
    write(
      join(project, ".github/bos.json"),
      JSON.stringify({ versioning: { bumps: { testing: "patch" } } }),
    );
    expect(versioningOf(settingsOf(host, project)).bumps).toEqual({
      revision: "minor",
      master: "patch",
      testing: "patch",
    });
    write(
      join(project, ".github/bos.json"),
      JSON.stringify({ versioning: { bumps: { master: "huge" } } }),
    );
    expect(() => versioningOf(settingsOf(host, project))).toThrow(/bumps\.master is "huge"/);
  });
});
