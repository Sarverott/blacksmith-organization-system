# archiving

Moves a read-only clone out of the forge (decision Q6; glossary:
[repos-mirrors](../../../docs/glossary/repos-mirrors.md)). The forge holds what
is being worked on; a repository only kept for reading (a clone of someone
else's project, an old one of the owner's) becomes a bare mirror in
`archive/.repos-mirrors/<scope>___<project>.git`, each one a sarcophag.

Steps: `locate` (the project below `forge/`, a git repository, and its
mirror's path) → `check` (what is not committed: it would be lost with the
forge copy) → `mirror` (`git clone --mirror`, every ref; its `origin` is the
project's upstream, so it can be fetched again; a mirror that exists is
fetched from the forge copy) → `remove` (the forge copy, only when the owner
confirms, nothing is uncommitted, and the mirror holds every commit of it).

A dry run says what would be done and does nothing; without `confirm` the
forge copy stays.
