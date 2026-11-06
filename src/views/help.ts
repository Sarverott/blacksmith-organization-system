// `bos help`: every tool, from the tool registry itself.
//
//   bos workshop status [--all]
//       inspect the whole workshop: areas, scopes, projects, findings (reads only)
//         --all: show notes too, not only errors and warnings
import type { Arg, Tool } from "../core/tool.ts";

// how an argument is written: <operand>, --flag, --option=<value>; [in brackets] when optional
function argShape(arg: Arg): string {
  let shape = `--${arg.name}=<value>`;
  if (arg.positional) {
    shape = `<${arg.name}>`;
  } else if (arg.type === "boolean") {
    shape = `--${arg.name}`;
  }
  return arg.required ? shape : `[${shape}]`;
}

function usage(entry: Tool): string {
  return [`bos ${entry.model} ${entry.name}`, ...entry.args.map(argShape)].join(" ");
}

// a tool: its usage, what it does, then each argument
function toolLines(entry: Tool): string[] {
  const writes = entry.readOnly ? "" : "  (writes)";
  const args = entry.args.map((arg) => {
    const name = arg.positional ? arg.name : `--${arg.name}`;
    return `        ${name}: ${arg.info}`;
  });
  return [`  ${usage(entry)}`, `      ${entry.info}${writes}`, ...args];
}

export function helpText(tools: Tool[], version: string): string {
  return [
    `bos ${version}: the Blacksmith Organization System core`,
    "",
    "usage: bos <model> <tool> [operands] [--flags]   common flags: --workshop=<path> --json",
    "       bos (in a terminal) or bos --repl: one <model> <tool> per line, exit to end",
    "",
    ...tools.flatMap(toolLines),
  ].join("\n");
}
