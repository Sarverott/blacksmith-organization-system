import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { Devlog, NodeHost } from "../src/index.ts";
import { stateMarkdown } from "../src/views/devlog.ts";
import { tempWorkshop, write } from "./helpers.ts";

function devlogWith(files: Record<string, string>): Devlog {
  const dir = join(tempWorkshop(), "docs/devlog");
  for (const [name, text] of Object.entries(files)) {
    write(join(dir, name), text);
  }
  return new Devlog(new NodeHost(), dir);
}

describe("devlog as data", () => {
  it("counts the phases of TODO.md", () => {
    const devlog = devlogWith({
      "TODO.md":
        "# TODO\n\n## Phase 0: ground\n\n- [x] a\n- [X] b\n\n## Phase 1: work\n\n- [x] c\n- [ ] d\n\n## Phase 2: empty\n",
    });
    expect(devlog.phases()).toEqual([
      { number: 0, title: "ground", done: 2, total: 2, complete: true },
      { number: 1, title: "work", done: 1, total: 2, complete: false },
      { number: 2, title: "empty", done: 0, total: 0, complete: false },
    ]);
  });

  it("lists open questions and proposals", () => {
    const devlog = devlogWith({
      "BRAINSTORM.md": "# B\n\n## Q6. First\n\ntext\n\n## Q7. Second\n",
      "PROPOSALS.md":
        "# P\n\n### PP1 beg\n> from: x\n> label/topic/name/title: naming\n### PP1 end\n",
    });
    expect(devlog.questions()).toEqual(["Q6: First", "Q7: Second"]);
    expect(devlog.proposals()).toEqual(["PP1: naming"]);
  });

  it("knows when the owner wrote below the line", () => {
    const devlog = devlogWith({
      "ORDERS.md": "# ORDERS\n\nheader\n\n---\n",
      "INQUIRIES.md": "# I\n\n---\n\n## do it\n",
    });
    expect(devlog.waiting("ORDERS.md")).toBe(false);
    expect(devlog.waiting("INQUIRIES.md")).toBe(true);
    expect(devlog.missingFiles()).toContain("TODO.md");
  });

  it("tells a phase not started from one in progress", () => {
    const phases = devlogWith({
      "TODO.md": "## Phase 1: a\n\n- [x] x\n- [ ] y\n\n## Phase 2: b\n\n- [ ] z\n",
    }).phases();
    const text = stateMarkdown({
      project: "p",
      branch: null,
      version: null,
      phases,
      questions: [],
      proposals: [],
      waiting: { orders: false, inquiries: false },
      missing: [],
    });
    expect(text).toContain("| 1: a | 1/2 | in progress |");
    expect(text).toContain("| 2: b | 0/1 | not started |");
  });
});
