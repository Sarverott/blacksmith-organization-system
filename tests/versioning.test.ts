import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { bosFor, tempWorkshop, write } from "./helpers.ts";

describe("scope versions (GRIH)", () => {
  it("starts at 0.0.0.0, keeps other fields, records the bump", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    write(join(root, "forge/bos/.bos/scope.json"), '{"owner":"sett"}');
    expect((await bos.bumpScope("bos", "step")).result).toMatchObject({ from: null, to: "0.0.0.1" });
    expect((await bos.bumpScope("bos", "milestone")).result).toMatchObject({ from: "0.0.0.1", to: "0.1.0.0" });
    expect(JSON.parse(readFileSync(join(root, "forge/bos/.bos/scope.json"), "utf8"))).toEqual({
      owner: "sett",
      version: "0.1.0.0",
    });
    const log = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8");
    expect(log).toContain('"loopEvent":"milestone"');
  });

  it("a dry run changes nothing", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    write(join(root, "forge/bos/readme.md"));
    await bos.bumpScope("bos", "phase", { dryRun: true });
    expect(bos.workshop.forge.scope("bos").version()).toBeNull();
  });

  it("refuses a scope that does not exist", async () => {
    const root = tempWorkshop();
    await bosFor(root).bootstrap();
    await expect(bosFor(root).bumpScope("ghost", "step")).rejects.toThrow(/no scope/);
  });
});
