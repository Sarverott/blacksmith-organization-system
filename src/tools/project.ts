// bos project <tool>: the project around the current directory
import { tool } from "../core/tool.ts";
import { creditText } from "../views/crediting.ts";

export const projectTools = [
  tool({
    model: "project",
    name: "authors",
    info: "name every entity of the commits (people, agents, bots) in .github/AUTHORS; new ones appended",
    readOnly: false,
    args: [
      {
        name: "dir",
        type: "string",
        info: "a path inside the project (default: current directory)",
      },
      { name: "dryRun", type: "boolean", info: "only say what would be written" },
    ],
    run: (bos, input) =>
      bos.authors({ dir: input.dir as string | undefined, dryRun: Boolean(input.dryRun) }),
    render: creditText,
  }),
];
