// What `bos archive mirror` did with a clone of the forge, as text for people.
import type { ArchiveOutcome } from "../procedures/index.ts";

const ACTION = {
  none: "nothing done",
  "would-mirror": "would be mirrored",
  mirrored: "mirrored",
  "would-update": "its mirror would be fetched again",
  updated: "its mirror fetched again",
};

const REMOVAL = {
  kept: "the forge copy stays (--confirm removes it)",
  "would-remove": "the forge copy would be removed",
  removed: "the forge copy is removed",
  refused: "the forge copy stays",
};

export function archiveText(outcome: ArchiveOutcome): string {
  const lines = [
    `${outcome.project}`,
    `  → ${outcome.mirror}: ${ACTION[outcome.action]}`,
    `  upstream: ${outcome.upstream ?? "none (no origin)"}`,
  ];
  if (outcome.uncommitted.length) {
    lines.push(`  uncommitted (${outcome.uncommitted.length}):`);
    lines.push(...outcome.uncommitted.slice(0, 10).map((line) => `    ${line}`));
    if (outcome.uncommitted.length > 10) {
      lines.push(`    … ${outcome.uncommitted.length - 10} more`);
    }
  }
  lines.push(`  ${REMOVAL[outcome.removal]}${outcome.reason ? `: ${outcome.reason}` : ""}`);
  return lines.join("\n");
}
