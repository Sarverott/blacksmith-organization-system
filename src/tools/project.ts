// bos project <tool>: the project around the current directory
import { tool } from "../core/tool.ts";
import { createText } from "../views/creating.ts";
import { creditText } from "../views/crediting.ts";
import { sealText } from "../views/sealing.ts";

const dirArg = {
  name: "dir",
  type: "string" as const,
  info: "a path inside the project, or a directory outside any repository: an area (default: current directory)",
};

const dryRunArg = {
  name: "dryRun",
  type: "boolean" as const,
  info: "only list what would be made",
};

export const projectTools = [
  tool({
    model: "project",
    name: "create",
    info: "a project in the forge, a git repository on development seeded with the standard anatomy; on one that exists, only what is missing",
    readOnly: false,
    args: [
      {
        name: "project",
        type: "string",
        info: "<scope>/<project> (the scope is made too when missing)",
        positional: true,
        required: true,
      },
      dryRunArg,
    ],
    run: (bos, input) =>
      bos.create("project", String(input.project), { dryRun: Boolean(input.dryRun) }),
    render: createText,
  }),
  tool({
    model: "project",
    name: "import",
    info: "clone a repository into the forge: gh:owner/repo, owner/repo, any git URL or a path",
    readOnly: false,
    args: [
      {
        name: "source",
        type: "string",
        info: "what to clone",
        positional: true,
        required: true,
      },
      { name: "scope", type: "string", info: "the scope (default: the URL's owner, lowercased)" },
      { name: "name", type: "string", info: "the project's name (default: the repository's)" },
      { name: "seed", type: "boolean", info: "add the standard anatomy it lacks" },
      {
        name: "branch",
        type: "string",
        info: "the branch to work on (default: development when it has one)",
      },
      dryRunArg,
    ],
    run: (bos, input) =>
      bos.create("import", String(input.source), {
        scope: input.scope as string | undefined,
        name: input.name as string | undefined,
        seed: Boolean(input.seed),
        branch: input.branch as string | undefined,
        dryRun: Boolean(input.dryRun),
      }),
    render: createText,
  }),
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
