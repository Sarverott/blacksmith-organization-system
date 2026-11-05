// `bos help`: every tool, from the tool registry itself.
import type { Tool } from "../core/tool.ts";

function usage(entry: Tool): string {
  const args = entry.args.map((arg) => {
    const shape = arg.positional
      ? `<${arg.name}>`
      : arg.type === "boolean"
        ? `--${arg.name}`
        : `--${arg.name}=<value>`;
    return arg.required ? shape : `[${shape}]`;
  });
  return [`bos ${entry.model} ${entry.name}`, ...args].join(" ");
}

export function helpText(tools: Tool[], version: string): string {
  const lines = [
    `bos ${version}: the Blacksmith Organization System core`,
    "",
    "usage: bos <model> <tool> [operands] [--flags]   common flags: --workshop=<path> --json",
    "",
  ];
  for (const entry of tools) {
    lines.push(`  ${usage(entry)}`, `      ${entry.info}${entry.readOnly ? "" : "  (writes)"}`);
    for (const arg of entry.args) {
      lines.push(`        ${arg.positional ? arg.name : `--${arg.name}`}: ${arg.info}`);
    }
  }
  return lines.join("\n");
}

// NOTE: is there way to wrap command pipeline management into more compact coding and less messy?
