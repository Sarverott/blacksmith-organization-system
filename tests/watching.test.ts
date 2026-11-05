import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

import { describe, expect, it } from "vitest";

import { BOS, classify, isNoise, NodeHost, WATCH_LIMIT, type WorkshopEvent } from "../src/index.ts";
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

  it("listens until stopped, and records with record", async (test) => {
    const root = tempWorkshop();
    const bos = bosFor(root);
    await bos.bootstrap();
    gitRepo(join(root, "forge/s/p"));
    write(join(root, "forge/s/p/file.txt"), "a");
    const events: WorkshopEvent[] = [];
    const stop = new AbortController();
    const running = bos.watch({ signal: stop.signal, record: true, quietMs: 0, onEvent: (e) => events.push(e) });
    // held from the start: a watch that fails at once must not be an unhandled rejection
    const failure = running.then(
      () => null,
      (error: Error) => error,
    );
    await sleep(200);
    appendFileSync(join(root, "forge/s/p/file.txt"), "b");
    for (let i = 0; i < 40 && !events.length; i++) await sleep(50);
    // a directory made while listening is listened to as well
    write(join(root, "forge/s/p/new/deep.txt"));
    await sleep(100);
    appendFileSync(join(root, "forge/s/p/new/deep.txt"), "c");
    for (let i = 0; i < 40 && !events.some((e) => e.inner === "new/deep.txt"); i++) await sleep(50);
    stop.abort();
    const error = await failure;
    // the machine, not the code: Linux is out of inotify watches (an editor holds them)
    if (error?.message.includes(WATCH_LIMIT)) return test.skip(WATCH_LIMIT);
    if (error) throw error;
    expect(events[0]).toMatchObject({ area: "forge", scope: "s", project: "p", inner: "file.txt" });
    expect(events.some((e) => e.inner === "new/deep.txt")).toBe(true);
  });

  it("fails instead of going deaf when the watcher breaks", async () => {
    class BrokenWatch extends NodeHost {
      override watch(_root: string, _onChange: unknown, onError: (error: Error) => void): () => void {
        setTimeout(() => onError(new Error("watcher broke")), 10);
        return () => {};
      }
    }
    const root = tempWorkshop();
    await bosFor(root).bootstrap();
    const bos = new BOS(new BrokenWatch(), { workshop: root });
    await expect(bos.watch({ signal: new AbortController().signal, onEvent: () => {} })).rejects.toThrow(
      /watcher broke/,
    );
  });

  it("refuses a workshop that does not exist", async () => {
    const stop = new AbortController();
    stop.abort();
    await expect(bosFor(tempWorkshop()).watch({ signal: stop.signal, onEvent: () => {} })).rejects.toThrow(/bootstrap/);
  });
});
