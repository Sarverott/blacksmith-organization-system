import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { DEFAULT_LOOP, Loop, loopOf, NodeHost } from "../src/index.ts";
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
    expect(loop.step("dev/Cleo")).toEqual({ from: "dev/Cleo", to: "development", automerge: false, back: [] });
    expect(loop.step("feature/x")).toBeNull();
  });

  it("refuses a loop that goes nowhere or names unknown branches", () => {
    const broken = {
      ...DEFAULT_LOOP,
      stations: ["master", "development"],
      directions: { master: ["development"], development: ["review"] },
      automerge: { staging: true },
    };
    expect(() => new Loop(broken, "x.json")).toThrow(/x\.json.*"review" is not a station.*"staging" is not a station/);
    expect(() => new Loop({ ...DEFAULT_LOOP, contributors: { pattern: "dev/", into: "development" } })).toThrow(
      /end with \*/,
    );
  });

  it("reads a project's own .bos/loop.json over the default", () => {
    const project = join(tempWorkshop(), "p");
    expect(loopOf(new NodeHost(), project).source).toBe("default");
    write(join(project, ".bos/loop.json"), JSON.stringify({ automerge: { development: false } }));
    const own = loopOf(new NodeHost(), project);
    expect(own.source).toBe(join(project, ".bos/loop.json"));
    expect(own.step("development")?.automerge).toBe(false);
    expect(own.step("revision")?.to).toBe("testing");
    write(join(project, ".bos/loop.json"), "{ nope");
    expect(() => loopOf(new NodeHost(), project)).toThrow(/is not JSON/);
  });
});
