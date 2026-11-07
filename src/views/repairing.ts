// What `bos workshop repair` found beside the workshop and did, as text for people.
import type { RepairOutcome } from "../procedures/index.ts";

export function repairText(outcome: RepairOutcome): string {
  if (!outcome.misplaced.length) {
    return "nothing lies beside the workshop: nothing to repair";
  }
  const verb = outcome.applied ? "" : "would be ";
  const lines = [`areas beside the workshop: ${outcome.misplaced.join(", ")}`];
  lines.push(...outcome.moves.map(({ from, to }) => `  ${verb}moved   ${from} → ${to}`));
  lines.push(...outcome.duplicates.map((path) => `  ${verb}removed ${path} (the same inside)`));
  lines.push(
    ...outcome.scaffolding.map((path) => `  ${verb}removed ${path} (BOS's own, inside already)`),
  );
  lines.push(
    ...outcome.conflicts.map(
      ({ from, to }) => `  kept    ${from} (differs from ${to}: yours to settle)`,
    ),
  );
  if (outcome.applied) {
    lines.push(...outcome.emptied.map((dir) => `  emptied ${dir}`));
  } else {
    lines.push("", "nothing done yet: bos workshop repair --confirm");
  }
  return lines.join("\n");
}
