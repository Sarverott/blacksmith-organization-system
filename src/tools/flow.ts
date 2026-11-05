// bos flow <tool>: the craft loop of the project around the current directory
import { tool } from "../core/tool.ts";
import { bumpText, explainText, outcomeText, stepText } from "../views/flow.ts";

const dirArg = { name: "dir", type: "string", info: "a path inside the project (default: current directory)" } as const;
const dryRunArg = { name: "dryRun", type: "boolean", info: "only say what would be done on GitHub" } as const;
const dir = (value: unknown) => value as string | undefined;

export const flowTools = [
  tool({
    model: "flow",
    name: "explain",
    info: "the project's craft loop (.github/bos.json): every forward step, what merges by itself, the bumps",
    args: [dirArg],
    run: (bos, input) => {
      const { loop, versioning } = bos.settings(dir(input.dir));
      return { source: loop.source, steps: loop.steps(), data: loop.data, versioning };
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
  tool({
    model: "flow",
    name: "bump",
    info: "bump the project's version for work landing on a station (.github/bos.json versioning); only once the line it leaves is released",
    readOnly: false,
    args: [
      {
        name: "station",
        type: "string",
        info: "the branch the work landed on, e.g. revision",
        positional: true,
        required: true,
      },
      dirArg,
      { name: "dryRun", type: "boolean", info: "only say what the version would become" },
    ],
    run: (bos, input) => bos.bump(String(input.station), { dir: dir(input.dir), dryRun: Boolean(input.dryRun) }),
    render: bumpText,
  }),
  tool({
    model: "flow",
    name: "bump-commit",
    info: "bump the version for one commit on a contributor's branch (versioning.commits; the pre-commit hook runs it)",
    readOnly: false,
    args: [dirArg, { name: "dryRun", type: "boolean", info: "only say what the version would become" }],
    run: (bos, input) => bos.bumpCommit({ dir: dir(input.dir), dryRun: Boolean(input.dryRun) }),
    render: bumpText,
  }),
  tool({
    model: "flow",
    name: "merge-version",
    info: "git merge driver of package.json and its lock: the higher version on every side, then a three-way merge",
    readOnly: false,
    args: [
      { name: "base", type: "string", info: "the common ancestor's file (%O)", positional: true, required: true },
      { name: "ours", type: "string", info: "our file, the result goes here (%A)", positional: true, required: true },
      { name: "theirs", type: "string", info: "their file (%B)", positional: true, required: true },
      dirArg,
    ],
    run: async (bos, input) => {
      const outcome = await bos.mergeVersion(String(input.base), String(input.ours), String(input.theirs), {
        dir: dir(input.dir),
      });
      // a conflict must fail the driver, so git leaves the file conflicted
      if (outcome.action === "conflict") throw new Error(`conflicts besides the version (${outcome.version})`);
      return outcome;
    },
    render: (outcome) => `merged; version ${outcome.version ?? "none"}`,
  }),
];
