# Project

> DRAFT

## What it is

One concrete, independent project with its own name and a focused workflow,
set up to be a project repository.

## Why it exists

It's the basic unit of crafting: something with a clear goal that can be built,
released and archived on its own.

## Where

Inside a [scope](scope.md): `forge/<scope>/<project>`.

## How one is made

- `bos project create <scope>/<project>`: a git repository on `development`,
  seeded from `resources/project-template/` with the standard anatomy
  (README.md, LICENSE, AGENTS.md, CLAUDE.md, Taskfile.yml, src/, docs/,
  tests/, .github/, .gitignore) and `.bos/bos.json`. On a project that exists
  it only adds what is missing.
- `bos project import <source>`: a clone (`gh:owner/repo`, `owner/repo`, any
  git URL or a path) into `forge/<scope>/<name>`, the scope being the owner's
  name unless `--scope` says otherwise; `--seed` adds the missing anatomy.

## Lifecycle

Opened in the forge → released (release posts go through the *market stall*
host) → archived as a [sarcophag](sarcophag.md).

## Relations

Code that realizes a design is a project, even when it starts from a sheme
(e.g. a layout template).
