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
  LocalGit,
  NodeHost,
  omnis,
  omnisToml,
} from "../src/index.ts";
import { write } from "./helpers.ts";

const host = new NodeHost();

describe("omnis", () => {
  it("has the checksums and the encoding of their standards", () => {
    expect(crc32("123456789")).toBe("cbf43926");
    expect(adler32("Wikipedia")).toBe("11e60398");
    // RFC 4648 gives MZXW6YTBOI======; a bare TOML key cannot hold the padding
    expect(base32("foobar")).toBe("MZXW6YTBOI");
    expect(a12y("authenticity")).toBe("a12y");
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
        "[hallows]",
        ...halo.map(({ key, value }) => `${key} = "${value}"`),
        "",
      ].join("\n"),
    );
    // the key: crc32 + a12y + adler32 of the path; the value: sha1 + md5 + crc32 of the content
    expect(readme?.key).toBe(base32(`${crc32("README.md")}R9d${adler32("README.md")}`));
    expect(readme?.key).toMatch(/^[A-Z2-7]+$/);
  });
});
