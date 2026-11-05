import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

import { describe, expect, it } from "vitest";

import { classify, isNoise, type WorkshopEvent } from "../src/index.ts";
import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

describe("watching", () => {
  it("drops noise", () => {
    expect(isNoise("forge/s/p/.git/index")).toBe(true);
    expect(isNoise("forge/s/p/node_modules/x/y.js")).toBe(true);
    expect(isNoise(".BOS/storylines/logs/workshop.jsonl")).toBe(true);
    expect(isNoise(".BOS/setup/ssh/config")).toBe(false);
  });

  it("places a change in its area, scope and project", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    gitRepo(join(root, "forge/scope/group/app"));
    write(join(root, "forge/scope/group/app/src/a.ts"));
    expect(classify(bos.workshop, { path: "forge/scope/group/app/src/a.ts", kind: "change" })).toMatchObject({
      area: "forge",
      scope: "scope",
      project: "group/app",
      inner: "src/a.ts",
    });
    expect(classify(bos.workshop, { path: "craftbook/scrapnotes/n.md", kind: "rename" })).toMatchObject({
      area: "craftbook",
      scope: null,
      inner: "scrapnotes/n.md",
    });
  });

  it("listens until stopped, and records with record", async () => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    gitRepo(join(root, "forge/s/p"));
    write(join(root, "forge/s/p/file.txt"), "a");
    const events: WorkshopEvent[] = [];
    const stop = new AbortController();
    const running = bos.watch({ signal: stop.signal, record: true, quietMs: 0, onEvent: (e) => events.push(e) });
    await sleep(200);
    appendFileSync(join(root, "forge/s/p/file.txt"), "b");
    for (let i = 0; i < 40 && !events.length; i++) await sleep(50);
    stop.abort();
    await running;
    expect(events[0]).toMatchObject({ area: "forge", scope: "s", project: "p", inner: "file.txt" });
  });

  it("refuses a workshop that does not exist", async () => {
    const stop = new AbortController();
    stop.abort();
    await expect(bosFor(tempWorkshop()).watch({ signal: stop.signal, onEvent: () => {} })).rejects.toThrow(/bootstrap/);
  });
});
