import { describe, expect, it } from "vitest";

import { locateWorkshop, NodeHost } from "../src/index.ts";

// a host with its own environment, home and current directory; nothing is read from disk
class Env extends NodeHost {
  readonly vars: Record<string, string>;
  readonly place: string;
  constructor(vars: Record<string, string>, cwd = "/elsewhere") {
    super();
    this.vars = vars;
    this.place = cwd;
  }
  override env(name: string): string | undefined {
    return this.vars[name];
  }
  override home(): string {
    return "/home/smith";
  }
  override cwd(): string {
    return this.place;
  }
}

describe("locating the workshop", () => {
  it("defaults to ~/__WORKSHOP, or the nearest __WORKSHOP above the current directory", () => {
    expect(locateWorkshop(new Env({}))).toEqual({ root: "/home/smith/__WORKSHOP", source: "default per user" });
    expect(locateWorkshop(new Env({}, "/media/x/__WORKSHOP/forge/s")).root).toBe("/media/x/__WORKSHOP");
  });

  it("puts the workshop in $WORKSHOP_ROOT, even when working inside another one", () => {
    const host = new Env({ WORKSHOP_ROOT: "/run/media/smith/test-A/" }, "/home/smith/__WORKSHOP/forge/s/p");
    expect(locateWorkshop(host)).toEqual({ root: "/run/media/smith/test-A/__WORKSHOP", source: "$WORKSHOP_ROOT" });
  });

  it("renames the workshop directory with $WORKSHOP_RENAME", () => {
    expect(locateWorkshop(new Env({ WORKSHOP_RENAME: ".__WORKSHOP" })).root).toBe("/home/smith/.__WORKSHOP");
    const root = new Env({ WORKSHOP_ROOT: "~/demo", WORKSHOP_RENAME: ".__WORKSHOP" });
    expect(locateWorkshop(root).root).toBe("/home/smith/demo/.__WORKSHOP");
    expect(locateWorkshop(new Env({ WORKSHOP_RENAME: "ws" }, "/m/ws/forge")).root).toBe("/m/ws");
  });

  it("lets --workshop and $BOS_WORKSHOP win over $WORKSHOP_ROOT; empty values count as unset", () => {
    const host = new Env({ BOS_WORKSHOP: "/a/__WORKSHOP", WORKSHOP_ROOT: "/b" });
    expect(locateWorkshop(host, "/c/__WORKSHOP").source).toBe("--workshop option");
    expect(locateWorkshop(host).source).toBe("$BOS_WORKSHOP");
    expect(locateWorkshop(new Env({ WORKSHOP_ROOT: "", BOS_WORKSHOP: " " })).source).toBe("default per user");
  });
});
