# Bridges

Bridges connect BOS with other systems: APIs, programs extended to talk to
BOS, and tools wrapped as procedures. A bridge is the only place where its
system is touched, as `src/hosts/` is the only door to the machine
(AGENTS.md rule 7): a bridge in `src/bridges/` runs the system's own command
line through `Host.run`, so tests can script it.

## The map

`src/bridges/` has a folder per kind of outside system (the owner's map,
phase 2). Every bridge extends `Bridge` (`base.ts`): the system's command,
run in one directory through `Host.run`. `index.ts` exports them all.

```
src/bridges/
├── base.ts                Bridge: host, cwd, command(bin, args)
├── git-integration/       Git → LocalGit (a clone here)
│                              → RemoteGit (the source or a mirror) → GitHub, Gitea, GitLab, Bitbucket, SourceHut
├── devops-integration/    workflows, actions, runners, pipelines: a core one, then per host
├── docs-publishers/       GitHub Pages, GitHub wiki, Read the Docs, GitBook, an Obsidian vault
├── apps-extensions/       browser extensions (webext), Python modules (Blender, GIMP, OBS), VS Code, Obsidian
├── dedicated-implements/  app backends and frontends, a web GUI, an OpenAPI server, Electron, Capacitor
├── project-profiles/      how a Python package, a desktop app, an Android app is built and released
└── scoping-families/      the kinds of a scope's owner: one person, an organization, groups, associations
```

Only `git-integration/` has code; the rest are placeholders of what comes.
How a bridge is applied to a model: BRAINSTORM Q14.

| Bridge | For | Phase |
| ------ | --- | ----- |
| git (`LocalGit`, `src/bridges/git-integration/local-git.ts`) | tags of released versions (`bos flow bump`); later status, add, commit, branches, bare mirrors (`git clone --mirror`) | 2: tags coded; mirrors (Q6), 3 (autocommit of scrapnotes, Q8) |
| GitHub (`src/bridges/git-integration/github.ts`, through `gh`) | pull requests of the loop: compare, list, create, view, merge (`bos flow next-pr`, `automerge`) | 2: coded |
| Gitea, GitLab, Bitbucket, SourceHut (`git-integration/`) | mirrors of the source (the mirrors workflow); a self-hosted Gitea for private scope repositories | 2: their place in the hierarchy; [`TODO`] |
| docker | a container per agent host CLI and one for the owner | 3 |
| setternet | the network of the owner's hosts and their roles | [`TODO`] |
| npm | publishing a project (the market stall host role) | [`TODO`] |

## Ideas waiting for a bridge

From the owner's early notes (archived in the [changelog](../changelog/phase-1.md)):

- Integrators as extensions of programs, clients of the setternet with API
  presets: Thunderbird, Chrome, Codium, GIMP, OBS; git through gitpython,
  octokit, husky.
- Integrators as procedural wrappers of tools and command macros: adb (test
  suites, dev tooling), Flipper Zero (CLI and dev tools), GitHub workflows (a
  generator of procedures), docker (manager, generator), Arduino.
- GIMP: bind its history to version control: every change saved and
  committed with the action's name, on a branch per session; undo becomes a
  revert; an export of the changes frame by frame.
- Publishing a release goes with posts on social media (the market stall).
- Projects can commit themselves on every save (now decision Q8, scrapnotes
  first).
- The craftbook may be correlated with Shakespeare [`TODO`: what Shakespeare is here].
