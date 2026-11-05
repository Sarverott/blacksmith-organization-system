# Phase 1: proof of work

Append-only: sections are added at the end and never rewritten. Each starts
with `UNIXUSAT=<ms since epoch> · commit <hash>`. The owner's words are kept
word for word.

## UNIXUSAT=1793874046485 · commit 605a0a8

Questions asked by Cleo after the first inspection of the home workshop
(BRAINSTORM.md Q6–Q9), as they stood:

### Q6. The forge holds 325 projects checked out on `master` or `main`

`bos workshop status` on this host: 15 scopes, 334 projects; 325 of them are
on `master`/`main`, many of them clones of others' or the owner's public
repositories (e.g. `forge/sarverott/github-repos/*`). The forge's glossary
says what is in the forge is being worked on, and work happens on
`development`. So either these clones are not forge material, or the rule is
too strict for them.

*Lean:* mirrors and read-only clones belong in `archive/` (glossary: archive
holds mirrors); the warning stays. A scope can mark a folder as mirrors in its
`.bos/scope.json` (`"mirrors": ["github-repos"]`) until they are moved.

### Q7. Which version does the reforged core start from?

`package.json` says `0.6.1` (legacy). npm has `blacksmith-organization-system`
`0.4.2` (latest) and `1.0.0-dev.3` (dev); bos-skillset published `1.0.1` under
the same name on GitHub Packages. The reforge flips the script (CommonJS →
TypeScript, new mechanics).

*Lean:* a flip: `1.0.0` once phase 1 is complete, published to npm as `next`
until phase 2; bos-skillset publishes under `bos-skillset` from then on.

### Q8. Where do scrapnotes of a project go?

gitrecon keeps `docs/devlog/scrapnote-<UNIXUSAT>.md`; the workshop rules put
the owner's loose notes in `craftbook/scrapnotes/`; this repo has
`docs/scrapnote-example.md` and an empty `docs/.scrapnotes/`.

*Lean:* notes of a working round on this project: `docs/devlog/scrapnote-<UNIXUSAT>.md`
(`task devlog:scrapnote`); notes not tied to one project: `craftbook/scrapnotes/`.
`docs/scrapnote-example.md` moves into the devlog.

### Q9. The other local branches of this repo

`drafting`, `moderation`, `publishing`, `dev/reforge`, `dev/submodule-gits`
and the old `revision`, `testing`, `releasing` point at commits of the legacy
core. `dev/reforge` holds one commit not on GitHub.

*Lean:* keep `revision`, `testing`, `releasing` and move them to `master` when
the loop starts (phase 2); tag `dev/reforge` as `legacy/reforge` and delete
the rest locally.

The owner's orders (`docs/devlog/ORDERS.md`), word for word:

````markdown
# ORDERS: answers to the open questions

The owner's answers to `Q<n>` of [BRAINSTORM.md](BRAINSTORM.md), written below
the line. Agents move them word for word into the changelog and leave this
file with its header only.

---

## Q6

place bare clones of repos into `archive/.repos-mirrors/*` - this looks as right approach
every mirror is __sarcophag__ 

## Q7
do as you wrote in "Lean:" - a flip: `1.0.0` once phase 1 is complete

## Q8
for each project it can be placed in "docs/.scrapnotes/" as ignored but linked to be subrepository carried by obsidian notebooks. so "docs/.scrapnotes/" links related dir in "craftbook/{scope}___{project}/scrapnotes/" as a git repository autocommiting on any file is saved - can we do it like that?

## Q9
your "Lean" sounds good - go ahead
````

- **Decision Q6:** mirrors and read-only clones leave the forge as bare clones
  in `archive/.repos-mirrors/`, one per repository; each is a sarcophag (glossary:
  one bare repository per sarcophag; encryption comes later). Coded as a
  procedure (`archiving`, dry run first; the working copy in the forge is
  removed only when the owner confirms), tried on the development workshop;
  the home workshop's 325 clones move only on the owner's order. Name of a
  mirror: `<scope>___<project>.git`, as Q8 *(assumed)*. Until then the
  "work on master" warning stays.
- **Decision Q7:** as the *Lean:*: a flip to `1.0.0` once phase 1 is complete.
  Phase 1 is complete, so `package.json` is `1.0.0`; the tag `v1.0.0` and
  `npm publish --tag next` wait for the owner (AGENTS.md rule 10).
- **Decision Q8:** yes, it can be done like that. Per project:
  `craftbook/<scope>___<project>/scrapnotes/` is a git repository (an Obsidian
  vault); the project's `docs/.scrapnotes` is a symbolic link to it, ignored by
  the project's git and kept out of the MkDocs site (`.*` is excluded); a
  workmode task watches the vault and commits every saved file after a quiet
  moment. Open: a nested scope `a/b` becomes `a___b___<project>` *(assumed)*;
  Obsidian's own churn (`.obsidian/workspace*.json`) is ignored, not committed;
  git is reached through a bridge of its own (AGENTS.md rule 7). Phase 3
  (workmodes); the *Lean:* (`docs/devlog/scrapnote-<UNIXUSAT>.md`) is dropped.
- **Decision Q9:** as the *Lean:*: `dev/reforge` tagged `legacy/reforge`
  (local; its commit `4d71a58` is also in `development`); `drafting`,
  `moderation`, `publishing`, `dev/submodule-gits` and `dev/reforge` deleted
  locally (all their commits are in tags or on GitHub); `revision`, `testing`,
  `releasing` stay and move to `master` when the loop starts (phase 2).

## UNIXUSAT=1793876512737 · commit 2517177

The owner moved development and its demonstrations to a workshop of their own
(`.env`: `WORKSHOP_ROOT` on the partition `setternet-A62`), so the home
workshop is not exposed every time BOS is worked on. Then, in chat: push
`development`, try to publish; the owner's edits are committed on
`dev/Sarverott`, one commit per change, with messages written by the agent
(its assumptions, its view, how it understands what is where and why), and
merged into `development`; fix the remotes still wrong; documentation is
needed; phase 2 begins.

The owner's inquiries (`docs/devlog/INQUIRIES.md`), word for word:

````markdown
# INQUIRIES: work asked for in the owner's own words

Written below the line. Agents turn each inquiry into the plan (VISION,
ROADMAP, TODO), move it word for word into the changelog, and leave this file
with its header only.

---



## files to be reforged 
> STEPS: read and analize content, update content, upgrade content, create new file in more proper place, remove old file
- docs/about-bridges.md
- docs/about-interfaces.md
- docs/about-models.md
- docs/scrapnote-example.md

## corrections in these files 
- README.md 
    - general purpose, showed on npm, docker and else places like that
- docs/README.md
    - documentation index of readthedocs and else
- .github/README.md
    - github repository readme notice
- .github/CODE_OF_CONDUCT.md
- .github/CONTRIBUTING.md
````

Plan: the `about-*` pages become `docs/architecture/` (models, interfaces,
bridges, as the reforged core has them); `scrapnote-example.md` is archived
here word for word, its ideas already live in the glossary and the rest go to
the architecture pages; each README gets one audience (README.md: npm and
everywhere; docs/README.md: the documentation's index; .github/README.md:
GitHub); CONTRIBUTING.md and CODE_OF_CONDUCT.md written for the contributors
committee.

## UNIXUSAT=1793876588175 · commit 203be89

`docs/scrapnote-example.md`, the owner's early scrapnote (from Google Keep, in
Polish), is removed from the docs. Where its ideas live now: host roles in
[glossary/host-role](../glossary/host-role.md); the workshop's folders and the
models (project, sheme, throwbox, superproject → scope, forge, scrapbook →
craftbook, archive, workshop) in the [glossary](../glossary/README.md);
integrators, the GIMP history and posts on release in
[architecture/bridges](../architecture/bridges.md); autocommit on save in
decision Q8; "taskfile, husky and a standard command set" is the toolchain of
phase 0. Word for word:

````markdown
# BOS - scrapnote from google keep

> PL:

### pomysły i noty

- projekty się mogą autocommitować co save

- lista funkcji w złotym zeszycie

- schemat działania w kalendarzu 2019

- GIMP: zbindować historię z svn; co zmianę automatycznie ctrl+s i commit z notką "nazwa akcji" w branchu danej sesji; przy otwarciu programu nowy branch powstaje; cofanie robi reverse do nadpisania; autoskrypt funkcji eksportu klatka po klatce zmian

- publikacja wydania programu wiąże się z postami w socialmediach

- taskfile, husky i standardowy zestaw komend

---

### rodzaje hostów - "WORKSHOP" jest wszędzie, 

- POSTERUNEK MISTRZA: przestrzeń robocza z możliwością zarządzania zdalnego wszystkimi hostami systemu bos w setternecie

- PUNKT KUŹNICZY: przestrzeń robocza do pracy deweloperskiej, kompilacji i innych podobnych prac

- SALA PRÓB: przestrzeń robocza dla wirtualnych maszyn, testowania

- KRAM TARGOWY: tylko publikacyjna przestrzeń robocza, do automatycznych postów na socialmediach i innych akcji tego typu

- MONOLIT KANONU: tylko zdalne archiwum, zapis nadrzędny archiwalny wszystkich projektów, wymaga ciągłości kompletnej, jest jeden taki host w setternecie

- KATAKUMB POBOCZNY: archiwum, dedykowane do konkretnej funkcji, typu publikator, autotester, co-work etc. >> ollama, deploymenty 

---

### foldery w WORKSHOP 
- .BOS - przechowywanie ustawień, klucze, customizacja
- ~~.SETTERNET - determinuje przestrzeń w sieci snet~~ [`NOTE: przeniesiono do "__WORKSHOP/.BOS/setup/setternet/"`]
- FORGE - przestrzeń aktywnej pracy
- ARCHIVE - repozytoria w stanie spoczynku
- DEVARMORY - tu składowane są zestawy narzędzi i aplikacyjne komponenty
- CRAFTBOOKS - drafty, noty i pozostałe podobne rzeczy


### podział modeli

- PROJECT: dostosowane do bycia repozytorium projektowym

- SHEME: oporządzanie dróg przetwarzania delegowań (hf uploaders, publish routines, deploy automation i inne takie)

- THROWBOX: zautomatyzowane zbieranie zbiorów plików różnych, powiązanych z konkretnym zbiorem projektowym

- SUPERPROJECT: kolekcja tematycznych projektów, shematów i wspólnego dla nich throwboxa, ze wspólnymi

- FORGE: przestrzeń robocza, odpowiednik biórka, tylko otwarte projekty w trakcie aktywnego opracowywania, zawiera superprojekty i okresowy throwbox, definiuje brancha roboczego

- SCRAPBOOK: zsynchronizowany notes, sychronizuje notatki z projektów, schematów i throwboxów

- ARCHIVE: zapis skompresowanych superprojektów w formie pojedynczych składowych, zawiera pełen zapis historii wstecz w postaci zapisu zmian svn

- WORKSHOP: instancja bos zamknięta w jednym folderze, definiuje rolę w systemie wielohostowym, każdy host ma swój WORKSHOP

---

### delegowanie uniwersalnych części do odseparowanych podmodeli
- setternet: bramki łączności
- integratory jako rozszerzenia programów: jako klienty setternet z presetami API
- -- 
- -- thundrebird
- -- chrome
- -- codium 
- -- 
- -- git gitpython octokit husky
- -- GIMP
- -- obs
- -- 
- -- 
- -- 
- integratory jako proceduralne wrappery narzędzi i mosty makr poleceniowych
- -- adb - testsuit, devtooling etc.
- -- flipper zero - cli & devtools
- -- github workflowsy - generator procedur
- -- docker - manager, generator etc.
- -- Arduino - 
- SCRAPBOOK może być skorelowany z Shakespeare'm
````

## UNIXUSAT=1793876659156 · commit 615a0fc

`docs/README.md` becomes the index of the documentation. Its legacy text (the
branch concept, the commission procedure, versions by merge layers, GRIH, the
directory tree and the kinds of artefacts) is kept here word for word; the
title and the banner stay on the page. Its ideas now live in
[glossary/craft-loop](../glossary/craft-loop.md), [glossary/grih](../glossary/grih.md),
[glossary/workshop](../glossary/workshop.md) and the other glossary pages.

`````markdown
# Blacksmith Organization System


```
************************************
  Project in R tier scope "ANUBIS"
     ______    _____    _____
     | ___ \  |  _  |  /  ___|
     | |_/ /  | | | |  \ `--.
     | ___ \  | | | |   `--. \
     | |_/ /  \ \_/ /  /\__/ /
     \____(_)  \___(_) \____(_)

    By Sett Sarverott @ 2019-2024
************************************
```


---

# DEVNOTE: currently big refactor is comming. Based on ideas while writting https://github.com/The-Apokryf/.github/issues/1 

### main repo branches - concept of contribution flow

- master : based on testing
   - flag? #release_{{v0.0.0.0}}
- gh-pages : generated for web hosting, based on master
   - flag? #master_{{hash}}
- canonical : keeped as integral core version developement road anchor, based on filtered master, appears on milestones reaching
   - flag? #master_{{hash}}
- releasing : generated as PDF and functional environment, based on master
   - tag #release_{{v0.0.0.0}}
   - flag? #master_{{hash}}
- testing : awaiting approval, based on development
   - flag? #test_{{hash}} : unit testing
- developement : addons sink, maintain space, based on master 
   - flag? #dev_{{feacher-name}} 

### very fine and lawfull commision procedure... I think

- personal fork required
- adding commits to repo
- pull request sending into separed subdev
   - if from Apokryf approved user - automatical merge into dev mainflow
- when awaits approvals moved into testing, automated issue generated 
- approval by issue closed, needs signing
- automatic into master merge, 
- when master branch updated monit to **Canon Keeper** readiness for automated procedures performing related with releasing, publishing, archieving and reroll of sync to dev
- after confirmation by human EXECUTE

### versioning depended on merging chain bechaviour
development stages are depended on commit placement in branch-related layers of maintaining sourceflow tree:
- **ALPHA** : commit in developement layer
- **BETA** : commit in testing layer
- **Release candidate** : commit in master layer, before 
- **Release** : after confirmation by **Canon Keeper**, confirmed by placing in canon root (canonical)

### idea of versioning methodology based on branching merges - `{G}.{R}.{I}.{H}` 
- **G**eneration - multiple planned developement-testing recurent loops in maintaining sourceflow with new ideas, targets and milestones, rebuilding depended on reformation of concept, huge improvements in idea
- **R**construction - multiple situational need of developement-testing recurent loops in maintaining sourceflow with changes of base ideas, updates of targets, rebuilding depended on compatibility and integrity, big remodeling of structural scope or bechaviour, optimalization of code
- **I**ntegration - standard developement-testing looping in maintaining sourceflow for inclusion of stacked hotfixes, boundles of singular punctual changes, clear changelog entry, summary raports and mutualization of cooperative work effects
- **H**ooking - simplified update injection, focused on fast hotfixes, easy problems solving, small issues handling and unit testing, all hooked in the end in maintaining sourceflow small commits included in branch merging chain

---

# integration of **Blacksmith Organization System** as environmental tooling base

### directory tree of BOS environment - basic elements
- WORKSHOP : placed in user's homedir
   - archive : integrity base, non-releasable repos, buffering mirrors between craftspace and production CVS server
       - sarcophag : single encrypted container dedicated for one bare repo that it contains
   - scrapbook : database of random notes, notebooks, docs writting, special care text data with higher security degree needed etc.
   - forge : center of craftspace, contain opened topics, as instances of Artefact classed elements. If something is in FORGE that indicates these things are currently focused, in devmode state and are flagged with user's mid-syncing stage signature. On save commit is produced, signing routines stuff are performed and automation is lounched. Forge contains __collection of Artefacts__
   - setup : contain configuration, workshop history and other dev data

### types of Artefacts:
- **Scopes** : _(previously superprojects)_ recurent Artefact that have own __collection of Artefacts__, each Artefact is as submodule, group of related parts, instances of Artefacts family with shared workspace automation, configs and secret setups, related with publication and other stuff
- **Shemes** : defined by category of shematic type stuff, graphical sourcefiles, audio sourcefiles, else data sourcefiles, notes and notebooks, playgrounds livecode docs and sandbox in vm or container, partial ttystories related with workaround something, testarea
- **Project** : concrete independent project with name and focusfull workflow
- **Throwbox** : every __collection of Artefacts__ have one of this as default place for loose files, at closing of related with  __collection of Artefacts__ object. Related with closing procedure automates stuff like sweeping, auto-describing of captured things and packing of random sets. Abandoned and uncategorized stuff is prepared to be keeped as anonymouse unlabeled sarcophag hooked to __collection of Artefacts__ for final sorting, possible reuse or future decision of deleting.

# if it is good thinking then it will be automated
# REQUESTING FOR FEEDBACK AND BRAINSTORM __**ASAP**__!
`````
