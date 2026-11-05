


## UNIXUSAT=1793893549104 · commit b567749

The owner merged PR #5, the first opened by the revision workflow: `v1.2.0`
released, on npm `next` and, for the first time, on GitHub Packages as
`@sarverott/blacksmith-organization-system`; the images were skipped (a
pre-release). Then Q12 answered in ORDERS.md and three inquiries; in chat:
"ready! proceede now".

### Q12. What is a "stable LTS full release"?

````text
## Q12
yes in this context you're right:
- a) now (the workflows do it), 
- b) once two majors live side by side
but also check inquiries and threat all naming as draft to be rafined - choice i leave to you
````

- **Decision:** a) now: every full release (not a pre-release) is stable
  and gets the container images; b) later: a marked LTS line (e.g.
  `versioning.lts`) once two majors live side by side. The names in the
  inquiries are drafts and the agent's choice: `latest` and `nightly` kept
  as the owner wrote them, `stable` left for the full loop.

### Inquiries

````text
## more to be printed about package among readme files

- https://bundlephobia.com/package/blacksmith-organization-system
- https://socket.dev/npm/package/blacksmith-organization-system
- https://snyk.io/advisor/npm-package/blacksmith-organization-system
- https://npmgraph.js.org/?q=blacksmith-organization-system
- feeding virustotal with all of release files: https://www.virustotal.com/


## release tag to be created and updated on each 
- latest release that was published:s https://github.com/Sarverott/blacksmith-organization-system/releases/tag/latest
- dev early revision pre-releasing: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/nightly
- that passes all tests from deployment and depending projects that also is placed in "releasing" branch [later on to be implemented]: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/stable

## every commit in dev branches bumps hotfix
it should at local level bump Z number before commit of semver (vX.Y.Z) so every commit has now own version. these can be placed in husky hooks but remember to invoke disabling var for husky while bumping version (increment command like `npm version` makes commit so if we place in pre-commit version shift it ends up with infinite loop of DDoS)
````

- **Decision (package reports):** a third badge row in every README:
  bundlephobia, socket.dev, Snyk advisor, npmgraph (each its report page),
  VirusTotal (the `latest` release, whose notes link the reports) and
  `nightly`. Static badges: the dynamic ones read npm's `latest` tag, still
  the legacy `0.4.2` while the core is on `next` (Q7). Every file of a
  versioned release (the package's `.tgz`, now attached, and the source
  archives) goes to VirusTotal; the release notes get a "VirusTotal" section.
  It needs `VIRUSTOTAL_API_KEY` in `publish-env` (the owner adds it; until
  then the step says so and scans nothing).
- **Decision (release tags):** tags that move, each with a GitHub release
  following it, never GitHub's "Latest": `nightly` (every push to
  `revision`, a pre-release with the `.tgz`, not on npm), `latest` (every
  release, with its `.tgz`), `stable` [TODO] (the `releasing` station, once
  the full loop runs). Script `rolling-release.sh`.
- **Decision (a patch per commit):** `versioning.commits` in
  `.github/bos.json` (default `dev/*`, `patch`): the pre-commit hook runs
  `bos flow bump-commit` with `HUSKY=0` and stages `package.json` and its
  lock into the commit, so nothing commits from inside the hook and nothing
  loops. Two consequences, solved in code: (1) two dev branches always meet
  with different versions, so `.gitattributes` gives both files the merge
  driver `bos flow merge-version` (procedure `reconciling`: the higher
  version on every side, then `git merge-file`), registered by the hook
  (`task hooks:merge-driver`) and by the workflows' merges; (2) a version
  with commit patches is never tagged itself, so a station's bump now asks
  whether the line it leaves is released: a minor on `revision` needs any
  `v<X.Y>.*` (`1.2.7` → `1.3.0`), a patch on `master` needs that very
  version (a hotfix) *(assumed: the rule that keeps the routine as it was)*.

## UNIXUSAT=1793912105702 · commit 07b74ed

The owner's batch: devDependencies (a toolset for later), a README section of
the source and its mirrors, an inquiry about mirrors, and review notes written
into the code itself. Taken into `dev/Sarverott` one commit each.

### Inquiries

````text
## diversing states of decentralized codes with existing sources and public mirrors of repository
- source repo on github.com: https://github.com/Sarverott/blacksmith-organization-system
    - changes should be propagated 
    - listing of mirrors with badges like that: `github.com source: 200 OK` with linking repo
    - badge of mirror like that: `gitea.com mirror: 200 OK` or `gitea.com mirror: 404 NOT_FOUND` if missing or `gitea.com mirror: 403 FORBIDDEN` if errors updates or other http codes with linking repo
- mirror on gitea.com: https://gitea.com/Sarverott/blacksmith-organization-system
    - automation workflow/action/pipeline
    - above presented - badge of mirror
- mirror on gitlab.com: https://gitlab.com/Sarverott/blacksmith-organization-system
    - automation workflow/action/pipeline
    - same similar as above - badge of mirror
- mirror on bitbucket.org: https://bitbucket.org/apokryf/blacksmith-organization-system/
    - automation workflow/action/pipeline
    - same similar as above - badge of mirror
- mirror on sr.ht: https://git.sr.ht/~sarverott/blacksmith-organization-system
    - automation workflow/action/pipeline (if possible in sourcehut)
    - same similar as above - badge of mirror
````

- **Decision (mirrors):** `.github/bos.json` lists them (`mirrors.source`,
  `mirrors.to`); `mirrors-propagate-and-status-badges.yml` pushes every
  branch and tag to each (`--prune`: deletions too) on every push, after each
  loop run, daily and by hand. Badges as asked: shields.io endpoint badges read
  from the branch `badges` (one force-pushed commit): `github.com source:
  200 OK`, `<host> mirror: <HTTP status of its page>`; `403 FORBIDDEN` when
  the update failed or its secret is missing *(assumed: "if errors updates")*.
  A pipeline on each mirror runs the checks on `master` and `development`:
  Gitea Actions (`.gitea/workflows/`, so Gitea ignores GitHub's), GitLab CI,
  Bitbucket Pipelines, builds.sr.ht (possible, with a paid account). The
  owner adds four secrets to `publish-env`; until then every mirror is 403.

### Review notes in the code

The notes as the owner wrote them, file by file (the code lines they stood on
are left out):

````text
src/cli.ts
// NOTE: make that version info reading be adopted to be reusable and more optimized - CHECKOUT_ENV uses same trick with path handling and both should be implemented instead as function in src/core/paths.ts
/*
helpers.jsonfile = {
  constructor(pathname){
    this.filepath=pathname // should be internal protected, if i remember right it was something with `_` or `$`
  }
  // NOTE: handle of `this.data` if can be handled with this or similar handling then let's implement it https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  read(){
    // reads content of json file to this object as parsed
    // uses this.load to write with accesible this.data proxy the variable hidden as _data or something like that
    return this
  }
  get load(){
    // just returns this: JSON.parse(readFileSync( this.filepath , "utf8"))
  }
  set save(data){
    writeFileSync( this.filepath , JSON.parse(data) , "utf8")
  }
  write(){

  }
}
*/
// NOTE: as i see here this can be delegated to helpers
// NOTE: above way is the dirty ways - find out more elegant approach
// NOTE: this code is obfuscated as hell!!!!!!! it cannot remain like that
// NOTE: what about REPL and readline inputs handling? this only handles command invoking as i assume

src/core/paths.ts
// NOTE: if we have path-related handler functions then why we still uses like in "../cli.ts" messy parsing
/*
const CHECKOUT_ENV = new URL("../.env", import.meta.url);  // things like that can be and should be resolved here
*/

src/core/context.ts
// NOTE: not here but contexts are related with these:
/*
import { createContext, runInContext } from 'node:vm';
import vfs from 'node:vfs';

import { WASI } from 'node:wasi';
import process from 'node:process';
import { spawn } from 'node:child_process';
 import cluster from 'node:cluster';
 */
// NOTE: this all can be used now

src/core/element.ts
// NOTE: hmmm... why not make it listen? make Element extend event emitter to allow us define listeners with for example:
/*
// DRAFT OF IDEA EXAMPLE
const testNote = new BOS.Scrapnote(...)
testNote.on("test", ()=>{})
testNote.emmit("test")
*/
// NOTE: all that uses this is actualy placed in src/models as i see... or at least most of uses is there

src/hosts/watch-tree.ts
// NOTE: watchers should watch based on models managed elements according to each object's specific needs

src/index.ts
// NOTE: this code become hard for been readed

src/main.ts
import * as Models from "./models/_index.ts"; // cummulated namespacing - make it this way if possible
import * as Procedures from "./procedures/_index.ts"; // cummulated namespacing - make it this way if possible
export class BOS { // NOTE: ah! here it is! that was harder than i suspect to find it

src/models/_index.ts
// NOTE: if it is only this file here then rename "_index.ts" to just "index.ts" - this looks better, previously method with "_" helps to mark important files for me to find it

src/models/craftbook/class.ts
import { Element } from "../../core/element.ts"; // instead of that grab import of BOS
// then BOS.Element should be one of getters that exports the models class
export class Scrapnotes extends Element { // export class Scrapnotes extends BOS.Element {
// example of construction object looks like that: `new BOS.Scrapnotes(...args)`
export class Craftbook extends Element { // export class Craftbook extends BOS.Element {
  static children = [Scrapnotes]; // static children = [BOS.Scrapnotes];
// example of construction object looks like that: `new BOS.Craftbook(...args)`
// NOTE: if not like that we can use other ways to write same stuff but more pretty

src/models/devlog/class.ts
export type Phase = { // NOTE: source code in more lines for better readability
  number: number; // NOTE: we want to adapt biome to format code like that
  (… the same on every field …)
  complete: boolean // NOTE: update biome config

src/models/project/anatomy.ts
// NOTE: it looks fine but we need to unify way we declare things like that

src/views/event.ts
function timerStop(unixusat: number): string{ … }
function whereHook(event: WorkshopEvent): string{ … }
  const time = … // WHY? at least delegate it to separed handler
  const where = … // and... what it suppose to be? and again: WHY?
  // NOTE: explain me this one please

src/views/flow.ts
// NOTE: huh... this one also should be reformed

src/views/help.ts
// NOTE: is there way to wrap command pipeline management into more compact coding and less messy?

src/views/project.ts
// NOTE: looks like something from models - at least there it should be

src/views/status.ts
// NOTE: here also readability sucks but I know that it works so we want just to improove style here
````

Also: `src/models/devarmory/descriptors/shema.manifest.json` and
`scripts/devtools/Taskfile.yml`, both empty.

- **Decision (biome, more lines):** `lineWidth` 100, `expand: "auto"` (an
  object written expanded stays so), `useBlockStatements` (every `if` with
  braces, its body on its own line). `expand: "always"` was tried and
  dropped: it puts every argument of every call on its own line.
- **Decision (BOS easy to find):** `src/main.ts` → `src/bos.ts`. Models and
  procedures imported as namespaces (`Models.`, `Procedures.`). Every model
  is a static member: `new BOS.Craftbook(host, path)`. The models keep
  extending `Element` from `src/core`: `bos.ts` imports them, so a model
  cannot extend `BOS.Element` while `bos.ts` loads (an import cycle). That
  is the "other way" the note allowed.
- **Decision (index files):** `index.ts` where it stands alone in its
  directory (`models/`, `procedures/`). `_index.ts` stays among sibling
  files, where the `_` sorts it first.
- **Decision (one door for paths and JSON):** `paths.packagePath()` resolves
  the package's own files (`package.json`, `.env`).
  `JsonFile<T>(host, path)` keeps the path and the data private (`#data`):
  `.data` is read on first use and changed in place, `read()` reads the
  file again, `save()` writes it. A getter does what the draft asked of a
  Proxy, so no Proxy is needed. It goes through the Host, like every file.
- **Decision (cli.ts):** the output is three named, commented cases (a
  streaming tool, `--json`, text for people). The behaviour is the same.
  A REPL is a feature: TODO.
- **Decision (events):** `core/emitter.ts` (on, once, off, emit; no
  `node:events`, so the core stays on the Host). `Element` extends it, and
  `ensure()` emits `created` for each path it creates.
- **Decision (views):** each line is built by named parts, with an example of
  the output in a comment. `event.ts` uses the owner's `timerStop` and
  `whereHook` and explains its line. `project.ts` → `crediting.ts`, with
  `authorsText` renamed `creditText`: it is the text of what crediting did
  (a view), and it shared its name with the model's `authorsText` (the text
  of the AUTHORS file). The output is byte for byte the same.
- **Decision (ideas, later):**
  - contexts on `node:vm`, WASI, child processes and cluster: phase 3,
    workplaces (TODO). `node:vfs` is not a Node module *(as far as the
    agent knows)*.
  - watchers per model: TODO.
  - one way to declare (anatomy, descriptors): BRAINSTORM Q13.
- **Decision (the empty files):** `shema.manifest.json` did not parse (biome
  fails on an empty JSON). It now holds the JSON Schema of the devarmory
  manifest, as far as it is known; the name is kept. `scripts/devtools/Taskfile.yml`
  stays empty and is included nowhere.
- **Found:** `@go-task/cli` puts an npm wrapper at `node_modules/.bin/task`
  that exits 0 when a task fails. Husky puts that directory first, so every
  hook passed, checks failing or not. `.husky/task` now runs the real binary;
  a test keeps it so.

## UNIXUSAT=1793918638589 · commit 893fc79

v1.4.0 was merged (PR #8), and its checks failed on `checks / lint`, on the
pull request and on `master`, so the release stopped there. The owner's
batch: the answer to Q13, `src/bridges/` reorganized into a map of bridges
(the git and GitHub bridges moved into it), `examples/` and
`resources/web/` planned, all in `dev/Sarverott` one commit each.

### Orders

````text
## Q13

i think option C
for sure we need to define unified shape of all models by shared base in Element 
````

The question, as it was asked:

````text
## Q13. One way to declare what a model is made of

What a model declares is written in three ways today: `static children` and
`static descriptors` on the class (`descriptors` are functions giving a
file's default content), `ANATOMY` and `ALIASES` as tables in
`models/project/anatomy.ts`, and the loop's defaults as data in
`models/loop/data.ts`. The owner (a review note in `anatomy.ts`): "it looks
fine but we need to unify way we declare things like that". The owner also
made an empty `src/models/devarmory/descriptors/shema.manifest.json`, which
reads as declarations kept as files beside the model.

- a) Everything static on the class, as `children` / `descriptors` are: the
  anatomy becomes `Project.anatomy`, and the loop's defaults `Loop.defaults`.
- b) Everything as files in `<model>/descriptors/`: each descriptor's default
  content and its JSON Schema (`<name>.json`, `schema.<name>.json`). The class
  only names them.
- c) b) for files with content (manifests, settings), a) for structure
  (children, anatomy).

*Lean:* c). Structure is code and is checked by `tsc`. A file's content and
its schema are data that a person, the docs and other tools read without
TypeScript. And `bos workshop status` could then check a file against its
schema.
````

- **Decision (Q13):** c), and one shape for every model through `Element`:
  what any model declares (children, descriptors, anatomy, defaults) is
  declared the same way, defined once in `Element`. Structure stays on the
  class; a file's default content and its schema are files in
  `<model>/descriptors/`. To be coded (TODO, phase 2).

### Found and fixed

- **The lint of v1.4.0:** the revision workflow bumps the version outside any
  hook, and `JSON.stringify(…, 2)` puts each array item on its own line,
  which biome (`expand: "auto"`) collapses. `package.json` now formats with
  `expand: "always"`, the shape npm writes; a test pipes such output through
  biome. `resources/web/public/` is generated, so biome leaves it out.
- **Node 20 warnings:** actions/checkout and actions/setup-node v5, both on
  Node 24. The Gitea mirror's workflow stays on v4.

### The owner's code

- **Decision (bridges):** the owner's folders stay as they are. The owner's
  commit only had its import paths corrected, so it compiles. Then, as the
  files' own comments say: `Bridge` (base.ts) runs a system's command in a
  directory through `Host.run`, the code `Git` and `GitHub` repeated;
  `Git` (git-base) is git's command; `LocalGit` is a clone here (tags,
  `merge-file`, identities: what `Git` did); `RemoteGit` is a place the
  repository is pushed to, the source or a mirror (`role`); `GitHub`,
  `Gitea`, `GitLab`, `Bitbucket`, `SourceHut` extend it, each with its
  public `domain`. `bridges/index.ts` exports them all, and the library
  exports `bridges/index.ts`. The empty files of the other kinds stay empty.
  How a bridge is applied to a model: BRAINSTORM Q14.

