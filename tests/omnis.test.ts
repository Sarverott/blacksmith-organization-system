// .omnis.toml (a draft): weak hashes of a model's files, as a TOML halo.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  a12y,
  adler32,
  base32,
  counted,
  crc32,
  drift,
  LocalGit,
  NodeHost,
  omnis,
  omnisToml,
  readOmnis,
} from "../src/index.ts";
import { bosFor, gitRepo, tempWorkshop, write } from "./helpers.ts";

const host = new NodeHost();

describe("omnis", () => {
  it("has the checksums and the encoding of their standards", () => {
    expect(crc32("123456789")).toBe("cbf43926");
    expect(adler32("Wikipedia")).toBe("11e60398");
    // RFC 4648 gives MZXW6YTBOI======; a bare TOML key cannot hold the padding
    expect(base32("foobar")).toBe("MZXW6YTBOI");
  });

  it("has a12y: the first letter, the length, the last letter of any string", () => {
    expect(a12y("authenticity")).toBe("a12y");
    expect(a12y("ab")).toBe("a2b");
    expect(a12y("x")).toBe("x1x");
    expect(a12y("żółw")).toBe("ż4w");
  });

  it("counts only names that begin and end with a letter", () => {
    expect(["README.md", "src/a.ts", "docs/x"].every(counted)).toBe(true);
    expect([".gitignore", ".omnis.toml", "v1", "notes~", "data/2024"].some(counted)).toBe(false);
  });

  it("digests regular files only, through the host", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-omnis-"));
    write(join(dir, "abc"), "abc");
    expect(host.digest(join(dir, "abc"), "sha1")).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
    expect(host.digest(join(dir, "abc"), "md5")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(host.digest(join(dir, "abc"), "crc32")).toBe(crc32("abc"));
    symlinkSync(join(dir, "abc"), join(dir, "link"));
    expect(host.digest(join(dir, "link"), "md5")).toBeNull();
    expect(host.digest(dir, "md5")).toBeNull();
  });

  it("writes the halo of what no .gitignore leaves out", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-omnis-"));
    execFileSync("git", ["init", "-q", dir]);
    write(join(dir, ".gitignore"), "build/\n");
    write(join(dir, "README.md"), "# x\n");
    write(join(dir, "src/main.ts"), "export {};\n");
    write(join(dir, "build/out.js"), "1\n");
    write(join(dir, "notes1"), "ends with a digit\n");
    mkdirSync(join(dir, "empty"));

    const halo = omnis(host, dir, new LocalGit(host, dir).files());
    expect(halo.map((entry) => entry.path)).toEqual(["README.md", "src/main.ts"]);

    const toml = omnisToml(halo, 1793968000000);
    const [readme] = halo;
    expect(toml).toBe(
      [
        "[moriatur]",
        "UNIXUSAT = 1793968000000",
        "[allocators]",
        'KEYNAME = ["crc32", "a12y", "adler32"]',
        'VALUEDATA = ["sha1", "md5", "crc32"]',
        "[hallows]",
        ...halo.map(({ key, value }) => `${key} = "${value}"`),
        "",
      ].join("\n"),
    );
    // the key: crc32 + a12y + adler32 of the path; the value: sha1 + md5 + crc32 of the content
    expect(readme?.key).toBe(base32(`${crc32("README.md")}R9d${adler32("README.md")}`));
    expect(readme?.key).toMatch(/^[A-Z2-7]+$/);
  });

  it("stops at another model: a directory with a .bos/ of its own", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-omnis-"));
    execFileSync("git", ["init", "-q", dir]);
    write(join(dir, "README.md"), "# x\n");
    write(join(dir, "inner/.bos/scope.json"), "{}\n");
    write(join(dir, "inner/notes.md"), "its own halo\n");
    write(join(dir, "other/notes.md"), "mine\n");
    const halo = omnis(host, dir, new LocalGit(host, dir).files());
    expect(halo.map((entry) => entry.path)).toEqual(["README.md", "other/notes.md"]);
  });

  it("changes its allocators and reads them back from the file", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-omnis-"));
    write(join(dir, "README.md"), "# x\n");
    const allocators = { keyname: ["a12y" as const], valuedata: ["md5" as const] };
    const [entry] = omnis(host, dir, ["README.md"], allocators);
    expect(entry?.key).toBe(base32("R9d"));
    expect(entry?.value).toBe(base32(host.digest(join(dir, "README.md"), "md5") ?? ""));
    const sealed = readOmnis(omnisToml(entry ? [entry] : [], 5, allocators));
    expect(sealed.unixusat).toBe(5);
    expect(sealed.allocators).toEqual(allocators);
    expect(sealed.hallows.get(entry?.key ?? "")).toBe(entry?.value);
  });

  it("says what drifted since the halo was sealed", () => {
    const dir = mkdtempSync(join(tmpdir(), "bos-omnis-"));
    for (const name of ["kept", "edited", "gone"]) {
      write(join(dir, name), name);
    }
    const sealed = readOmnis(omnisToml(omnis(host, dir, ["kept", "edited", "gone"]), 1));
    write(join(dir, "edited"), "injected");
    write(join(dir, "new"), "new");
    expect(drift(sealed, omnis(host, dir, ["kept", "edited", "new"]))).toEqual({
      added: ["new"],
      changed: ["edited"],
      removed: 1,
    });
  });

  it("seals a project, and bos workshop status finds what changed while it was closed", async () => {
    const root = tempWorkshop();
    const project = join(root, "forge/scope/project");
    gitRepo(project);
    write(join(project, "README.md"), "# project\n");
    const bos = bosFor(root);
    await bos.bootstrap();

    expect(await bos.omnis({ dir: project })).toMatchObject({ sealedAt: null, files: 1 });
    expect(await bos.omnis({ dir: project, seal: true, dryRun: true })).toMatchObject({
      action: "would-write",
    });
    expect(await bos.omnis({ dir: project, seal: true })).toMatchObject({ action: "written" });
    expect(await bos.omnis({ dir: project, seal: true })).toMatchObject({ action: "none" });
    expect((await bos.inspect()).findings.some((f) => f.rule === "omnis-drift")).toBe(false);

    write(join(project, "README.md"), "# changed while closed\n");
    const finding = (await bos.inspect()).findings.find((f) => f.rule === "omnis-drift");
    expect(finding?.path).toBe(project);
    expect((await bos.omnis({ dir: project })).drift).toEqual({
      added: [],
      changed: ["README.md"],
      removed: 0,
    });
  });
});
