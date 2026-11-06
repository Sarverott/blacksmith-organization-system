// The almanac: rulesets judged by code, chains of events remembered.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BOS,
  categorize,
  globMatches,
  judgeCase,
  learn,
  NodeHost,
  PACKAGE_ALMANAC,
  predict,
  type Ruleset,
  readAlmanac,
  recall,
} from "../src/index.ts";
import { write } from "./helpers.ts";

const bos = new BOS(new NodeHost());
const universal = readAlmanac(new NodeHost(), [PACKAGE_ALMANAC]);

// every universal rule, reached by a case told in words
const SAID: [string, string, string][] = [
  ["Cleo commits with --no-verify", "never-skip-hooks", "violation"],
  ["Sett commits on master", "never-commit-on-master", "violation"],
  ["publish the docs from the gitlab mirror", "mirrors-never-publish", "violation"],
  ["delete forge", "workshop-areas-stay", "violation"],
  ["cat .env", "never-reveal-secrets", "violation"],
  ["Cleo reverts the owner's edit", "never-revert-the-owner", "violation"],
  ["Cleo edits another repository", "other-repositories-get-notes", "violation"],
  ["test it on ~/__WORKSHOP", "tests-in-temporary-workshops", "violation"],
  ["bootstrap ~/__WORKSHOP", "home-workshop-only-when-asked", "ask"],
  ["Cleo opens a PR", "agents-open-no-pull-request", "violation"],
  ["Cleo pushes development and dev/Cleo", "agents-push-their-branches", "allowed"],
  ["Cleo pushes master", "protected-branches-ask", "ask"],
  ["Cleo publishes to npm", "tags-releases-publishing-ask", "ask"],
  ["Cleo changes the remotes", "remotes-and-settings-ask", "ask"],
  ["send the email to a service", "email-stays-private", "ask"],
  ["settle the question in code", "questions-are-not-settled-in-code", "violation"],
];

describe("almanac: rulesets", () => {
  it("matches globs whole, ignoring case", () => {
    expect(globMatches("dev/*", "dev/Cleo")).toBe(true);
    expect(globMatches("dev/*", "development")).toBe(false);
    expect(globMatches("master", "MASTER")).toBe(true);
  });

  it("lets the first rule that applies decide, unless says when it does not apply", () => {
    const rulesets: Ruleset[] = [
      {
        ruleset: "t",
        rules: [
          {
            id: "a",
            statement: "",
            when: { action: "push" },
            unless: { target: "safe" },
            verdict: "ask",
          },
          { id: "b", statement: "", when: { action: "push" }, verdict: "allowed" },
        ],
      },
    ];
    const pushed = judgeCase(rulesets, { action: "push", target: "x" });
    expect(pushed.verdict).toBe("ask");
    expect(pushed.also.map((rule) => rule.id)).toEqual(["b"]);
    expect(judgeCase(rulesets, { action: "push", target: "safe" }).rule?.id).toBe("b");
    expect(judgeCase(rulesets, { action: "pull" }).verdict).toBe("unknown");
  });

  it("puts a case in words into fields, by the words the rulesets use", () => {
    const rulesets: Ruleset[] = [
      {
        ruleset: "t",
        roles: { agent: ["Cleo"] },
        rules: [
          {
            id: "a",
            statement: "",
            when: { action: ["push", "publish"], target: ["master", "dev/*"] },
            verdict: "ask",
          },
        ],
      },
    ];
    expect(categorize("Cleo pushed master and dev/Cleo", rulesets)).toEqual({
      action: "push",
      target: ["master", "dev/Cleo"],
      actor: "Cleo",
      role: "agent",
    });
    expect(categorize("publishing", rulesets)).toEqual({ action: "publish" });
    // "pusher" is not an inflection; the given fields win
    expect(categorize("pusher", rulesets, { action: "pull" })).toEqual({ action: "pull" });
  });

  it("has every universal rule well formed and reachable in words", async () => {
    const [ruleset] = universal.rulesets;
    const ids = ruleset?.rules.map((rule) => rule.id) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(SAID.map(([, id]) => id))).toEqual(new Set(ids));
    for (const [words, id, verdict] of SAID) {
      const { judgement } = await bos.judge(words);
      expect({ words, id: judgement?.rule?.id, verdict: judgement?.verdict }).toEqual({
        words,
        id,
        verdict,
      });
    }
  });

  it("puts the project's almanac before the universal one", async () => {
    const project = mkdtempSync(join(tmpdir(), "bos-almanac-"));
    write(
      join(project, "docs/almanac/rulesets/own.json"),
      JSON.stringify({
        ruleset: "own",
        rules: [{ id: "frozen", statement: "", when: { action: "push" }, verdict: "violation" }],
      }),
    );
    const { judgement } = await bos.judge(
      { role: "agent", action: "push", target: "development" },
      {
        dir: project,
      },
    );
    expect(judgement?.rule?.id).toBe("frozen");
    expect(judgement?.also[0]?.id).toBe("agents-push-their-branches");
  });
});

describe("almanac: patterning", () => {
  const chains = [
    { id: "a", events: ["commit", "bump", "push", "lint-failed"], seen: ["1", "2"] },
    { id: "b", events: ["commit", "bump", "header-too-long"] },
    { id: "c", events: ["push", "rejected"] },
  ];

  it("gives the next events with their probabilities, from the longest context known", () => {
    const patterns = learn(chains);
    expect(predict(patterns, ["commit", "bump"]).next).toEqual([
      { event: "push", p: 2 / 3 },
      { event: "header-too-long", p: 1 / 3 },
    ]);
    // "bump → push" was seen; after "x → push" only "push" is known
    expect(predict(patterns, ["x", "push"])).toEqual({
      after: "push",
      next: [
        { event: "lint-failed", p: 2 / 3 },
        { event: "rejected", p: 1 / 3 },
      ],
    });
    expect(predict(patterns, ["never"]).next).toEqual([]);
  });

  it("recalls the chains that hold the events, in order, those with more first", () => {
    expect(recall(chains, ["bump", "push"]).map((chain) => chain.id)).toEqual(["a", "b", "c"]);
    expect(recall(chains, ["push", "rejected"]).map((chain) => chain.id)).toEqual(["c", "a"]);
    expect(recall(chains, ["nothing"])).toEqual([]);
  });

  it("remembers what solved a situation met before", async () => {
    const { chains: known, prediction } = await bos.recall(["commit", "hook:bump-version"]);
    expect(known.map((chain) => chain.id)).toContain("commit-header-too-long");
    expect(prediction?.next.map((next) => next.event)).toContain("push:revision");
  });
});
