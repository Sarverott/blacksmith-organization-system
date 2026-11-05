// docs/devlog/STATE.md: where the project stands, made by `bos devlog state` (never edited by hand).
import type { Phase } from "../models/devlog/class.ts";

export type DevlogState = {
  project: string;
  branch: string | null;
  version: string | null;
  phases: Phase[];
  questions: string[];
  proposals: string[];
  waiting: { orders: boolean; inquiries: boolean };
  missing: string[];
};

export function stateMarkdown(state: DevlogState): string {
  const phase = (p: Phase) =>
    `| ${p.number}: ${p.title} | ${p.done}/${p.total} | ${p.complete ? "complete" : p.done ? "in progress" : "not started"} |`;
  const list = (items: string[]) => (items.length ? items.map((item) => `- ${item}`).join("\n") : "None.");
  return `# State of development

Made by \`bos devlog state\` (\`task devlog:state\`); not kept in git, never edited by hand.

| | |
| --- | --- |
| Project | \`${state.project}\` |
| Branch | \`${state.branch ?? "(none)"}\` |
| Version | ${state.version ? `\`${state.version}\`` : "(none declared)"} |
| Orders waiting | ${state.waiting.orders ? "**yes**: ORDERS.md" : "no"} |
| Inquiries waiting | ${state.waiting.inquiries ? "**yes**: INQUIRIES.md" : "no"} |

## Phases

| Phase | Done | |
| --- | --- | --- |
${state.phases.map(phase).join("\n")}

## Open questions

${list(state.questions)}

## Open proposals

${list(state.proposals)}
${state.missing.length ? `\n## Missing devlog files\n\n${list(state.missing)}\n` : ""}`;
}
