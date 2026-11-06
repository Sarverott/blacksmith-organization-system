// What `bos almanac <tool>` found, as text for people.
import type { Rule } from "../core/ruling.ts";
import type { Almanac } from "../models/index.ts";
import type { JudgeContext, RecallContext } from "../procedures/index.ts";

const VERDICT = {
  allowed: "ALLOWED",
  ask: "ASK FIRST",
  violation: "VIOLATION",
  unknown: "UNKNOWN",
};

const fields = (subject: Record<string, string | string[]>) =>
  Object.entries(subject)
    .map(([field, value]) => `${field}=${Array.isArray(value) ? value.join(",") : value}`)
    .join("  ");

const ruleLine = (rule: Rule & { ruleset: string }) =>
  `${rule.ruleset}/${rule.id}: ${rule.statement}${rule.source ? `  (${rule.source})` : ""}`;

export function judgeText({ judgement }: JudgeContext): string {
  if (!judgement) {
    return "no judgement";
  }
  const lines = [`${VERDICT[judgement.verdict]}  ${fields(judgement.case)}`];
  if (judgement.rule) {
    lines.push(`  ${ruleLine(judgement.rule)}`);
  } else {
    lines.push("  no rule applies: ask the owner");
  }
  lines.push(...judgement.also.map((rule) => `  also (${rule.verdict}) ${ruleLine(rule)}`));
  return lines.join("\n");
}

export function rulesText(almanac: Almanac): string {
  const lines = [`almanac: ${almanac.places.join(", ")}`];
  for (const { ruleset, rules, roles } of almanac.rulesets) {
    lines.push("", `${ruleset}`);
    for (const [role, names] of Object.entries(roles ?? {})) {
      lines.push(`  role ${role}: ${names.join(", ")}`);
    }
    for (const rule of rules) {
      lines.push(`  ${rule.verdict.padEnd(9)} ${rule.id}: ${rule.statement}`);
    }
  }
  lines.push("", `${almanac.chains.length} chains of events (bos almanac recall <event,event…>)`);
  return lines.join("\n");
}

export function recallText({ events, prediction, chains }: RecallContext): string {
  const lines = [`after ${events.join(" → ")}`];
  if (prediction?.next.length) {
    lines.push(`  next (after ${prediction.after}):`);
    lines.push(
      ...prediction.next.map(
        ({ event, p }) => `    ${(p * 100).toFixed(0).padStart(3)}%  ${event}`,
      ),
    );
  } else {
    lines.push("  nothing known comes next");
  }
  for (const chain of chains) {
    lines.push("", `  ${chain.id}: ${chain.events.join(" → ")}`);
    if (chain.solution) {
      lines.push(`    solved: ${chain.solution}`);
    }
    if (chain.seen?.length) {
      lines.push(`    seen: ${chain.seen.join("; ")}`);
    }
  }
  return lines.join("\n");
}
