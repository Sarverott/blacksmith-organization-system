# BRAINSTORM: open questions

Questions for the owner, `## Q<n>. <title>`, each with a *Lean:* (what the
agent would pick). Answer in [ORDERS.md](ORDERS.md); answered questions move
word for word into `docs/changelog/phase-<n>.md` with their **Decision:**.
Q1–Q5 are answered in phase 0 of the changelog, Q6–Q9 in phase 1, Q10–Q15
in phase 2.

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

