# Artefact

> DRAFT

## What it is

The common name for any element BOS manages inside the crafting areas: scope,
project, sheme, throwbox, sarcophag, scrapnote, craftset… In code, every
element is a *model*: a subclass of the core BOS class, with its own data,
actions, events, listeners and methods.

## Why it exists

One shared notion lets BOS treat everything the same way: open, create, change,
close, delete, move, remodel, upload, download. Each type then adds its own
behaviour.

## Relations

Most artefacts are a directory plus descriptor files: see
[element anatomy](element-anatomy.md).
