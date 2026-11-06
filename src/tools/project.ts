// bos project <tool>: the project around the current directory
import { tool } from "../core/tool.ts";
import { creditText } from "../views/crediting.ts";
import { sealText } from "../views/sealing.ts";

const dirArg = {
  name: "dir",
  type: "string" as const,
  info: "a path inside the project, or a directory outside any repository: an area (default: current directory)",
};

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
  tool({
    model: "project",
    name: "omnis",
    info: "the project's halo (.bos/.omnis.toml) now against the sealed one: what was added, changed, removed",
    readOnly: true,
    args: [dirArg],
    run: (bos, input) => bos.omnis({ dir: input.dir as string | undefined }),
    render: sealText,
  }),
  tool({
    model: "project",
    name: "seal",
    info: "write the project's halo into .bos/.omnis.toml (only when something changed)",
    readOnly: false,
    args: [dirArg, { name: "dryRun", type: "boolean", info: "only say what would be written" }],
    run: (bos, input) =>
      bos.omnis({
        dir: input.dir as string | undefined,
        seal: true,
        dryRun: Boolean(input.dryRun),
      }),
    render: sealText,
  }),
];
