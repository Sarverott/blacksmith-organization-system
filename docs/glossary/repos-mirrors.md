# Repos mirrors

> `archive/.repos-mirrors/`: the read-only repositories of the workshop, kept
> as bare mirrors out of the forge (decision Q6).

## What it is

The forge holds what is being worked on. A repository that is only kept for
reading - a clone of someone else's project, an old one of the owner's that
nobody works on - does not belong there: it is checked out on `master` or
`main`, and `bos workshop status` warns about it (`work-on-master`). It goes to
the archive as a **bare mirror**: every branch, tag and ref of the clone, no
working tree.

```
archive/.repos-mirrors/
├── sarverott___github-repos___gitrecon.git
└── <scope>___<project>.git        a nested scope a/b: a___b___<project>.git
```

Every mirror is a [sarcophag](sarcophag.md): one bare repository; encryption
comes later. Its `origin` is the project's upstream, so it can be fetched
again from where it came from.

Not the same as a [mirror](mirror.md) of a project on another host: that one
is kept identical by the loop; this one is a copy at rest on this machine.

## How it gets there

`bos archive mirror <forge/scope/project>` (the procedure `archiving`):

1. the clone is checked: what is not committed would be lost with it;
2. `git clone --mirror` into `archive/.repos-mirrors/` (a mirror that exists is
   fetched again from the forge copy);
3. with `--confirm` only, the forge copy is removed, and only when nothing is
   uncommitted and the mirror holds every commit of it.

`--dry-run` says what would be done. `bos workshop status` names a forge copy
whose mirror is in the archive already (`mirrored-in-forge`).

## Open

- [`TODO`] Encrypting each mirror as a sarcophag.
- [`TODO`] Fetching the mirrors from their upstream now and then.
- [`TODO`] Moving the home workshop's read-only clones (on the owner's order).
