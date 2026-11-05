# Phase 0: clear the ground

Append-only: sections are added at the end and never rewritten. Each starts
with `UNIXUSAT=<ms since epoch> · commit <hash>`. The owner's words are kept
word for word.

## UNIXUSAT=1793868256456 · commit b0311e5

The owner's draft (`docs/devlog/DRAFT.md`), which started the reforge. Its
conclusions now live in VISION.md, ROADMAP.md and TODO.md; the file itself
was removed. Word for word:

````markdown
# NOTE: read this, adopt here and 



### inspire yourself by first by reading flow of work we rafining in here and found as well-defined:
- find first all get the concept
- find all of what we should know about our "Workshop" here
- find all of what we should know about our "forge" here
- inspect every way we had manage our projects here
- read all from current state below
- define conclusion from each part we will gonna read and consider
- confront the ideas, concepts and methodologies of each part we take under revision
- this code have to be rebuilded
- whole project need to be simplified and optimized with clear mechanics implementing
- rafine structure and remove unneeded stuff
- combine concept of logics with concrete code that can be handled by further adoptions
- remember that we want to rafine some things and correct some stuff that is needed to be fixed here

---

# feachers we want
- philosophy
    - each agent and user is member of contributors committee
    - docs/.agents is own space for AI, users can only read but not write
    - commits by agents should be signed as co-authored
- phases and steps that is defined by core code
    - with commitizen 
    - with github workflows
    - with husky hooks
    - with biome.js
    - with taskfile
    - versioning
        - simple project repo ver - semver versioning (later refered as `vX.Y.Z`)
        - advanced scope ver - grih versioning (later refered as `vG.R.I.H`)
        - step is semver bump of Z and grih bump of H
        - phase is semver bump of Y and grih bump of I
        - milestone is semver bump of X and grih bump of R
        - changes like going from pre-alfa to alfa, key concept changes that flip the script or stuff like that is semver bump of X and grih bump of G
    - commits on each step
- devlog dir
    - standard look based on what we came up with until now
- structures and mechanics
    - all should be coded
- development loop by branching flow we introduce
    - mermaid graph and explanations
- own workplace for agents
    - each agent and user has own space and branching (branch development is merged cummulation of for example "dev/Cleo" or "dev/Sarverott") 
    - each coding agent host cli should has container (codex is in own container working on own dev branch, claude has own container, even user has container)
    - each workmode is described as set of tasks in taskfile with listeners of file change and githooking
 

---

# current state

### important references
- note that state of work: https://github.com/Sarverott/blacksmith-organization-system/tree/reforge
- https://github.com/apokaliptium/apokaliptium.github.io
- https://github.com/Sarverott/blacksmith-organization-system
- https://github.com/Sarverott/bos-skillset
- https://github.com/Sarverott/Sarverott
- READTHEDOCS: https://blacksmith-organization-system.readthedocs.io/en/latest/
- NPM: https://www.npmjs.com/package/blacksmith-organization-system



### docs, glossaries, wiki of project and presentations
- https://github.com/Sarverott/documentation_of_blacksmith-organization-system


### subrepositories to be dependencies or submodules (can be used, renamed, abandoned - whatever is required)
- https://github.com/Sarverott/bos.models
- https://github.com/Sarverott/bos.commands
- https://github.com/Sarverott/bos.toolsets
- https://github.com/Sarverott/bos-skillset
- https://github.com/Sarverott/.craftset
- https://github.com/Sarverott/bos.actions
- https://github.com/Sarverott/bos.events
- https://github.com/Sarverott/bos.factors
- https://github.com/Sarverott/bos.interfaces
- https://github.com/Sarverott/bos.listeners
- https://github.com/Sarverott/bos.methods
- https://github.com/Sarverott/bos.controllers


### extensions, apps and integrations
- https://github.com/Sarverott/BOS_for_VScode OR https://github.com/Sarverott/bos-vscode-extension
- https://github.com/Sarverott/bos-mobile
- https://github.com/Sarverott/bos-gui
- https://github.com/Sarverott/bos-desktop
- https://github.com/Sarverott/bos-server
- https://github.com/Sarverott/hefaisto
- TODO: gh extension, firefox extension, chrome extension````

The old devlog of the legacy core (`docs/devlog.md`), read and readapted into
VISION.md (entry 1 → principles "plain mechanics, small files"; entry 2 → the
element anatomy that models declare statically); the file was removed. Word
for word:

````markdown
# ENTRY 1:
this is huge mess, i had overartistic phase about code, because of lack of reasoning in work. now it's time to list things to cutoff:
  - strange require builder in libraries.js: i remember why it was like that - for easy morphing into browser-only service system... but it's dumb implementation of this idea, i had no clear idea how to do that
  - every referencable var in module will be prioritized to be global scoped exclusively in file for reduction of too long reference chains and information noise generation by bad readability caused by text overwhelmnes in result
  - prettification of staff
  -

# entry 2:
model is autodeclaring own internals
> model directory:
 - **class.js** - declaration of model
 - ~fundation.json~ **index.json** - data structure of model
 - **README.md** - about that type
 - _**actions**_ - _DIR_ commands and available acts
 - _**listeners**_ - _DIR_ all watchers and other stuff
 - _**events**_ - _DIR_ basic behaviour
 - _**extenders**_ - _DIR_ flat extension for every new object, produced by class.js
 - _**methods**_ - _DIR_ synchronous static functions, resulting with return values

# entry 3:
````

## UNIXUSAT=1793868256485 · commit 5b57d9d

First questions asked by Cleo (BRAINSTORM.md Q1–Q5), with their *Lean:*:

- **Q1.** `developement` or `development`? *Lean:* rename to `development`,
  accept both in the loop engine as aliases.
- **Q2.** Which repository gets the name `Sarverott/blacksmith-organization-system`?
  *Lean:* the core takes it and the npm package; bos-skillset becomes
  `Sarverott/bos-skillset`.
- **Q3.** What happens to the legacy `src/`? *Lean:* tag it (`legacy/v0.6.1`),
  remove it; keep the procedure names.
- **Q4.** The `bos.*` subrepositories: submodules, npm dependencies, or folded
  into `src/`? *Lean:* fold into `src/`, split later.
- **Q5.** GRIH: where does a scope keep its version? *Lean:* `forge/<scope>/.bos/scope.json`.

The owner's orders (`docs/devlog/ORDERS.md`), word for word:

````markdown
# ORDERS: responses to open questions


# responses for the Qs

## Q1
we want development, developement is misspeling
create new branch named `development` based on `developement` 
correct all that relay on previous name, switch to right one then remove wrong one
this way logs of repo's story is not broken and our problem will be fixed

## Q2
forget `OLD-VERSIONS_blacksmith-organization-system`
we returns to `blacksmith-organization-system` as core package and `bos-skillset` as skills repository
this has to be propably fixed in npm, readthedocs and maybe other - proceede it if you're cabable of it

## Q3
you can do it as you propose in "Lean" assumption
that can be handled this way

## Q4
yes, work with core first, it can be splitted later

## Q5
yep, this fits the requirements now, try it out
````

- **Decision Q1:** `development`. Created from `developement`, references
  corrected; `developement` is removed once `development` is on GitHub.
- **Decision Q2:** the core is `Sarverott/blacksmith-organization-system` (npm
  `blacksmith-organization-system`), the skills are `Sarverott/bos-skillset`.
  On GitHub the renames were already done by the owner.
- **Decision Q3:** as the *Lean:* (tag `legacy/v0.6.1`, then removed).
- **Decision Q4:** core first, split later.
- **Decision Q5:** `<scope>/.bos/scope.json`, tried out in code.

The owner's inquiries (`docs/devlog/INQUIRIES.md`), word for word:

````markdown
# INQUIRIES: unattended approaches to be adopted

## adoption of drafting into devlog
move conclusions from draft file to newly created files
explain what is what in README.md
remove draft as archivized
read what is in old devlog file ("docs/devlog.md")
readapt it into concept
remove old devlog file ("docs/devlog.md")

## extract non-js in "src/" to codes in dir "scripts/" of repo
i spotted some python and shell scripts. move them out from src

## inspect based on "Amoorion" way of work for what should be placed in each file
search for local path

## inspect based on "gitrecon" way of work for what should be placed in each file
search for local path

## inspect based on "gitrecon" way of work for what should be placed in each file
search for local path

## reforging of BOS
we want to make it typescript module that at core basic version can be used in most of environments (later to be considered)
most important is state of usability for us is proof-of-work where code is capable of create us base of environment, can handle listening for changes, can inspect whole our workshop as coherent environment

````

