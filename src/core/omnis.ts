// .omnis.toml (a draft, BRAINSTORM Q15 → decision): a "halo" of a model's files made of
// weak hashes. Each hash alone is broken or collides; the key (where a file is) and the
// value (what it holds) together pin it down, as triangulation does ("triangulum").
//
//   [moriatur]
//   UNIXUSAT = 1793968000000
//   [hallows]
//   <base32 of crc32(path) + a12y(name) + adler32(path)> = "<base32 of sha1 + md5 + crc32>"
//
// Counted: regular files only (no directories, links, pipes, devices), none a .gitignore
// leaves out, whose names begin and end with a letter (so .omnis.toml never counts itself).
import type { DigestAlgorithm, Host } from "./host.ts";

// the content hashes of a value, in order; the third ("weakhashalgorithm") is crc32 for now
// (assumed: Q16)
export const VALUE_DIGESTS: DigestAlgorithm[] = ["sha1", "md5", "crc32"];

// "authenticity" → "a12y": the first letter, the length, the last letter (the owner's
// example; the usual numeronym counts only the letters between, a10y - Q16)
export function a12y(word: string): string {
  const letters = [...word];
  if (letters.length < 3) {
    return word;
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

// does a file of this name count: it begins and ends with a letter
export function counted(path: string): boolean {
  const name = path.split("/").pop() ?? "";
  return /^\p{L}(.*\p{L})?$/u.test(name);
}

export type Hallow = { key: string; value: string; path: string };

// one line of [hallows] for a file (path relative to the model's root, with /); null when
// it is not a regular file
export function hallow(host: Host, root: string, path: string): Hallow | null {
  const digests = VALUE_DIGESTS.map((algorithm) => host.digest(`${root}/${path}`, algorithm));
  if (digests.some((digest) => digest === null)) {
    return null;
  }
  const name = path.split("/").pop() ?? path;
  const key = [crc32(path), a12y(name), adler32(path)].join("");
  return { key: base32(key), value: base32(digests.join("")), path };
}

// the halo of the given files (e.g. LocalGit.files(): what no .gitignore leaves out)
export function omnis(host: Host, root: string, files: string[]): Hallow[] {
  return files
    .filter(counted)
    .sort()
    .map((path) => hallow(host, root, path))
    .filter((entry): entry is Hallow => entry !== null);
}

// .omnis.toml's text
export function omnisToml(hallows: Hallow[], unixusat: number): string {
  const lines = hallows.map(({ key, value }) => `${key} = "${value}"`);
  return ["[moriatur]", `UNIXUSAT = ${unixusat}`, "[hallows]", ...lines, ""].join("\n");
}
