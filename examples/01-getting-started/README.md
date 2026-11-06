# 01: getting started

The BOS core as a library, step by step: the host, the workshop, a dry run
of the bootstrap, the areas, an inspection, the project's authors, a case
judged by the almanac, and a situation recalled. It only reads.

```sh
# in this checkout: the example uses the core from ../.. (built into dist/)
npm --prefix ../.. run build
npm install
WORKSHOP_ROOT=/run/media/<you>/<partition>/ npm start
```

Outside this repository, install the published package instead. npm's
`latest` is still the legacy 0.4.2 (decision Q7), so ask for `next`:

```sh
npm install blacksmith-organization-system@next
```

## What the draft snippets met, and why

`../00-draft-snippets/` tried the library by hand. What it found:

| In the draft | What happens | Here |
| ------------ | ------------ | ---- |
| `new BOS()` | no host: it now throws and says to give one | `new BOS(new NodeHost(), …)` |
| `{ workshop: "/run/media/…/setternet-A62/" }` | it took the partition root for the workshop and bootstrapped a second one beside `__WORKSHOP` | fixed: a path not named `__WORKSHOP` holds one, like `$WORKSHOP_ROOT` |
| `console.log(bos.bootstrap())` | a Promise: every method is async | `await bos.bootstrap({ dryRun: true })` |
| `bos.authors()` | it writes `.github/AUTHORS` of the git repository around the current directory | `{ dryRun: true }` |
| `delete bos.workshop` | `true`, but nothing changes: `workshop` is a getter, kept once found | `String(bos)`, `bos.workshop.path` |
| `workshop.areas` | `undefined` (only `areaNames` existed) | `bos.workshop.areas` now gives the five areas |
| `npm i blacksmith-organization-system` | 0.4.2, the legacy release | `@next` |
