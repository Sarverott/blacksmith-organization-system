// What `bos project omnis` / `seal` found and did with .bos/.omnis.toml, as text for people.
import type { SealOutcome } from "../procedures/index.ts";

const when = (unixusat: number) => new Date(unixusat).toISOString();

export function sealText(outcome: SealOutcome): string {
  const lines = [`${outcome.file}: ${outcome.files} files in the halo`];
  if (outcome.sealedAt === null) {
    lines.push("  never sealed (bos project seal writes it)");
  } else if (outcome.drift) {
    const { added, changed, removed } = outcome.drift;
    lines.push(`  sealed at UNIXUSAT=${outcome.sealedAt} (${when(outcome.sealedAt)})`);
    if (!added.length && !changed.length && !removed) {
      lines.push("  nothing changed since");
    }
    lines.push(...changed.map((path) => `  ~ ${path}`), ...added.map((path) => `  + ${path}`));
    if (removed) {
      lines.push(`  - ${removed} gone (only their hashes were kept)`);
    }
  }
  if (outcome.action === "written") {
    lines.push("  sealed now");
  } else if (outcome.action === "would-write") {
    lines.push("  would be sealed now");
  }
  return lines.join("\n");
}
