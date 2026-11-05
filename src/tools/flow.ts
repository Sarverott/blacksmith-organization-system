// bos flow <tool>: the craft loop of the project around the current directory
import { tool } from "../core/tool.ts";
import { explainText, outcomeText, stepText } from "../views/flow.ts";

const dirArg = { name: "dir", type: "string", info: "a path inside the project (default: current directory)" } as const;
const dryRunArg = { name: "dryRun", type: "boolean", info: "only say what would be done on GitHub" } as const;
const dir = (value: unknown) => value as string | undefined;

export const flowTools = [
  tool({
    model: "flow",
    name: "explain",
    info: "the project's craft loop: every forward step, and what merges by itself",
    args: [dirArg],
    run: (bos, input) => {
      const { loop } = bos.loop(dir(input.dir));
      return { source: loop.source, steps: loop.steps(), data: loop.data };
    },
    render: explainText,
  }),
  tool({
    model: "flow",
    name: "next",
    info: "the forward step of a branch in the loop (reads only, no GitHub)",
    args: [
      { name: "branch", type: "string", info: "a station or a contributor's branch", positional: true, required: true },
      dirArg,
    ],
    run: (bos, input) => bos.loop(dir(input.dir)).loop.step(String(input.branch)),
    render: (step, input) => (step ? stepText(step) : `${input.branch} is not part of the loop`),
  }),
  tool({
    model: "flow",
    name: "next-pr",
    info: "open on GitHub the pull request of a branch's forward step, unless there is nothing to propose",
    readOnly: false,
    args: [
      { name: "branch", type: "string", info: "the branch that moved", positional: true, required: true },
      dirArg,
      dryRunArg,
    ],
    run: (bos, input) => bos.propose(String(input.branch), { dir: dir(input.dir), dryRun: Boolean(input.dryRun) }),
    render: outcomeText,
  }),
  tool({
    model: "flow",
    name: "automerge",
    info: "merge a loop pull request on GitHub when the loop lets it merge by itself",
    readOnly: false,
    args: [
      { name: "pr", type: "string", info: "the pull request's number", positional: true, required: true },
      dirArg,
      dryRunArg,
    ],
    run: (bos, input) => {
      const number = Number(input.pr);
      if (!Number.isInteger(number) || number < 1) throw new Error(`not a pull request number: ${input.pr}`);
      return bos.automerge(number, { dir: dir(input.dir), dryRun: Boolean(input.dryRun) });
    },
    render: outcomeText,
  }),
];
