# Almanac

> What BOS knows about working in its environment, written so that both
> people and code can read it: the rules, and the chains of events met before.
> "A way to make a universal cause of problems solvable by small steps"
> (the owner, `docs/almanac/README.md`). A draft (phase 2).

## What it is

The almanac has the sections the owner drafted in `docs/almanac/README.md`:
roles, scenarios, knowledge, patterning, simulations, solutions and
cataclistics. Two of them are coded now:

- **rulesets**: the rules of the BOS environment, each with a written
  statement *and* a condition code can match. Together they answer whether a
  described case breaks a rule.
- **patterning**: chains of events met before, each ending in a known
  result: a cataclysm (an error of the proper flow) and the solution that
  got past it. From them BOS can tell what usually comes next.

The universal almanac ships with the core in `resources/almanac/`, so every
project that installs BOS starts with the same rules. A project adds its own
in `docs/almanac/rulesets/` and `docs/almanac/patterning/`. Every file is JSON:
short, complete, and read by plain code (the owner's "knowledge").

## Rulesets

A ruleset is a JSON file with its rules in order:

```json
{
  "ruleset": "bos-environment",
  "rules": [
    {
      "id": "push-protected",
      "statement": "master, testing, releasing, tags and releases are asked for first, with the reason.",
      "when": { "action": "push", "target": ["master", "testing", "releasing"] },
      "verdict": "ask",
      "source": "AGENTS.md, rule 10"
    }
  ]
}
```

- **case**: what happened or is about to happen, as fields: `actor`, `role`
  (`agent`, `owner`), `action` (`push`, `commit`, `publish`…), `target`, `flags`,
  `place`. Every field holds a word or a list of words.
- **when**: the conditions. Each field lists patterns (`*` for any run of
  characters, as in `dev/*`), and the case matches when every field of `when`
  matches one of them. **unless** works the other way round: when it matches,
  the rule does not apply.
- **verdict**: `allowed`, `ask` (only with the owner's OK) or `violation`.
- **Judging**: the first rule that applies decides, across the rulesets in
  order (the project's own before the universal ones, so a project can make
  a rule stricter). When no rule applies, the verdict is `unknown`: ask.
- **A described case** in words ("Cleo pushes to master") is first put into
  fields by a *categorizer*. The one in the core is plain code: it knows the
  words that the rulesets themselves use. Smaller language models (chat
  completions, categorizers, sentiment analysis) come as another categorizer
  behind a bridge: ollama in a docker container, the verdict still code (Q17).

## Patterning

A chain is a list of events, as they happened, with what solved it:

```json
{
  "id": "lint-fails-on-bumped-package-json",
  "events": ["commit", "bump-version", "push:revision", "checks:lint-failed"],
  "cataclysm": "checks:lint-failed",
  "solution": "biome formats package.json expanded (override), and a test pins it",
  "seen": ["c0ffee1"]
}
```

From all chains, BOS counts which event followed which (after one event, and
after two). Given the events so far, it gives the next events with their
probabilities. It also *recalls* the chains that contain them, with their
cataclysms and solutions. So a situation met once is remembered as a
probable chain of events, and the next time it can be seen coming.

## In code

- `src/core/ruling.ts`: `judgeCase(rulesets, case)`, `categorize(text, rulesets)`.
- `src/core/patterning.ts`: `learn(chains)`, `predict(model, events)`, `recall(chains, events)`.
- `src/models/almanac/`: reads the rulesets and chains of the package and of a project.
- The procedures `judging` and `recalling`. The tools are `bos almanac rules`,
  `bos almanac judge "<case>"` (in words or JSON) and `bos almanac recall
  <event,event…>`.

## Open

- [`TODO`] roles, scenarios, simulations: data only, nothing reads them yet.
- [`TODO`] The language-model categorizer: ollama in a docker container in the workshop's nests, with the GPU (Q17).
- [`TODO`] A Markdown page per ruleset, generated for the wiki and Read the Docs (Q18).
- [`TODO`] Learning chains by itself, from storylines and the commit history.
