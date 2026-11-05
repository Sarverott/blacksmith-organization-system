# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q11
in phase 2; Q12 is open.

## Q12. What is a "stable LTS full release"?

The owner's container workflows publish "only stable LTS full release". The
core has full releases and pre-releases (Q7: pre-releases while npm is
`next`), but no LTS line.

- a) every full release (not a pre-release) is stable; LTS means nothing
  more for now;
- b) LTS is a marked release line, e.g. `versioning.lts` in
  `.github/bos.json` (a major or `major.minor`), and only it gets images;
- c) LTS follows a calendar (like Node's even majors).

*Lean:* a) now (the workflows do it), b) once two majors live side by side.
