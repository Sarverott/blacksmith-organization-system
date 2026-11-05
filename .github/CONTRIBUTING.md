# Contributing

BOS is made by a **contributors committee**: every person and every AI agent
working on it is a member, with the same loop, the same checks, an own branch
and an own name. The full rules, for agents and people alike, are in
[AGENTS.md](../AGENTS.md); this page is the short way in.

## Set up

You need Node ≥ 22.18, [Task](https://taskfile.dev) and, for the
documentation, [uv](https://docs.astral.sh/uv/).

```sh
git clone https://github.com/Sarverott/blacksmith-organization-system.git
cd blacksmith-organization-system
task install          # npm install + the git hooks
cp .env.example .env  # then set WORKSHOP_ROOT to a place for trying things
task check            # types, lint, tests: what CI runs
```

`.env` chooses the workshop that this checkout's `bos` works on. Point it at
a scratch place or a spare partition, so trying BOS never touches your own
`~/__WORKSHOP`. Tests make their own temporary workshops.

## Work

1. **Your branch.** Work on `dev/<your-name>`, made from `development`.
   Never commit to `master`.
2. **One step, one commit.** A step is a finished, checked piece of work.
   Commits are [conventional](https://www.conventionalcommits.org/)
   (`type(scope): subject`); `task commit` guides you. The hooks run the
   checks and commitlint. Don't skip them (`--no-verify`).
3. **Code is the procedure.** A new behaviour is a directory in
   `src/procedures/` with a `DESCRIPTION.md` (why), one file per step (how) and
   `_index.ts` (the order). Meaning comes first: write or change the
   element's page in `docs/glossary/` before its model.
4. **A fixed bug gets a test.**
5. **Pull request** from `dev/<your-name>` into `development`. From there the
   craft loop takes it on: `revision`, `testing`, `releasing`, `master`.

AI agents sign their commits with their own `Co-Authored-By:` line and keep
their notes in `docs/.agents/`.

## Talk

- A question for the owner: `docs/devlog/BRAINSTORM.md`, as
  `## Q<n>. <title>` with your *Lean:* (what you would pick).
- An idea for debate: `docs/devlog/PROPOSALS.md`, as `PP<n>`.
- `docs/devlog/ORDERS.md` and `INQUIRIES.md` are the owner's: answers and
  new work are written there, below the line.
- Bugs and wishes: [issues](https://github.com/Sarverott/blacksmith-organization-system/issues).

By contributing you agree that your work is released under the
[MIT license](../LICENSE) and that you follow the
[code of conduct](CODE_OF_CONDUCT.md).
