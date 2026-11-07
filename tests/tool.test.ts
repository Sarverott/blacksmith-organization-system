import { describe, expect, it } from "vitest";

import { findTool, inputFor, parseArgs, splitLine } from "../src/index.ts";

describe("tools", () => {
  it("parses operands and flags", () => {
    expect(parseArgs(["scope", "bump", "x", "--dry-run", "--workshop=/a=b"])).toEqual({
      operands: ["scope", "bump", "x"],
      flags: { dryRun: true, workshop: "/a=b" },
    });
  });

  it("fills the input from operands and checks it", () => {
    const bump = findTool("scope", "bump");
    expect(inputFor(bump, ["s", "phase"], { dryRun: true })).toEqual({
      scope: "s",
      event: "phase",
      dryRun: true,
    });
    expect(() => inputFor(bump, ["s"], {})).toThrow(/needs: event/);
    expect(() => inputFor(bump, ["s", "phase", "extra"], {})).toThrow(/too many operands/);
  });

  it("names what exists when a tool is unknown", () => {
    expect(() => findTool("nope", "x")).toThrow(
      /models: workshop, scope, devlog, flow, project, version/,
    );
    expect(() => findTool("workshop", "x")).toThrow(
      /tools: locate, status, repair, bootstrap, watch/,
    );
  });
});

describe("splitLine (the REPL)", () => {
  it("splits a line as a shell would, quotes holding an argument together", () => {
    expect(splitLine(`almanac judge "Cleo pushes to master" --dir=.`)).toEqual([
      "almanac",
      "judge",
      "Cleo pushes to master",
      "--dir=.",
    ]);
    expect(splitLine(`  flow  explain 'a b' "say \\"hi\\""  `)).toEqual([
      "flow",
      "explain",
      "a b",
      'say "hi"',
    ]);
    expect(splitLine("   ")).toEqual([]);
  });
});
