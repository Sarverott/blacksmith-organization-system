// docs/devlog of a project: the plan and the talk between the owner and the agents
// (docs/devlog/README.md). Read as data, so the loop can tell where a project stands:
// which phase is complete (a Y / I bump), which questions are open, what waits.
import { Element } from "../../core/element.ts";

export type Phase = { number: number; title: string; done: number; total: number; complete: boolean };

export const DEVLOG_FILES = [
  "README.md",
  "VISION.md",
  "ROADMAP.md",
  "TODO.md",
  "BRAINSTORM.md",
  "PROPOSALS.md",
  "ORDERS.md",
  "INQUIRIES.md",
];

export class Devlog extends Element {
  static type = "devlog";
  static dirname = "docs/devlog";

  text(name: string): string {
    return this.host.readText(this.file(name)) ?? "";
  }

  // "## Phase <n>: <title>" headings of TODO.md and their "- [x]" / "- [ ]" items
  phases(): Phase[] {
    const phases: Phase[] = [];
    for (const line of this.text("TODO.md").split("\n")) {
      const heading = line.match(/^## Phase (\d+): (.+?)\s*$/);
      if (heading) {
        phases.push({ number: Number(heading[1]), title: heading[2] ?? "", done: 0, total: 0, complete: false });
        continue;
      }
      const item = line.match(/^\s*- \[( |x|X)\]/);
      const current = phases[phases.length - 1];
      if (item && current) {
        current.total++;
        if (item[1] !== " ") current.done++;
      }
    }
    for (const phase of phases) phase.complete = phase.total > 0 && phase.done === phase.total;
    return phases;
  }

  // "## Q<n>. <title>" of BRAINSTORM.md
  questions(): string[] {
    return [...this.text("BRAINSTORM.md").matchAll(/^## (Q\d+)\.\s*(.*)$/gm)].map((m) => `${m[1]}: ${m[2]}`);
  }

  // "### PP<n> beg" of PROPOSALS.md, with its title line
  proposals(): string[] {
    return [
      ...this.text("PROPOSALS.md").matchAll(/^### (PP\d+) beg\s*$(?:[\s\S]*?label\/topic\/name\/title:\s*(.*)$)?/gm),
    ].map((m) => `${m[1]}${m[2] ? `: ${m[2]}` : ""}`);
  }

  // ORDERS.md and INQUIRIES.md keep a header; what the owner wrote below the first "---" waits
  waiting(name: "ORDERS.md" | "INQUIRIES.md"): boolean {
    const [, ...below] = this.text(name).split(/^---\s*$/m);
    return below.join("").trim().length > 0;
  }

  missingFiles(): string[] {
    return DEVLOG_FILES.filter((name) => !this.host.exists(this.file(name)));
  }
}
