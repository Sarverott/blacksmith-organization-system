# Phase 2: the loop as code

Append-only: sections are added at the end and never rewritten. Each starts
with `UNIXUSAT=<ms since epoch> · commit <hash>`. The owner's words are kept
word for word.

## UNIXUSAT=1793882373975 · commit cdf3732

Questions asked by Cleo when `bos flow` was coded (BRAINSTORM.md Q10–Q11),
as they stood:

### Q10. Which loop steps merge by themselves?

The default loop (`src/models/loop/data.ts`) takes gitrecon's flags:
`development → revision`, `revision → testing`, `testing → releasing` merge
by themselves once their checks pass; a contributor's `dev/<name>` →
`development` never does. Two differ from gitrecon: `releasing → master`
waits for a person (gitrecon merged it by itself), as the legacy concept had
the Canon Keeper confirm every release; `master → development` (the release
coming back) waits too, as in gitrecon.

*Lean:* keep it so: one person's merge into `master` per release, everything
before it automatic. Also: should `dev/Cleo` → `development` merge by itself
when its checks pass (agents' batches), while `dev/Sarverott` stays manual?

### Q11. When does the loop start running on GitHub?

`bos flow` works, but nothing calls it yet. Starting it means: workflows on
push to `development`, `revision`, `testing`, `releasing`, `rejection`,
`dev/*` that run `bos flow next-pr`, and on passing checks `bos flow
automerge`; and the stations created on GitHub from `development` (today
`revision`, `testing`, `releasing` exist only here, on the legacy commit,
and `master` holds the legacy README). The first loop would carry the whole
reforge into `master`.

*Lean:* reset the local `revision`, `testing`, `releasing` to `development`,
push them, add the workflows with only `workflow_dispatch` first, run one
loop by hand to `releasing`, and let the owner merge the first `releasing →
master` (that is the `v1.0.0` release, published to npm by the release
workflow).

The owner's answers (`docs/devlog/ORDERS.md`), word for word:

````markdown
# ORDERS: answers to the open questions

The owner's answers to `Q<n>` of [BRAINSTORM.md](BRAINSTORM.md), written below
the line. Agents move them word for word into the changelog and leave this
file with its header only.

---

## Q10
partially described in INQUIRIES
let's identify first your proposition from "Lean"
then check current way we done `development -> master` as short way
we want to have for now this possible but we aim to not do things like this way
now we done shortway stuff, many things need to be coded yet before we do full looping of branches
when PR to master is done 
- we need first to check things
- if all is good then PR can be merged
- on merging the PR then we can create release with tag
- then we can send update signal by webhook with info to dev community with telegram and discord etc.
- after github releasing is been made then we can publish npm package
- paralel with above one we can publish the docs on readthedocs and github wiki
- then we can send update signal by webhook with info to socialmedias
- callback to our listening BOS workshop that we can fetch, sync branches and pull latest master to development for further work

> NOTE: it can be inspired with some of previous workflow we had made lately
> - Amoorion
> - gitrecon
> - bos-skillset

## Q11
good idea there - add to every optional `workflow_dispatch`
````

The owner's inquiries (`docs/devlog/INQUIRIES.md`), word for word:

````markdown
# INQUIRIES: work asked for in the owner's own words

Written below the line. Agents turn each inquiry into the plan (VISION,
ROADMAP, TODO), move it word for word into the changelog, and leave this file
with its header only.

---

## for wiki 
clone "https://github.com/Sarverott/blacksmith-organization-system.wiki.git" into docs/.gh-wiki
place in gitignore docs/.gh-wiki/
each update of documentation should be also place these docs to github wiki in compatible with wikijs formating 
all like `_sidebar.md`, `_footer.md`, `Home.md` and else specific for github wiki files should be generated according tamplating placed in "resources/docs-templates" and coded in python that will be placed in scripts

## reduce content of "scripts/" to only required ones
all that can be ported to typescript should be ported to typescript

## more complex way of github workflows and actions
we should act with routines. for this we will reduce some of loop requirements 
- when we push development to master - bump semver as hotfix
- each step is commit, each commit can be pushed into origin's development
- when you stop work and need user's response - merge own dev to development, then push local to remote, then create PR from developement to master and push developement to revision branch
- when something lands on revision bump semver as minor
- let's place all checks and tests at workflow on PR testing

````

Then, in chat, to Cleo's three questions (pushing without asking, two bumps
per release, checks only on pull requests):

````text
1. yep, push without asking. if you need my "OK" then it should be a reason. development and related ones push with no ask - granted. other like push to revision - granted. other - ask ; 2. we should manage flags setting up of bos like in amoorion where we configure `.github/flow.toml` and if i remember it right `.github/bos.json` in gitrecon. ; 3. keep the check but make it run not on every push - specify more proper checkings that can be diversed into partial checkups and testing.
````

- **Decision Q10:** the short way `development → master` is the loop for
  now; the full loop (`revision → testing → releasing → master`) stays coded
  in `bos flow` and its automerge flags (gitrecon's, `releasing → master`
  waiting for a person) but is not driven yet. A pull request to `master` is
  checked (`pr-checks.yml`), merged by a person, and the merge releases
  (`release.yml`): tag and GitHub release, then npm, the docs (Read the Docs
  builds by itself, the GitHub wiki is synced), the webhooks (dev community:
  Telegram, Discord; social media: [TODO] which), and last the callback to
  the listening BOS workshop ([TODO]: BOS has no listener on the network
  yet; until then `master` is merged back into `development` by the
  workflow). Each outward call is a job that runs only when its secret is
  set.
- **Decision Q11:** every workflow can also be started by hand
  (`workflow_dispatch`) besides its own events; `flow.yml`, which drives the
  full loop, has only `workflow_dispatch` until the full loop is used.
- **Decision (chat 1), pushing:** an agent pushes `development`, its own
  `dev/<name>` and `revision` without asking; anything else (`master`,
  `testing`, `releasing`, tags, releases, publishing, the wiki's repository,
  remotes and settings) is asked for, with the reason. AGENTS.md rule 10.
- **Decision (chat 2), flags:** a project's BOS settings live in
  `.github/bos.json` (gitrecon has `.github/bos.config.json`, Amoorion
  `.github/flow.toml`): `loop` (stations, directions, automerge…; replaces
  `.bos/loop.json`) and `versioning` (which station bumps what). The
  routine's bumps are its defaults: landing on `revision` is a minor bump,
  on `master` a patch ("hotfix"). A version is bumped only when it is
  already released (tagged), so one release that passes both is bumped once:
  `revision` makes `1.1.0`, `master` releases it; something reaching
  `master` without passing `revision` gets the patch *(assumed: this is how
  the two bumps fit together)*.
- **Decision (chat 3), checks:** `check.yml` stays but runs only for what a
  push changed: code (types, lint, tests, build) and docs (MkDocs) as
  separate jobs, on `development` and `dev/**`; the full set (plus commit
  messages and the package) runs on pull requests (`pr-checks.yml`), both
  through one reusable `checks.yml`.
- **Decision (inquiry, wiki):** `docs/.gh-wiki` is a checkout of the wiki's
  repository; `scripts/gh-wiki.py` (Python, a build-side tool like MkDocs)
  copies the docs into it, flat, with links rewritten, and renders `Home.md`,
  `_Sidebar.md`, `_Footer.md` from `resources/docs-templates/`. The release
  pushes it; by hand: `task docs:wiki`.
- **Decision (inquiry, scripts):** `scripts/` keeps only what is required;
  what can be TypeScript moves into the core as procedures. The inventory is
  in `scripts/README.md`; the ports are steps of phase 2 and 3.
- **Decision (inquiry, routines):** written into AGENTS.md as "The routine":
  a step is a commit and may be pushed to `origin/development`; when an
  agent stops for the owner it merges its `dev/<name>` into `development`,
  pushes, opens (or keeps) the pull request `development → master` and
  pushes `development` to `revision`.
