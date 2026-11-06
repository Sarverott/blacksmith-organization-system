# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q16
in phase 2.

## Q17. Smaller language models for the almanac: which, and where

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

## Q18. Rulesets: JSON, or PP1's Markdown

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
