// A second workshop half-made beside __WORKSHOP (the partition root given where the
// workshop was meant): found by status, stopped at bootstrap, brought inside by repair.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import { BOS, NodeHost, Workshop } from "../src/index.ts";
import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

describe("repairing", () => {
  it("finds areas beside the workshop, refuses to bootstrap, then moves them inside", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    write(join(root, "craftbook/scrapnotes/note.md"), "inside");
    const holder = dirname(root);
    // what the old library left at the partition root, and work done there since
    mkdirSync(join(holder, ".BOS"), { recursive: true });
    write(join(holder, ".BOS/workshop.json"), '{"other": true}');
    write(join(holder, "craftbook/scrapnotes/note.md"), "beside, different");
    write(join(holder, "craftbook/scrapnotes/same.md"), "same");
    write(join(root, "craftbook/scrapnotes/same.md"), "same");
    gitRepo(join(holder, "forge/scope/project"));
    write(join(holder, "forge/scope/project/README.md"), "work");

    const report = await bos.inspect();
    expect(
      report.findings.filter((f) => f.rule === "areas-beside-workshop").map((f) => f.path),
    ).toEqual([join(holder, ".BOS"), join(holder, "forge"), join(holder, "craftbook")]);
    await expect(bos.bootstrap()).rejects.toThrow("bos workshop repair first");

    const plan = await bos.repair();
    expect(plan.applied).toBe(false);
    expect(plan.moves).toEqual([
      { from: join(holder, "forge/scope"), to: join(root, "forge/scope") },
    ]);
    expect(plan.scaffolding).toEqual([join(holder, ".BOS/workshop.json")]);
    expect(plan.duplicates).toEqual([join(holder, "craftbook/scrapnotes/same.md")]);
    expect(plan.conflicts.map((c) => c.from)).toEqual([
      join(holder, "craftbook/scrapnotes/note.md"),
    ]);
    expect(existsSync(join(holder, "forge"))).toBe(true);

    const done = await bos.repair({ confirm: true });
    expect(done.applied).toBe(true);
    expect(readFileSync(join(root, "forge/scope/project/README.md"), "utf8")).toBe("work");
    expect(existsSync(join(root, "forge/scope/project/.git"))).toBe(true);
    expect(existsSync(join(holder, "forge"))).toBe(false);
    expect(existsSync(join(holder, ".BOS"))).toBe(false);
    // the conflict stays, with the area that holds it
    expect(readFileSync(join(holder, "craftbook/scrapnotes/note.md"), "utf8")).toBe(
      "beside, different",
    );
    expect(readFileSync(join(root, "craftbook/scrapnotes/note.md"), "utf8")).toBe("inside");
    expect((await bos.inspect()).misplaced).toEqual([join(holder, "craftbook")]);
  });

  it("builds a workshop only in a directory named __WORKSHOP", async () => {
    const root = join(dirname(tempWorkshop()), "not-a-workshop");
    const host = new NodeHost();
    const bos = new BOS(host);
    Object.defineProperty(bos, "workshop", { value: new Workshop(host, root) });
    await expect(bos.bootstrap()).rejects.toThrow("is not named __WORKSHOP");
    expect(existsSync(root)).toBe(false);
  });
});
