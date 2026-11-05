import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { bosFor, tempWorkshop } from "./helpers.ts";

describe("bootstrapping", () => {
  it("builds the five areas and the parts of .BOS", async () => {
    const root = tempWorkshop();
    await bosFor(root).bootstrap();
    for (const area of [".BOS", "devarmory", "forge", "craftbook", "archive"])
      expect(existsSync(join(root, area))).toBe(true);
    for (const part of ["setup", "data", "nests/.index.json", "nests/.manifest.json", "workshop.json"])
      expect(existsSync(join(root, ".BOS", part))).toBe(true);
  });

  it("a dry run writes nothing and plans exactly what the real run creates", async () => {
    const root = tempWorkshop();
    const planned = (await bosFor(root).bootstrap({ dryRun: true })).changes;
    expect(existsSync(root)).toBe(false);
    const created = (await bosFor(root).bootstrap()).changes;
    expect(created).toEqual(planned);
  });

  it("creates only what is missing and never overwrites", async () => {
    const root = tempWorkshop();
    await bosFor(root).bootstrap();
    const descriptor = join(root, ".BOS", "workshop.json");
    writeFileSync(descriptor, '{"mine":true}\n');
    const again = await bosFor(root).bootstrap();
    expect(again.changes).toEqual([]);
    expect(readFileSync(descriptor, "utf8")).toBe('{"mine":true}\n');
  });

  it("records a bootstrap that created something", async () => {
    const root = tempWorkshop();
    await bosFor(root).bootstrap();
    const log = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8").trim().split("\n");
    expect(log).toHaveLength(1);
    expect(JSON.parse(log[0] ?? "")).toMatchObject({ event: "bootstrap" });
  });
});
