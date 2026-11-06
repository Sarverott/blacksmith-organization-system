# Omnis

> `.omnis.toml`: a halo of weak hashes around a model's files. Each hash alone
> is broken or collides; together they pin a file down, as triangulation does.
> A draft (phase 2): it can be redefined later.

## What it is

An element keeps its own BOS files in `.bos/` (decision Q15: `.bos/` stays,
no `.craft/`). `.bos/.omnis.toml` *(assumed: its place)* lists the element's
files without naming them or showing their content:

```toml
[moriatur]
UNIXUSAT = 1793968000000
[hallows]
<key> = "<value>"
```

- **key** (where the file is): `base32(crc32(path) + a12y(name) + adler32(path))`,
  where `path` is relative to the element, with `/`.
- **value** (what the file holds): `base32(sha1 + md5 + crc32)` of its raw bytes.
- `a12y`: the first letter, the length and the last letter of a name
  (`a12y("authenticity") == "a12y"`, the owner's example).
- base32 is RFC 4648 without the `=` padding, because a bare TOML key cannot
  hold `=`.

Only these files are counted:

- regular files: no directories, links, pipes or devices;
- files that no `.gitignore` of the element leaves out;
- files whose name begins and ends with a letter. So `.omnis.toml` never
  counts itself.

The owner calls the idea a *triangulum*. A weak hash on its own collides:
many inputs give the same output. Several weak hashes taken together act like
coordinates, and each one narrows down which file it is. And the table only
holds hashes, so it can be shared or mirrored without showing what it guards.

## In code

`src/core/omnis.ts`: `a12y`, `crc32`, `adler32`, `base32`, `counted`, `omnis(host, root, files)`,
`omnisToml(hallows, unixusat)`. A file's digests go through the Host
(`host.digest(path, "sha1" | "md5" | "crc32")`), and `LocalGit.files()`
gives what no `.gitignore` leaves out. Nothing writes `.omnis.toml` yet.

## Open

BRAINSTORM Q16:

- the length rule in `a12y` (the usual numeronym gives `a10y`);
- which algorithm is the third, weak one;
- where the file goes;
- how `.gitignore` applies outside a git repository;
- what checks the table.
