# Omnis

> `.omnis.toml`: a halo of weak hashes around a model's files. Each hash alone
> is broken or collides; together they pin a file down, as triangulation does.
> A draft (phase 2): it can be redefined later.

## What it is

An element keeps its own BOS files in `.bos/` (decision Q15: `.bos/` stays,
no `.craft/`). Every model has its own `.bos/.omnis.toml` (decision Q16),
which describes that model only: a submodel has its own file and its own
area. It lists the model's files without naming them or showing their
content:

```toml
[moriatur]
UNIXUSAT = 1793968000000
[allocators]
KEYNAME = ["crc32", "a12y", "adler32"]
VALUEDATA = ["sha1", "md5", "crc32"]
[hallows]
<key> = "<value>"
```

- **key** (where the file is): base32 of the `KEYNAME` allocators run on
  `path`, relative to the element, with `/`. By default
  `crc32(path) + a12y(name) + adler32(path)`.
- **value** (what the file holds): base32 of the `VALUEDATA` digests of its raw
  bytes. By default `sha1 + md5 + crc32`.
- **allocators**: three for the key, three for the value, changeable (Q16).
  The file records the ones it was made with, so it is read back with them.
  Keyname allocators: `crc32`, `adler32` (of the path), `a12y` (of the name).
  Valuedata allocators: `sha1`, `md5`, `crc32`.
- **a12y**: the owner's own algorithm, not a numeronym like a11y. It takes
  the first letter, the length and the last letter of any string:
  `a12y("authenticity") == "a12y"`, `a12y("ab") == "a2b"`. Simple yet
  useful, e.g. for 4-byte words of compression dictionaries.
- base32 is RFC 4648 without the `=` padding, because a bare TOML key cannot
  hold `=`.

Only these files are counted:

- regular files: no directories, links, pipes or devices;
- files that no `.gitignore` of the element leaves out. An ignored directory
  is never entered unless something in it is re-included: `node_modules` or
  `.venv` are left to their lock files (`package-lock.json`, `uv.lock`),
  which are counted and stand for them as a finality checksum;
- files outside other models: the walk stops at a directory with a `.bos/`
  of its own;
- files whose name begins and ends with a letter. So `.omnis.toml` never
  counts itself.

The owner calls the idea a *triangulum*. A weak hash on its own collides:
many inputs give the same output. Several weak hashes taken together act like
coordinates, and each one narrows down which file it is. And the table only
holds hashes, so it can be shared or mirrored without showing what it guards.

## What it is for

Comparing it with the files now says at once what changed while a project
was closed, and shows changes nobody meant to make (an injection). More uses
will come (Q16).

## In code

- `src/core/omnis.ts`: `a12y`, `crc32`, `adler32`, `base32`, `counted`,
  `ownFiles`, `omnis(host, root, files, allocators)`, `omnisToml`,
  `readOmnis`, `drift`. A file's digests go through the Host
  (`host.digest(path, algorithm)`). What no `.gitignore` leaves out: in a
  git working tree `LocalGit.files()`; outside one (an area of the
  workshop) `src/core/ignore.ts` (`treeFiles`), which reads the
  `.gitignore` files as git does.
- The procedure `sealing` (`bos.omnis({ seal })`): `bos project omnis` shows
  what drifted since the halo was sealed, and `bos project seal` writes it
  (only when something changed; `--dry-run` only says so).
- `bos workshop status`: the finding `omnis-drift` for every project whose
  sealed halo no longer matches its files.

## Open

- [`TODO`] Outside a git repository there is no `.gitignore` reading yet: the
  halo is made only for git working trees.
- [`TODO`] What else seals a model: `bos close`, the routine?
