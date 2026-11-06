# judging

Answers whether a described case breaks a rule of the BOS environment
(glossary: [almanac](../../../docs/glossary/almanac.md)). The rules are written
twice in the same entry: a statement for people and conditions for code, so
the answer comes with the rule's own words and where it comes from.

A case comes as fields (`{ "action": "push", "target": "master" }`) or in
words ("Cleo pushes to master"); words are put into fields by the
categorizer first. The first rule that applies decides: `allowed`, `ask`,
`violation`; none: `unknown`, which means ask.

Steps: `read` (the project's almanac, then the universal one) → `categorize`
→ `judge`.
