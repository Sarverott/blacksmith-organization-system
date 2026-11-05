# Scrapnote

> DRAFT

## What it is

A note that isn't assigned yet: it should be tagged and related to something,
but there isn't always time to do that by hand.

All notes start as scrapnotes, and so do all drafts. A note stops being a
scrapnote when it becomes a document: documentation, a guide, instructions or
another serious publication. Some notes stay scrapnotes for good: a changelog
is a scrapnote, and so is a release note.

## Why it exists

Both the most useless and the most important notes tend to be written
carelessly, mid-thought, so telling them apart is tricky. Treating every note
as a scrapnote until it is classified keeps them all, and marks them for
sorting.

## Where

In the [craftbook](craftbook.md):

- `craftbook/scrapnotes/*.{md,txt,log,rst}`
- `craftbook/scrapnotes/*/*.{md,txt,log,rst}`
- `craftbook/*.{md,txt,log,rst}`, `craftbook/*/*.{md,txt,log,rst}`
- a project's own notes: `craftbook/<scope>___<project>/scrapnotes/`, a git
  repository (an Obsidian vault) committing itself on every save, seen from
  the project as `docs/.scrapnotes` (a link, ignored by the project's git).
  Decision Q8; coded in phase 3.

## Lifecycle

written → tagged and categorized → promoted to a document, or kept as a scrapnote

Example: the owner's Google Keep note (PL), archived word for word in
[changelog phase 1](../changelog/phase-1.md).

## Open questions

- Tagging and categorization format [`TODO`]
