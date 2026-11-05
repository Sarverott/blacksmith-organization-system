import { describe, expect, it } from "vitest";

import { BOS, NodeHost, type RunResult } from "../src/index.ts";
import { gitRepo, tempWorkshop } from "./helpers.ts";

type Reply = string | ((args: string[]) => string);

// a host whose `gh` answers from a script: the first key that the joined arguments start with
class ScriptedGitHub extends NodeHost {
  readonly calls: string[] = [];
  readonly script: [string, Reply][];
  constructor(script: [string, Reply][]) {
    super();
    this.script = script;
  }
  override env(name: string): string | undefined {
    return name === "GITHUB_REPOSITORY" ? "o/r" : undefined;
  }
  override run(command: string, args: string[]): RunResult {
    const line = args.join(" ");
    this.calls.push(`${command} ${line}`);
    const found = this.script.find(([key]) => line.startsWith(key));
    if (!found) {
      return { status: 1, stdout: "", stderr: `unscripted: ${line}` };
    }
    const reply = found[1];
    return { status: 0, stdout: typeof reply === "string" ? reply : reply(args), stderr: "" };
  }
}

function project(): string {
  const dir = `${tempWorkshop()}/p`;
  gitRepo(dir);
  return dir;
}

const compare = (aheadBy: number, ...commits: [number, string][]) =>
  JSON.stringify({
    ahead_by: aheadBy,
    commits: commits.map(([parents, message]) => ({
      parents: Array(parents).fill({}),
      commit: { message },
    })),
  });

describe("flow: proposing", () => {
  it("opens the forward step's pull request, saying whether it merges by itself", async () => {
    const host = new ScriptedGitHub([
      ["api repos/o/r/compare/revision...development", compare(2, [1, "feat: x"], [2, "Merge"])],
      ["pr list", "[]"],
      ["pr create", "https://github.com/o/r/pull/7\n"],
    ]);
    const outcome = await new BOS(host).propose("development", { dir: project() });
    expect(outcome).toMatchObject({ action: "opened", pullRequest: 7, step: { to: "revision" } });
    const create = host.calls.find((call) => call.includes("pr create")) ?? "";
    expect(create).toContain("--head development --base revision");
    expect(create).toContain("Merges by itself once checked: **yes**");
  });

  it("plans only, on a dry run", async () => {
    const host = new ScriptedGitHub([
      ["api", compare(1, [1, "fix: y"])],
      ["pr list", "[]"],
    ]);
    const outcome = await new BOS(host).propose("dev/Cleo", { dir: project(), dryRun: true });
    expect(outcome).toMatchObject({
      action: "would-open",
      step: { to: "development", automerge: false },
    });
    expect(host.calls.some((call) => call.includes("pr create"))).toBe(false);
  });

  it("proposes nothing new, only bumps and merges, or an open one again", async () => {
    const empty = await new BOS(new ScriptedGitHub([["api", compare(0)]])).propose("revision", {
      dir: project(),
    });
    expect(empty.reason).toMatch(/nothing new/);
    const bumps = new ScriptedGitHub([
      ["api", compare(2, [2, "Merge"], [1, "chore(release): 1.0.1"])],
    ]);
    expect((await new BOS(bumps).propose("testing", { dir: project() })).reason).toMatch(
      /only merges/,
    );
    const back = new ScriptedGitHub([
      ["api", compare(1, [1, "chore(release): 1.0.1"])],
      ["pr list", "[]"],
    ]);
    expect((await new BOS(back).propose("master", { dir: project(), dryRun: true })).action).toBe(
      "would-open",
    );
    const open = new ScriptedGitHub([
      ["api", compare(1, [1, "feat: z"])],
      ["pr list", '[{"number":3}]'],
    ]);
    expect(await new BOS(open).propose("development", { dir: project() })).toMatchObject({
      action: "exists",
      pullRequest: 3,
    });
  });

  it("leaves branches outside the loop alone, without asking GitHub", async () => {
    const host = new ScriptedGitHub([]);
    expect((await new BOS(host).propose("feature/x", { dir: project() })).reason).toMatch(
      /not part of the loop/,
    );
    expect(host.calls).toEqual([]);
  });
});

describe("flow: automerging", () => {
  const view = (head: string, base: string, extra: object = {}) =>
    JSON.stringify({
      number: 5,
      state: "OPEN",
      headRefName: head,
      baseRefName: base,
      isCrossRepository: false,
      ...extra,
    });

  it("merges a forward step whose automerge is on", async () => {
    const host = new ScriptedGitHub([
      ["pr view", view("revision", "testing")],
      ["pr merge", ""],
    ]);
    expect(await new BOS(host).automerge(5, { dir: project() })).toMatchObject({
      action: "merged",
    });
    expect(host.calls).toContain("gh pr merge 5 --merge");
  });

  it("leaves to a person: releases, contributors, forks, other directions, closed ones", async () => {
    const cases: [string, RegExp][] = [
      [view("releasing", "master"), /automerge is off/],
      [view("dev/Cleo", "development"), /automerge is off/],
      [view("revision", "testing", { isCrossRepository: true }), /fork/],
      [view("testing", "rejection"), /not a forward step/],
      [view("revision", "testing", { state: "MERGED" }), /is merged/],
    ];
    for (const [reply, reason] of cases) {
      const host = new ScriptedGitHub([["pr view", reply]]);
      expect((await new BOS(host).automerge(5, { dir: project() })).reason).toMatch(reason);
      expect(host.calls.some((call) => call.includes("pr merge"))).toBe(false);
    }
  });
});
