import { describe, expect, it } from "vitest";

import { findTool, inputFor, parseArgs } from "../src/index.ts";

describe("tools", () => {
  it("parses operands and flags", () => {
    expect(parseArgs(["scope", "bump", "x", "--dry-run", "--workshop=/a=b"])).toEqual({
      operands: ["scope", "bump", "x"],
      flags: { dryRun: true, workshop: "/a=b" },
    });
  });

  it("fills the input from operands and checks it", () => {
    const bump = findTool("scope", "bump");
    expect(inputFor(bump, ["s", "phase"], { dryRun: true })).toEqual({ scope: "s", event: "phase", dryRun: true });
    expect(() => inputFor(bump, ["s"], {})).toThrow(/needs: event/);
    expect(() => inputFor(bump, ["s", "phase", "extra"], {})).toThrow(/too many operands/);
  });

  it("names what exists when a tool is unknown", () => {
    expect(() => findTool("nope", "x")).toThrow(/models: workshop, scope, devlog, version/);
    expect(() => findTool("workshop", "x")).toThrow(/tools: locate, status, bootstrap, watch/);
  });
});
