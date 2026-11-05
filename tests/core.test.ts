// The small parts of src/core: events, JSON files, the package's own paths.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BOS, createContext, Emitter, JsonFile, NodeHost, paths } from "../src/index.ts";
import { tempWorkshop, write } from "./helpers.ts";

describe("Emitter", () => {
  it("calls listeners in order, once listeners only once, and says if anyone listened", () => {
    const heard: string[] = [];
    const emitter = new Emitter()
      .on("ring", (who) => heard.push(`a:${who}`))
      .once("ring", (who) => heard.push(`b:${who}`));
    expect(emitter.emit("ring", 1)).toBe(true);
    emitter.emit("ring", 2);
    expect(heard).toEqual(["a:1", "b:1", "a:2"]);
    expect(emitter.emit("silence")).toBe(false);
  });
});

describe("Element events", () => {
  it("emits created for what ensure() creates, and nothing in a dry run", () => {
    const root = tempWorkshop();
    const host = new NodeHost();
    const created: unknown[] = [];
    const craftbook = new BOS.Craftbook(host, join(root, "craftbook"));
    craftbook.on("created", (path) => created.push(path));
    craftbook.ensure(createContext(host, { dryRun: true }));
    expect(created).toEqual([]);
    craftbook.ensure(createContext(host));
    expect(created).toContain(join(root, "craftbook"));
  });
});

describe("JsonFile", () => {
  it("reads on first use, saves what changed, reads again on read()", () => {
    const file = join(tempWorkshop(), "data.json");
    write(file, '{ "version": "1.0.0" }');
    const json = new JsonFile<{ version: string }>(new NodeHost(), file);
    expect(json.data.version).toBe("1.0.0");
    json.data.version = "2.0.0";
    json.save();
    expect(JSON.parse(readFileSync(file, "utf8")).version).toBe("2.0.0");
    writeFileSync(file, '{ "version": "3.0.0" }');
    expect(json.data.version).toBe("2.0.0");
    expect(json.read().data.version).toBe("3.0.0");
  });

  it("says which file is missing", () => {
    const json = new JsonFile(new NodeHost(), "/nowhere/data.json");
    expect(json.exists()).toBe(false);
    expect(() => json.data).toThrow("/nowhere/data.json");
  });
});

describe("paths.packagePath", () => {
  it("finds the package's own files", () => {
    const manifest = paths.packagePath("package.json");
    expect(existsSync(manifest)).toBe(true);
    expect(JSON.parse(readFileSync(manifest, "utf8")).name).toBe("blacksmith-organization-system");
  });
});

describe("BOS.<Model>", () => {
  it("reaches every model as a static member of BOS", () => {
    expect(new BOS.Scrapnotes(new NodeHost(), "/w/craftbook/scrapnotes").type).toBe("scrapnotes");
    expect(BOS.Craftbook.children).toContain(BOS.Scrapnotes);
  });
});
