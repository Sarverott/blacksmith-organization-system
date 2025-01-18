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
