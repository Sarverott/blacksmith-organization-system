// .omnis.toml (decisions Q15, Q16): a "halo" of a model's files made of weak hashes. Each
// hash alone is broken or collides; the key (where a file is) and the value (what it holds)
// together pin it down, as triangulation does ("triangulum").
//
//   [moriatur]
//   UNIXUSAT = 1793968000000
//   [allocators]
//   KEYNAME = ["crc32", "a12y", "adler32"]
//   VALUEDATA = ["sha1", "md5", "crc32"]
//   [hallows]
//   <base32 of the keyname allocators over the path> = "<base32 of the valuedata digests>"
//
// One file per model, in its .bos/, describing that model only (Q16). Counted: regular files
// only, none a .gitignore leaves out, none inside another model (a directory with a .bos/ of
// its own), whose names begin and end with a letter (so .omnis.toml never counts itself).
import type { DigestAlgorithm, Host } from "./host.ts";

export const OMNIS_FILE = ".bos/.omnis.toml";

// a12y, the owner's algorithm (not a numeronym like a11y): the first letter, the length and
// the last letter of any string: "authenticity" → "a12y", "ab" → "a2b", "x" → "x1x"
export function a12y(word: string): string {
  const letters = [...word];
  if (!letters.length) {
    return "0";
  }
  return `${letters[0]}${letters.length}${letters[letters.length - 1]}`;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

const hex8 = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
const utf8 = (text: string) => new TextEncoder().encode(text);

// CRC-32 (IEEE, as zip and zlib), lowercase hex
export function crc32(text: string): string {
  let c = 0xffffffff;
  for (const byte of utf8(text)) {
    c = (CRC_TABLE[(c ^ byte) & 0xff] ?? 0) ^ (c >>> 8);
  }
  return hex8(c ^ 0xffffffff);
}

// Adler-32 (as zlib), lowercase hex
export function adler32(text: string): string {
  let a = 1;
  let b = 0;
  for (const byte of utf8(text)) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return hex8((b << 16) | a);
}

// base32 (RFC 4648) without "=" padding: a bare TOML key may hold only A-Z, a-z, 0-9, _ and -
export function base32(text: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of utf8(text)) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += alphabet[(value << (5 - bits)) & 31];
  }
  return out;
}

// the allocators of a key: each reads the file's path (relative to the model, with /)
export const KEYNAME_ALLOCATORS = {
  crc32: (path: string) => crc32(path),
  adler32: (path: string) => adler32(path),
  a12y: (path: string) => a12y(path.split("/").pop() ?? path),
} as const;

export type KeynameAllocator = keyof typeof KEYNAME_ALLOCATORS;

// three for the key, three for the value (Q16: changeable); recorded in the file
export type Allocators = { keyname: KeynameAllocator[]; valuedata: DigestAlgorithm[] };

export const DEFAULT_ALLOCATORS: Allocators = {
  keyname: ["crc32", "a12y", "adler32"],
  valuedata: ["sha1", "md5", "crc32"],
};

// does a file of this name count: it begins and ends with a letter
export function counted(path: string): boolean {
  const name = path.split("/").pop() ?? "";
  return /^\p{L}(.*\p{L})?$/u.test(name);
}

// the files of this model only: none inside a directory that is a model of its own (it has
// its own .bos/, and its own .omnis.toml)
export function ownFiles(host: Host, root: string, files: string[]): string[] {
  const boundary = new Map<string, boolean>();
  const isModel = (dir: string) => {
    if (!boundary.has(dir)) {
      boundary.set(dir, host.isDirectory(`${root}/${dir}/.bos`));
    }
    return boundary.get(dir) === true;
  };
  return files.filter((path) => {
    const parts = path.split("/").slice(0, -1);
    return !parts.some((_, at) => isModel(parts.slice(0, at + 1).join("/")));
  });
}

export type Hallow = { key: string; value: string; path: string };

// one line of [hallows] for a file (path relative to the model's root, with /); null when
// it is not a regular file
export function hallow(
  host: Host,
  root: string,
  path: string,
  allocators: Allocators = DEFAULT_ALLOCATORS,
): Hallow | null {
  const digests = allocators.valuedata.map((algorithm) =>
    host.digest(`${root}/${path}`, algorithm),
  );
  if (digests.some((digest) => digest === null)) {
    return null;
  }
  const key = allocators.keyname.map((name) => KEYNAME_ALLOCATORS[name](path)).join("");
  return { key: base32(key), value: base32(digests.join("")), path };
}

// the halo of the given files (e.g. LocalGit.files(): what no .gitignore leaves out)
export function omnis(
  host: Host,
  root: string,
  files: string[],
  allocators: Allocators = DEFAULT_ALLOCATORS,
): Hallow[] {
  return ownFiles(host, root, files.filter(counted))
    .sort()
    .map((path) => hallow(host, root, path, allocators))
    .filter((entry): entry is Hallow => entry !== null);
}

const list = (names: string[]) => `[${names.map((name) => `"${name}"`).join(", ")}]`;

// .omnis.toml's text
export function omnisToml(
  hallows: Hallow[],
  unixusat: number,
  allocators: Allocators = DEFAULT_ALLOCATORS,
): string {
  return [
    "[moriatur]",
    `UNIXUSAT = ${unixusat}`,
    "[allocators]",
    `KEYNAME = ${list(allocators.keyname)}`,
    `VALUEDATA = ${list(allocators.valuedata)}`,
    "[hallows]",
    ...hallows.map(({ key, value }) => `${key} = "${value}"`),
    "",
  ].join("\n");
}

export type Sealed = { unixusat: number; allocators: Allocators; hallows: Map<string, string> };

// read back what omnisToml wrote (only that shape: sections, bare keys, strings, string lists)
export function readOmnis(text: string): Sealed {
  const sealed: Sealed = { unixusat: 0, allocators: DEFAULT_ALLOCATORS, hallows: new Map() };
  const allocators = { ...DEFAULT_ALLOCATORS };
  let section = "";
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const header = /^\[(\w+)\]$/.exec(line);
    if (header) {
      section = header[1] ?? "";
      continue;
    }
    const pair = /^([\w-]+)\s*=\s*(.+)$/.exec(line);
    if (!pair) {
      continue;
    }
    const [, key = "", value = ""] = pair;
    const strings = [...value.matchAll(/"([^"]*)"/g)].map((match) => match[1] ?? "");
    if (section === "moriatur" && key === "UNIXUSAT") {
      sealed.unixusat = Number(value);
    } else if (section === "allocators" && key === "KEYNAME") {
      allocators.keyname = strings as KeynameAllocator[];
    } else if (section === "allocators" && key === "VALUEDATA") {
      allocators.valuedata = strings as DigestAlgorithm[];
    } else if (section === "hallows") {
      sealed.hallows.set(key, strings[0] ?? "");
    }
  }
  sealed.allocators = allocators;
  return sealed;
}

// what changed since the halo was sealed: keys come from paths, so a changed file keeps its
// key and gets another value; the paths are known only for what is here now
export type Drift = { added: string[]; changed: string[]; removed: number };

export function drift(sealed: Sealed, now: Hallow[]): Drift {
  const here = new Set(now.map((entry) => entry.key));
  return {
    added: now.filter((entry) => !sealed.hallows.has(entry.key)).map((entry) => entry.path),
    changed: now
      .filter(
        (entry) => sealed.hallows.has(entry.key) && sealed.hallows.get(entry.key) !== entry.value,
      )
      .map((entry) => entry.path),
    removed: [...sealed.hallows.keys()].filter((key) => !here.has(key)).length,
  };
}

export const unchanged = (d: Drift) => !d.added.length && !d.changed.length && !d.removed;
