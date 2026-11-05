import { describe, expect, it } from "vitest";

import { paths } from "../src/index.ts";

describe("paths", () => {
  it("joins and normalizes", () => {
    expect(paths.join("/a", "b/../c", "./d/")).toBe("/a/c/d");
    expect(paths.normalize("/../x")).toBe("/x");
  });

  it("tells what lies inside a root", () => {
    expect(paths.inside("/w", "/w/forge/s")).toBe("forge/s");
    expect(paths.inside("/w", "/w")).toBe("");
    expect(paths.inside("/w", "/workshop")).toBeNull();
  });

  it("splits names", () => {
    expect(paths.basename("/a/b/")).toBe("b");
    expect(paths.dirname("/a/b")).toBe("/a");
    expect(paths.dirname("/a")).toBe("/");
  });
});
