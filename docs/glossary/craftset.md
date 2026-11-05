# Craftset

> DRAFT

## What it is

A reusable kit for a kind of work. It combines notes, interactive notebooks
(e.g. Jupyter with Python) and short one-off scripts that turn out to be handy
as procedures in later revisions and updates.

Files:

- mandatory: `.omnis.toml`, `metadata.json`, `manifest.json`, `Taskfile.yaml` (see [element anatomy](element-anatomy.md))
- optional: a VS Code workspace file
- optional: a shell launcher and bootstrap script with a preconfigured layout
  of displays, program windows and multiple desktops with predefined roles

## Why it exists

So procedures worked out once (a script, a notebook, a window setup) can be
found and run again later, instead of being rediscovered.

## Where

In the [craftbook](craftbook.md). Repositories may also carry a `.craftset/`
directory (seen in BOS component repos).

## Relations

Can refer to tools from the [devarmory](devarmory.md). *(assumed)*
