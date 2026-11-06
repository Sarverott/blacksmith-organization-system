// bos almanac <tool>: the rules of the environment and the situations met before
import { tool } from "../core/tool.ts";
import { judgeText, recallText, rulesText } from "../views/almanac.ts";

const dirArg = {
  name: "dir",
  type: "string" as const,
  info: "a path inside the project whose docs/almanac/ comes first (default: current directory)",
};

export const almanacTools = [
  tool({
    model: "almanac",
    name: "rules",
    info: "every ruleset of the almanac (the project's docs/almanac/, then the core's), rule by rule",
    args: [dirArg],
    run: (bos, input) => bos.almanac(input.dir as string | undefined),
    render: rulesText,
  }),
  tool({
    model: "almanac",
    name: "judge",
    info: 'does a case break a rule: in words ("Cleo pushes to master") or JSON ({"action":"push"…})',
    args: [
      {
        name: "case",
        type: "string",
        info: "the case, quoted",
        positional: true,
        required: true,
      },
      dirArg,
    ],
    run: (bos, input) => bos.judge(String(input.case), { dir: input.dir as string | undefined }),
    render: judgeText,
  }),
  tool({
    model: "almanac",
    name: "recall",
    info: "the chains of events met before that hold these events, and what usually comes next",
    args: [
      {
        name: "events",
        type: "string",
        info: "events so far, comma-separated: commit,hook:bump-version",
        positional: true,
        required: true,
      },
      dirArg,
    ],
    run: (bos, input) =>
      bos.recall(
        String(input.events)
          .split(",")
          .map((event) => event.trim())
          .filter(Boolean),
        { dir: input.dir as string | undefined },
      ),
    render: recallText,
  }),
];
