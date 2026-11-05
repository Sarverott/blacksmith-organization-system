# Views

> DRAFT. Older name: `.VIEWS` (element type `display`).

## What it is

Every way BOS presents the state of the workshop. For example, a dashboard with
information about the workshop, served through any interface:

- CLI menu or command-line invocation
- web app GUI
- web app wrapped as a mobile app (Capacitor)
- Chrome extension, optimized for Chromebooks
- Electron desktop app
- OpenAPI gateway
- MCP server, for AI agents

## Why it exists

So every presentation method is handled by one shared handler class: the
workshop state is described once and rendered by many interfaces.

## Where

[`TODO`] Views is probably more a code layer (interfaces) than a directory.
If it keeps files, *(assumed)* `.BOS/views/`.

## Relations

Replaces the removed `src/interfaces/` (cli-repl, http-api, socket-server).
Related apps: bos-desktop, bos-mobile, bos-gui, bos-vscode-extension.
