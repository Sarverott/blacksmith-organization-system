import { describe, expect, it } from "vitest";

import { bumpGrih, bumpSemver } from "../src/index.ts";

describe("loop events bump versions", () => {
  it.each([
    ["step", "0.6.2"],
    ["phase", "0.7.0"],
    ["milestone", "1.0.0"],
    ["flip", "1.0.0"],
  ] as const)("semver 0.6.1 + %s → %s", (event, next) => {
    expect(bumpSemver("v0.6.1", event)).toBe(next);
  });

  it.each([
    ["step", "1.2.3.5"],
    ["phase", "1.2.4.0"],
    ["milestone", "1.3.0.0"],
    ["flip", "2.0.0.0"],
  ] as const)("GRIH 1.2.3.4 + %s → %s", (event, next) => {
    expect(bumpGrih("1.2.3.4", event)).toBe(next);
  });

  it("refuses what is not its scheme", () => {
    expect(() => bumpSemver("1.2.3.4", "step")).toThrow(/semver/);
    expect(() => bumpGrih("1.2.3", "step")).toThrow(/GRIH/);
    expect(() => bumpSemver("1.2.x", "step")).toThrow();
  });
});
