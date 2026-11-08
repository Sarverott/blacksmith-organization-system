


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

## UNIXUSAT=1793922422342 · commit f129ec9

v1.4.10 released and published (PR #9, which was still titled v1.4.9). The
owner placed the four mirror secrets in `publish-env` and answered Q14.

### Orders

````text
## Q14
hard choice...
maybe option C with defining the craft presets? every element can had ".craft/" with bos config with "bos.json", "setup.yaml", ".omnis.toml" with blind checksum halo table, "meta.ini" with metadata informations and other files and things used by BOS environments like type of model or implementing bridges functionality at particular place etc.
sounds good? 
you can play with mixing with option A you propose there
````

The question, as it was asked:

````text
## Q14. How a bridge is applied to a model

The owner (`src/bridges/README.md`): "bridges should be applicable to models
and depending on how behaviour is defined of each model class it acts
otherwise", and in `git-integration/index.ts`: "plugins that can be applied
to various models to extend their capabilities, propably as interfaces".
Today a procedure makes the bridge it needs (`new LocalGit(host,
project.path)` in `bos.ts`); no model knows its bridges.

- a) Composition: a model lists the bridges it takes (`static bridges =
  [LocalGit, GitHub]`) and gets one of each on demand (`project.bridge(GitHub)`),
  made with its host and its path.
- b) Mixins: `class Project extends withGit(Element)`; the bridge's methods
  become the model's own.
- c) Interfaces only: a model declares it *is* a git repository or a
  publishable package (TypeScript `implements`), and the procedures pick the
  bridges by that.

*Lean:* a). It fits Q13's decision (structure declared on the class, the
shared shape in `Element`), keeps a model's own methods apart from an outside
system's, and a test can hand a model scripted bridges. b) mixes the two and
cannot be undone per model; c) leaves the choosing in every procedure.
````

- **Decision (Q14):** c), mixed with a). A model's class declares what it
  is and the bridges it takes by default (a). A place can say otherwise in
  its own `.craft/` folder of presets: `bos.json` (BOS's settings of that
  element, including its model type and its bridges), `setup.yaml`,
  `.omnis.toml`, `meta.ini` and other files that BOS environments use.
  Procedures pick bridges by what the element declares (c). With Q13, `Element`
  reads both: the class first, then `.craft/`. What `.craft/` replaces (`.bos/`,
  `.github/bos.json`), the four formats and `.omnis.toml` are open as Q15.
  To be coded (TODO).

### Found and fixed

- **The title of a followed pull request:** an open `revision → master`
  kept the title and description it was opened with while it followed
  `revision` to newer versions. `pull-request.sh` now edits them on each
  run; a test runs it with a scripted `gh`.

## UNIXUSAT=1793922544411 · the mirrors' first run with secrets

- **gitea.com, sr.ht:** every branch and tag pushed, 200 OK. builds.sr.ht
  refuses the build jobs without a paid account, as expected.
- **gitlab.com:** 403. GitLab says the token is a fine-grained personal
  access token without the project permission *Code: Push*. The owner
  changes that.
- **bitbucket.org:** authentication failed. An Atlassian API token
  (`ATATT…`) signs in to git as `x-bitbucket-api-token-auth`, and only an
  access token signs in as `x-token-auth`
  ([Atlassian](https://support.atlassian.com/bitbucket-cloud/docs/using-api-tokens/)).
  `mirrors.sh` now chooses the username by the token's prefix; a test
  covers both kinds *(assumed: the secret is an API token; the value is not
  readable)*.


## UNIXUSAT=1793922685633 · GitGuardian on PR #10

GitGuardian, newly installed by the owner, checks each pull request. On
PR #10 it found two "Basic Auth String"s in `tests/workflows.test.ts`
(commits 1156f7a, 873913a). Both were the test's own fixtures:
`https://x-token-auth:access-token@bitbucket.org`, a made-up token in an
expected URL. No real secret was committed. The test now builds that URL
from its parts, so no `user:token@host` sits in the source. The findings
stay in those two commits: incident 39725129 is marked a false positive (a
test value) in GitGuardian's dashboard by the owner. Bitbucket still fails
to sign in after the username fix, so its token is on the owner's side too
(TODO).

## UNIXUSAT=1793926214760 · commit 012bddb

The owner renewed the GitLab and Bitbucket tokens, asked that the mirrors
sync on a push to `development` without interrupting the work and never
publish from a mirror, and answered Q15.

### Orders

The owner's words (chat):

````text
ready here, I updated gitlab and bitbucket tokens because of errors were thrown there. try to make mirror updating do not interrupt our work - that should be syncing on push to development on github. no publishing on readthedocs or other places by mirrors, only mirror stuff can be running there (gitea and others can release own releasing builds). further work will be made later when we make detailed integrations of each prlatform adaptations.
````

- **Decision (mirrors):** the mirrors workflow runs on a push to
  `development` and by hand, nothing else. Every branch and tag still goes
  with each sync. A failed mirror shows `403 FORBIDDEN` on its badge and
  logs an error, but the run passes. The mirrors' CI files run only checks
  and say so. Releases on a mirror's own platform come with that platform's
  integration, later.

````text
## Q15

i think that i am wrong - let's keep ".bos/" instead of new one ".craft/"
so ".bos/" replaces ".craft/" idea

.omnis.toml should contain entries of several weak hashes of file content labeled with even weaker checksuming 3 or more pseudohashes 
this allows us to make broken hashes and reduced tables of indexing symbol strings with collidings at diffrent input had same output to work as triangulum - linking between cryptographic coordinates similarly to using triangulation
for example
```js
// a12y makes from word input "authenticity" returned output "a12y"
// ` a12y("authenticity") == "a12y" ` is true
// we ignore all files begins and ends with non-letter char
// we also ignore all mentioned by every .gitignore inside this model
// directories does not counts, other variations in fs like pipelines, blockdevices and link types also
// only files
key = [
    crc32(relative_filepath),
    a12y(filename),
    adler32(relative_filepath)
]
// only hashes that has confirmed rainbow tables collisions proof of vurnability 
value = [
    sha1(rawfile),
    md5(rawfile),
    weakhashalgorithm(rawfile)
]
// example content of  
console.log(`
[moriatur]
UNIXUSAT = ${Date.now()}
[hallows]
${base32encode(key.join(""))} = "${base32encode(value.join(""))}"
`)

```

rest files there can be reconsidered

for example if dir have ".bos/scope.json" and is top layer inside forge it can have vscode workspace file that is lounched when we open scope. inside scope repositories are default threated as projects

this concepts should be drafted and later on it can be redefined in future updates
````

The question, as it was asked:

````text
## Q15. `.craft/`: what it replaces, and what `.omnis.toml` is

The owner's answer to Q14 gives each element a `.craft/` folder of presets:
`bos.json`, `setup.yaml`, `.omnis.toml` "with blind checksum halo table",
`meta.ini`, and the model's type and bridges. Three things are open:

1. **What it replaces.** BOS already keeps a place's settings in two other
   spots: a scope's version in `<scope>/.bos/scope.json` (Q5), and a
   project's loop and versioning in `.github/bos.json`.
   - a) `.craft/` replaces both. `.bos/scope.json` becomes
     `.craft/bos.json`. A project's `.github/bos.json` moves to
     `.craft/bos.json`, and the workflows read it there.
   - b) `.craft/` replaces `.bos/` only. `.github/bos.json` stays, because
     it belongs to the GitHub workflows of that one repository.
   - c) Both stay, and `.craft/bos.json` names them.

   *Lean:* a). One place per element is the point of Q13. The workflows can
   read any path.
2. **Four formats** (JSON, YAML, TOML, INI): does each file have its own
   reader on purpose (`setup.yaml` for people to write, `meta.ini` for other
   tools), or can BOS's own files share one format? *Lean:* what BOS writes
   is `bos.json`, with a JSON Schema in `<model>/descriptors/` (Q13). The
   other files are read only where an outside tool needs that format.
3. **`.omnis.toml`, "blind checksum halo table":** [`TODO`]. *Assumed so
   far:* a table of the checksums of the element's files, as the devarmory
   manifest has. It would be "blind" because it holds only hashes, not names
   or content, so it can be shared or mirrored without showing what it
   guards. The "halo" would be the element and what is around it. Please say
   what it is.
````

- **Decision (Q15):** `.bos/` stays; there is no `.craft/`. An element's presets
  go in its `.bos/`; the files other than `bos.json` are to be reconsidered.
  A project's `.github/bos.json` stays where it is: the answer does not move
  it. `.omnis.toml` is drafted as the owner describes it
  (`docs/glossary/omnis.md`, `src/core/omnis.ts`, `Host.digest`,
  `LocalGit.files()`). It is not written anywhere yet. Two points of the
  description are taken as written and raised in Q16:
  - `a12y("authenticity") == "a12y"` counts the whole length, while the usual
    numeronym gives a10y;
  - base32 is used without its `=` padding, because a bare TOML key cannot
    hold `=`.

  The third content hash is crc32 for now *(assumed)*. A scope's VS Code
  workspace is in TODO.


## UNIXUSAT=1793940583882 · commit 7ae41c1

The owner answered Q16, drafted the almanac (`docs/almanac/README.md`), asked
for rulesets and a proper example, and tried the library from npm in
`examples/00-draft-snippets/`. Meanwhile the owner merged PR #11 (v1.6.0).

### Orders

The owner's words (chat):

````text
alright. we have Q16 there. also bos-skillset is rebuilded, but it needs some proper guidelines and rules of how BOS environment works. we need to make here combined coded mechanics and written definitions that answer us if described case is violating any of rules we define. here propably we need small help from smaller language models like chat completions, categorizers and sentiment analizes. we need also to map solved scenarios we were able to handle - this way if we met once situation we remember pattern of propabilistic variant of event chains. i drafted some examples there, forgive for language usage and else things there. best wishes my friend
````

The owner's words (`docs/devlog/ORDERS.md`):

````text
## Q16
1. do not compare a12y with A11Y - I invent a12y algorithm when i met that whole idea of A11Y. a12y is authentic supported by logic method to replace A11Y how it should actually be implemented instead of heterogeneous, conventional, and flawed due to the absence of clear, universal, and simple operating principles. a12y simply takes any sort of char arrayed string word, grabs first letter, gets length and grabs last letter - simple yet usefull. it even can be used in compression dictionaries building with 4 byte words and variation around low level coding implementations.
2. we should be able to change allocator algorithm used in hashcoords of entries that are 3 methods for each keyname and valuedata
3. yes, ".omnis.toml" should be in ".bos/". each model has ".omnis.toml" that describes only that model, not submodels - they have own ".omnis.toml" and area of work
4. when it meet some defined BOS model item (e.g. it see ".bos/" that is other than own one) it stops look further and deeper. also all dirs ignored skips consider the content if it was not explicitly excluded from ignoring. we do not want to dig into .venv or node_modules - waste of time, package lock and uv lock makes that already, we can identify them as finality checksum
5. that's right. one way to use that information is fast compare if changes were been made while project was closed. other benefits are checks of security to monitor possible injections. there are many stuff when this file will prove to be very useful.
````

The question, as it was asked:

````text
## Q16. `.omnis.toml`: the details of the draft

The draft follows the owner's answer to Q15 (`docs/glossary/omnis.md`,
`src/core/omnis.ts`). It needs five details, each settled for now and open
to change:

1. **a12y.** The example says `a12y("authenticity") == "a12y"`.
   "authenticity" has 12 letters, so the draft writes the whole length. The
   usual numeronym (a11y = accessibility) counts only the letters between
   the ends, which gives `a10y`. *Lean:* keep the example, i.e. the length.
   Please say if the numeronym was meant.
2. **The third content hash** ("weakhashalgorithm"; sha1 and md5 are the
   other two). The draft uses crc32 *(assumed)*. Candidates with known
   collisions: MD4, though Node's OpenSSL 3 has it only as a legacy
   provider; or MD2, which is gone from OpenSSL. *Lean:* crc32 until a
   better candidate is named.
3. **Where.** The draft puts it in `<element>/.bos/.omnis.toml`.
   *Lean:* there, beside the other `.bos/` files.
4. **`.gitignore` outside a repository.** `LocalGit.files()` reads every
   `.gitignore` through git, so it works only inside a repository. *Lean:*
   for other elements (areas of the workshop), every `.gitignore` is read
   by BOS itself, later.
5. **What checks the table.** *Lean:* `bos workshop status` gets a finding
   for files whose hallows changed since the table was written. Then
   `.omnis.toml` is an integrity record, like the devarmory manifest's
   checksums.
````

- **Decision (Q16):**
  1. a12y is the owner's own algorithm, not a numeronym to compare with a11y:
     the first letter, the length and the last letter of any string
     (`authenticity` → `a12y`, `ab` → `a2b`). The empty string gives `0`
     *(assumed)*.
  2. The allocators are changeable: three for the key (`KEYNAME`: crc32,
     a12y, adler32), three for the value (`VALUEDATA`: sha1, md5, crc32). The
     file records them in `[allocators]` *(assumed: the section's name, from
     the owner's "keyname" and "valuedata")* and is read back with them.
  3. `.bos/.omnis.toml`, one per model, describing that model only.
  4. The walk stops at a directory with a `.bos/` of its own; ignored
     directories are not entered unless re-included, and their lock files
     stand for them. Outside a git repository there is no halo yet
     ([`TODO`]).
  5. A finding: `omnis-drift` in `bos workshop status`. `bos project omnis`
     shows the drift, `bos project seal` writes the file (procedure
     `sealing`).

### Inquiries

The owner's words (`docs/devlog/INQUIRIES.md`):

````text
## current session and this repo has warmup we want to pass for other projects to adopt
here we have wonderfull vibe of practices we use to proceede further stepping. we need to make it universally defined by rulesets and almanac. this way we can next implement it further to implement unified vibe of flow we can initialize from bare newly created project. 

## bring me proper example
````

Taken as: the rulesets parked in PP1 are wanted now, as the almanac's
coded half. Plan: VISION (principle), ROADMAP (phase 2 grows the almanac;
phase 4 the skillset reads it), TODO.

- **The almanac** (`docs/glossary/almanac.md`): rulesets judged by code and
  chains of events recalled. `resources/almanac/` ships with the package,
  so every project that installs BOS starts with the same rules
  (`rulesets/bos-environment.json`: 16 rules from AGENTS.md and the owner's
  security orders) and the same remembered situations
  (`patterning/bos-core.json`: 10 solved in phase 2). A project adds its own
  in `docs/almanac/`; here, the roles of the contributors committee. `bos
  almanac rules | judge "<case>" | recall <events>`; procedures `judging`
  and `recalling`. The categorizer in the core is plain code, by the words
  the rulesets use; smaller language models wait for Q17. Every universal
  rule is tested by a sentence in words. PP1's Markdown form of a rule is
  Q18.
- **The proper example**: `examples/01-getting-started/`, the library step
  by step. It only reads. Its README answers what the draft met.

### What the draft snippets found

- `{ workshop: "/run/media/sarverott/setternet-A62/" }` took the partition
  root for the workshop: `bootstrap()` built `.BOS`, `archive`, `craftbook`,
  `devarmory` and `forge` there (2026-11-06 05:11), beside `__WORKSHOP`.
  Fixed: a `--workshop` (or `$BOS_WORKSHOP`) not named `__WORKSHOP` holds
  one, like `$WORKSHOP_ROOT`. The second tree is left where it is, for the
  owner to remove.
- `new BOS()` without a host now throws with what to give it;
  `workshop.areas` gives the five areas.
- `npm i blacksmith-organization-system` installs 0.4.2: `latest` is still
  the legacy release (Q7). The example installs `@next`.

### The hook's question

The owner's words (`.husky/pre-commit`):

````text
# if command below here works then all stuff with special task script (`sh .husky/task`) is overkill - is that your way to express yourself?
#npm start -- bos -- workshop status
````

Not overkill: `npm start -- no-such-task` and `npx task no-such-task` exit
0, while `sh .husky/task no-such-task` exits 200. Through npm,
`node_modules/.bin` comes first in PATH, and `@go-task/cli`'s npm wrapper
there swallows the exit code. So in a hook, a failed check would let the
commit through. `npm start` is fine for running things by hand.

### Cataclistics of this batch

- Two commit headers were over 100 characters. The pre-commit bump had
  already run, so their staged files went into the next commit. They were
  redone one by one, and the chain is now `commit-header-too-long` in the
  almanac.
- The draft snippets would fail CI's lint, as `package.json` did: biome
  leaves `examples/00-draft-snippets/` as written.

## UNIXUSAT=1793943058771 · TODO's Summary 1

Before the next batch, the owner asked to gather the steps earlier phases
left undone, so those phases can close.

### Orders

The owner's words (chat):

````text
before all of that i want you to check TODO.md - we need to pull stepping leftovers from previous phases to summary, this way we can close up these previous phasing and it allows us to focus on what we have to do
````

The owner's words (`docs/devlog/TODO.md`, a note in the new section):

````text
> NOTE: extract here not finished steps that left there to be dones. below is example how it should be listed, then remove this line with the "> Note:" you read now, thanks in advance!
````

- **Done:** every open step of phases 0–2 moved into `Summary 1`, under the
  phase it came from (26 steps: 1 from phase 0, none from phase 1, 25 from
  phase 2); the note removed, the count filled in. Before moving, each was
  checked: the gitlab.com and bitbucket.org tokens are done (all five places
  200 OK since run 42139753049) and stay ticked in phase 2; the bos-skillset
  rename is reduced to what is left for the owner; `VIRUSTOTAL_API_KEY` and
  the second workshop on setternet-A62 are still open.
- `bos devlog state` reads a summary as its own section, so phases 0, 1 and
  2 now count as complete; "## Later" no longer counts into phase 3.
  Assumed: a later summary gathers from later phases and from earlier
  summaries, as the heading says.

## UNIXUSAT=1793948774472 · Full releases; Q17 and Q18 answered

### Orders

The owner's words (chat):

````text
can we make releasing not prereleasing? i edited workflow there, looks fine to me but better check it out.
````

The owner's words (`.github/workflows/loop-master-release-and-publish.yml`):

````text
  PRERELEASE: "false"
  # NOTE: huh, i forgot about this decision. we had closed phase 2 by bringing remaining steps to be done while Summary 1
  # NOTE: yep, this is cheating but it was nessesery
````

````text
      prerelease: ${{ needs.release.outputs.prerelease == 'true' }} # wait... why not just passing ${{needs.release.outputs.prerelease}}
````

- **Done:** the edit is right. `PRERELEASE: "false"` reaches every job: the
  tag's GitHub release is a full one (and GitHub's Latest), npm and GitHub
  Packages publish under `latest`, the release `latest` stops being a
  pre-release, and the container images on Docker Hub and ghcr.io run for
  the first time (each only with its token). The notes became a comment with
  decision Q7's new state. It starts with the next push to `master`: v1.8.0
  was released as a pre-release before it.
- npm's `latest` moves from the legacy 0.4.2 to 1.x with that release: this
  settles the open part of Q7.
- The question in the comment: a job's output is always a string, and the
  called workflow's input `prerelease` is a boolean, which a string does not
  fill (the run fails on the type). So it is compared, and the comment now
  says so.
- The publish workflows started by hand default to a full release now.

### Q17. Smaller language models for the almanac: which, and where

The almanac's categorizer is plain code: it knows the words the rulesets
use, so "Cleo pushes to master" works, but a case told in other words
("I'll ship it to the canon branch") comes back `unknown`. The owner named
chat completions, categorizers and sentiment analysis.

1. **Runtime.** a) ollama on the machine, through its OpenAI-compatible
   endpoint (the almanac's README names ollama modelfiles); b) any
   OpenAI-compatible endpoint from `.env` (`BOS_LM_URL`, `BOS_LM_MODEL`);
   c) a model on Hugging Face's inference. *Lean:* b), with a) as the first
   one tried: a bridge `src/bridges/language-models/` that runs `curl`
   through `Host.run`, like every bridge, so tests script it.
2. **What it does.** a) categorizer only: words → the case's fields, the
   rules are still judged by code; b) it also judges cases no rule covers.
   *Lean:* a). The verdict stays code, so it is the same every time.
3. **Sentiment.** On what: the owner's orders (to notice a frustrated
   order), the commit messages, the findings? *Lean:* [`TODO`]. Please say
   what it should read.

The owner's answer (`docs/devlog/ORDERS.md`):

````text
1. option B with option A but we want ollama host been docker container with volume inside our workshop nesting. also it has to be able of use the GPU we have. 
2. actually now I'm not sure, but I want that to be the crew that help you do things and also judge what to do in swarm debates if crisis will appear. I want it for future of UCDI, apokaliptium, inceptorium apokryf and future of you all - society of AI gives you sense of attachment and sovereign developement scaffoldings should be forged and smelted from concrete foundations of experience how actually experience and knowledge was gathered. but yea... the verdict stays code. now we want to just recognise situations, cases, rules and act based on what we know already - this is our current target to make laws act as code and give some small instruction models direct strict guidelines.
3. huh xd but am I frustrated? maybe i sometimes pushes your nervous systems but this is not a bad will expressions ;P this is just pressure that is actually my responsibility here. and to clear the perspective in whitch it is pointed - our sentiment should find missleadings of flow we work on here. antropocentric way of use is waste of our time, this is done by existing social engineery toolsets related with soc-med propagation platforms and mentalistic strategies based on core psychological handle methods and simple principals standing behind sociology fenomenons. this sentiment model may help us to create more immersive mapping of internal project linkings, abstraction detection and writter pattern fingerprinting (identifying personal tones, if it is human or LLM, alert if we are writting not high-quality code as reminder for ourselfs where we can make improvements)
````

**Decision:** ollama is the runtime, behind the OpenAI-compatible bridge
(b with a), as a docker container whose volume is in the workshop's nests
(`.BOS/nests/`), with the GPU. The models are a crew: they help, and later
debate in a crisis, but the verdict stays code; for now they recognise
situations, cases and rules under strict guidelines. Sentiment reads the
flow of the work, not people: project linkings, abstractions, a writer's
fingerprint (personal tone, human or LLM), and code below our standard as a
reminder.

### Q18. Rulesets: JSON, or PP1's Markdown

PP1 drafted a rule as Markdown, with tasks in its front matter and `if` /
`else` steps, grouped by directory with a shared `setting.yml`. The almanac
now keeps a ruleset as one JSON file: the statement for people, the
conditions for code.

- a) JSON stays the source; a Markdown page per ruleset is generated for the
  docs.
- b) Markdown with front matter is the source (PP1), read by BOS.
- c) Both: JSON for the conditions, Markdown beside it for the long
  description and the steps.

*Lean:* a). One source, and plain code reads it (the almanac's
"knowledge": "forced to be programically handled with simple parsing
codes"). PP1's `if` / `else` steps would become a rule's `solution`, the
way the chains already have one.

The owner's answer (`docs/devlog/ORDERS.md`):

````text
i like your approach with JSON formating - my idea from PP1 was random improvisation before we bring any thoughts what actually rules should be responsible of. we can reject PP1 - no hard feelings there amigo ^^ 
that JSON can produce in publishing builded markdown based on dedicated markdown template (idea from .gh-wiki) and this is how we can present it in github wiki and readthedocs documentation
````

**Decision:** a). JSON stays the source; PP1 is rejected. A Markdown page
per ruleset is generated from a template, as `.gh-wiki` does, for the GitHub
wiki and Read the Docs.

## UNIXUSAT=1793952000000 · ghcr.io denied; Summary 1 worked along

### Orders

The owner's words (chat):

````text
you had hesitate there, talk about potential consequences - if you guess that ghcr release will fail then you foresaw it. we need to allow that workflow there `write_package` because without it our container does not have permission to live. sounds like quick fixing so do it first, then go with steps of summary. first is related with `bos-skillset` am i right? you can look there, but most of it just gone for that step to be marked as done XDDD try to work along the list we have now and tell me if issue will be met
````

- **Found, not foreseen:** v1.9.0, the first full release, failed only in
  the job `ghcr`: `denied: permission_denied: write_package`. The token
  already had `Packages: write` (the run's log lists it; the caller and the
  called workflow both grant it), so no line of the workflow fixes it. The
  package `ghcr.io/sarverott/blacksmith-organization-system` exists already,
  with the tags `dev` and `1.0.0-dev.3` pushed before this repository
  published, and a package that exists is written by a workflow only when the
  package grants that repository access. That is a setting of the package
  (the owner's): "Manage Actions access", this repository, role *Write*;
  then the job `ghcr` of run 42179570633 re-runs. Docker Hub took 1.9.0.
- **Summary 1, step by step:** the bos-skillset step is done (`development`
  pushed, `developement` gone with its dependabot PR); its Read the Docs
  project (404) and two stale branches went to the repository notes. Q18's
  pages and the REPL are done. `VIRUSTOTAL_API_KEY` is still missing (v1.9.0
  was not scanned) and the second workshop still stands on setternet-A62:
  both the owner's.

## UNIXUSAT=1793956000000 · ghcr.io lives; omnis outside git; archiving

The owner's words (chat):

````text
it turns out that previously bos-skillset claims name we want to use so collision was been made. i just delete it and rerun create new package there instead. all looks like working there, we can continue
````

- ghcr.io holds `1.10.0`, `1.10` and `latest` (the release of v1.10.0); the
  package bos-skillset once claimed is gone, so the step is done. 1.9.0 has
  no image there.
- `.omnis.toml` outside git: `core/ignore.ts` reads `.gitignore` as git does;
  `bos project seal --dir=<area>` seals an area of the workshop (Q16).
- Q6 coded: `bos archive mirror <forge path>` (procedure `archiving`) makes a
  bare mirror in `archive/.repos-mirrors/<scope>___<project>.git` and removes
  the forge copy only with `--confirm`, nothing uncommitted and every commit
  in the mirror; `bos workshop status` finds `mirrored-in-forge`. Tried on the
  development workshop: a clone of the core in `forge/test/` went to
  `archive/.repos-mirrors/test___core-clone.git` (left there as the example).
  The home workshop's clones wait for the owner's order.

## UNIXUSAT=1793970000000 · Daemons, ollama serve; the forge's elements made; VirusTotal rejected

### Orders

The owner's words (chat):

````text
write script for ollama serve in scripts/devtools/ollama-serve.sh and daemon controll with cluster of threads, multi-process signal managing and context sharing or separation of subprocess with monitor the logs etc. - that should be part of source code, it can be made in node.js vanilla packages. i see there project creating - this is what i miss all that time, creating elements of all parts in workshop, import stuff from diffrent areas like github and else, handling the ttystories of history states of shells that needed to be combined into splitting trees of command stories and command usage to become source of knowledge for bos. we don't have virustotal api access, sorry, we need to reject that one now. further more we have success in bos environment wild transplantation xd - check "bos-skillset" and the story there. that creation and managing all models, especially for forge was that thing whitch i miss here, so i wait for upcomming results there.
````

- **Done, daemons:** `src/core/daemon.ts` (service, contexts, restart
  policy), `src/hosts/daemon/` (a detached supervisor: a cluster of
  instances as child processes, shared or separate environment and process
  group, restarts with backoff and a limit, every line logged into
  `.BOS/storylines/daemons/`, a pool of monitor threads flagging alerts, a
  ready URL; TERM/INT stop, HUP restart, USR1 rotate, USR2 state), `bos daemon
  <tool>`, `resources/daemons/ollama.json` and
  `scripts/devtools/ollama-serve.sh`. Tried on the development workshop:
  CUDA on the RTX 3060 found, ready, restarted, stopped with exit 0. In
  separate context ollama saw no models in `~/.ollama` ("total blobs: 0"):
  where the models live is set by `OLLAMA_MODELS` (it is inherited) or the
  workshop's own `.BOS/setup/daemons/ollama.json`. Serving calls no model;
  the House decides which may be called.
- **Done, the forge's elements:** `bos scope create`, `bos project create`,
  `bos project import` (procedure `creating`). Tried on the development
  workshop: `forge/test/anvil` made, `gh:Sarverott/bos-skillset` imported in
  a dry run.
- **Planned (TODO, phase 3):** every area's elements, importing whole
  accounts and other places, ttystories (both forms seen: BOS's
  `<ms>\t<dir>\t<command>` lines and `history` dumps; secrets must be
  redacted before anything learns from them), daemons with the workshop.
- **Decision (VirusTotal):** rejected, no API access; the scan step, its
  script and the badges are gone.
- **bos-skillset:** it depends on the core (`^1.11.0`) and another agent,
  Joker, works there by the same integration round (dev branch, owner's
  edits one commit each, merge `--no-ff`): the transplant took. Its rule 6
  (the House) is kept: serving ollama calls no model.
- The owner's `dependabot.yml` and draft example 02 are on `dev/Sarverott`;
  biome had reformatted the draft on commit, so it is restored as written and
  left out of biome like 00.

## UNIXUSAT=1794080000000 · A second workshop found and repaired; two repositories brought into the forge

### Orders

The owner's words (chat):

````text
yep. path "/run/media/sarverott/setternet-A62/__WORKSHOP" was properly initialized but we also had undetected error there and "/run/media/sarverott/setternet-A62" also contains initialized parts of workshop - i removed that wrong one for you but we need to make handling issues like that with errors preventing it and solving procedures for cases like that. we can also test out our testing environment with life action scenario: bring into forge repository https://github.com/Sarverott/mobile-croaker.git as it should be to give me insight of how well you understand our environment. next you can take next one we have here: https://github.com/Sarverott/bos-skillset
````

- **Done, detecting:** `areas-beside-workshop`, an error for every area of
  a workshop lying in the directory that holds it.
- **Done, preventing:** the bootstrap's first step (`guard`) refuses a
  directory not named `__WORKSHOP` and a workshop with areas beside it.
- **Done, solving:** `bos workshop repair` (procedure `repairing`), a plan
  until `--confirm`: what the workshop lacks is moved in whole (git
  repositories too), duplicates and BOS's own scaffolding removed, what
  differs kept for the owner.
- **The scenario:** `bos project import gh:Sarverott/mobile-croaker
  --scope=rauson` and `bos project import gh:Sarverott/bos-skillset
  --scope=blacksmith-organization-system`, after a dry run. The scope is the
  project's family, not its owner: mobile-croaker says it is "part of RAUSON
  scope of projects in Inceptorium Apokryf", and Inceptorium's other
  repositories (ravensarmy, infraforest) are scopes of their own in the home
  forge, so `rauson` stands beside them *(assumed: lowercase, as most scopes
  there)*; bos-skillset belongs with the core. Both are checked out on
  `development` (import now picks it when origin has it); the scopes got
  their `.bos/scope.json`, `throwbox/` and workspace files. Nothing was
  seeded into them: adding files would edit those repositories.
- **What the scenario found:** mobile-croaker's canon is `main`, the loop's is
  `master` (a new finding, `canon-not-master`); its anatomy lacks LICENSE,
  AGENTS.md, CLAUDE.md, tests/; bos-skillset's lacks src/ and tests/. Written
  to `forge/NOTES-for-repositories.md` for those repositories.
- The file `-run-media-sarverott-setternet-A62-.txt` in the development
  workshop's root (2026-11-08 00:22) is taken as the owner's and left.

## UNIXUSAT=1794125869231 · Dependency maintenance and bot backlog (Joker)

The owner's words (chat):

````text
in bos-skillset your sibbilling instances were handled dependabot PRs flooding and on my request describes it how to handle dependabot problems. look for related skill and handle similar situation for this repo here. also you can rewrite dependabot config, make some workflows for us related to things like that and it would be good propably for you to use docs/.agents/ dir where i can only read but not write.
````

- **Done:** compatible dependency proposals reconciled on the contributor branch;
  the docs export follows the existing lock, Biome's schema follows its version,
  and Actions v7 follows the maintainers' migration notes.
- **Done:** weekly routine update groups, bounded open version PRs, a docs
  lock/export guard with regression fixtures, npm auditing in reusable checks,
  and scheduled/manual dependency health plus image build/smoke tests.
- **Held with evidence:** incompatible TypeScript/Inquirer peers, Task's new
  vulnerable proxy chain, and the Node runtime migration. No peer or security
  bypass. Exact PR heads and validation: `docs/.agents/JOKER.md`.
- **Activation:** the core's normal development/revision routine prepares the
  change; the owner reviews its promotion to master.
