// What `bos scope create`, `bos project create | import` made, as text for people.
import type { CreateOutcome } from "../procedures/index.ts";

export function createText(outcome: CreateOutcome & { dryRun?: boolean }): string {
  const what = outcome.kind === "scope" ? "scope" : "project";
  const lines = [
    `${what} ${outcome.path}${outcome.existed && outcome.kind !== "import" ? " (it was there: only what was missing)" : ""}`,
  ];
  if (outcome.url) {
    lines.push(`  from ${outcome.url}`);
  }
  lines.push(
    ...(outcome.changes.length
      ? outcome.changes.map((path) => `  + ${path}`)
      : ["  nothing was missing"]),
  );
  if (outcome.anatomy?.missing.length) {
    lines.push(
      `  anatomy missing: ${outcome.anatomy.missing.join(", ")}${outcome.kind === "import" ? " (--seed adds it)" : ""}`,
    );
  }
  if (outcome.workspace) {
    lines.push(`  workspace: ${outcome.workspace}`);
  }
  return lines.join("\n");
}
