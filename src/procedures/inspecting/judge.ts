import type { InspectContext } from "./report.ts";
import { RULES } from "./rules.ts";

const ORDER = { error: 0, warning: 1, info: 2 };

export function judge({ report }: InspectContext): void {
  report.findings = RULES.flatMap((rule) => rule(report)).sort((a, b) => ORDER[a.level] - ORDER[b.level]);
}
