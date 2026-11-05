// The project's own files as text for people.
import type { CreditOutcome } from "../procedures/_index.ts";

export function authorsText(outcome: CreditOutcome): string {
  if (outcome.action === "none") return `${outcome.file}: everyone is named`;
  const verb = outcome.action === "written" ? "" : "would be ";
  return [
    `${outcome.file}: ${outcome.added.length} ${verb}added, ${outcome.updated.length} ${verb}updated`,
    ...outcome.updated.map((text) => `  ~ ${text}`),
    ...outcome.added.map((text) => `  + ${text}`),
  ].join("\n");
}
