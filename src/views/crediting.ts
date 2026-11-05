// What `bos project authors` did to .github/AUTHORS, as text for people.
// (The file's own text is the model's: authorsText in src/models/authors/file.ts.)
import type { CreditOutcome } from "../procedures/index.ts";

export function creditText(outcome: CreditOutcome): string {
  if (outcome.action === "none") {
    return `${outcome.file}: everyone is named`;
  }
  const verb = outcome.action === "written" ? "" : "would be ";
  const head = `${outcome.file}: ${outcome.added.length} ${verb}added, ${outcome.updated.length} ${verb}updated`;
  const updated = outcome.updated.map((entry) => `  ~ ${entry}`);
  const added = outcome.added.map((entry) => `  + ${entry}`);
  return [head, ...updated, ...added].join("\n");
}
