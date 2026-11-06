// One tool format for every face of BOS. A tool is the CLI command `bos <model> <name>`,
// its line in `bos help`, and (next) an MCP tool or an OpenAPI operation. Nothing is
// described twice.
import type { BOS } from "../bos.ts";

export type Arg = {
  name: string;
  type: "string" | "boolean";
  info: string;
  positional?: boolean;
  required?: boolean;
};

export type Input = Record<string, string | boolean | undefined>;

// what a tool may use besides BOS: an output for streams, a signal to stop long runs
export type IO = { print: (line: string) => void; signal: AbortSignal };

export type Tool = {
  model: string;
  name: string;
  info: string;
  readOnly: boolean;
  args: Arg[];
  run: (bos: BOS, input: Input, io: IO) => unknown | Promise<unknown>;
  render?: (result: never, input: Input) => string;
};

export function tool<R>(
  definition: Omit<Tool, "run" | "render" | "args" | "readOnly"> & {
    args?: Arg[];
    readOnly?: boolean;
    run: (bos: BOS, input: Input, io: IO) => R | Promise<R>;
    render?: (result: Awaited<R>, input: Input) => string;
  },
): Tool {
  return { args: [], readOnly: true, ...definition } as Tool;
}

// "--dry-run --workshop=/x a b" → flags { dryRun: true, workshop: "/x" }, operands [a, b]
// a line typed in the REPL → its arguments, as a shell would split them: by spaces, with
// "double" or 'single' quotes holding one argument together ('almanac judge "Cleo pushes"')
export function splitLine(line: string): string[] {
  const args: string[] = [];
  for (const match of line.matchAll(/"((?:\\.|[^"\\])*)"|'([^']*)'|(\S+)/g)) {
    const [, double, single, bare] = match;
    args.push(double !== undefined ? double.replace(/\\(.)/g, "$1") : (single ?? bare ?? ""));
  }
  return args;
}

export function parseArgs(argv: string[]): {
  operands: string[];
  flags: Record<string, string | boolean>;
} {
  const flags: Record<string, string | boolean> = {};
  const operands: string[] = [];
  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      operands.push(arg);
      continue;
    }
    const [key = "", value] = arg.slice(2).split(/=(.*)/s);
    flags[key.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())] = value ?? true;
  }
  return { operands, flags };
}

// operands and flags → the tool's input, checked against its args
export function inputFor(
  entry: Tool,
  operands: string[],
  flags: Record<string, string | boolean>,
): Input {
  const input: Input = {};
  const positional = entry.args.filter((arg) => arg.positional);
  positional.forEach((arg, index) => {
    if (operands[index] !== undefined) {
      input[arg.name] = operands[index];
    }
  });
  if (operands.length > positional.length) {
    throw new Error(
      `too many operands for ${entry.model} ${entry.name}: ${operands.slice(positional.length).join(" ")}`,
    );
  }
  for (const arg of entry.args) {
    const value = flags[arg.name];
    if (value === undefined) {
      continue;
    }
    if (arg.type === "boolean") {
      input[arg.name] = value === true || value === "true";
    } else if (value === true) {
      throw new Error(`--${arg.name} needs a value: --${arg.name}=<${arg.name}>`);
    } else {
      input[arg.name] = value;
    }
  }
  const missing = entry.args
    .filter((arg) => arg.required && input[arg.name] === undefined)
    .map((arg) => arg.name);
  if (missing.length) {
    throw new Error(`${entry.model} ${entry.name} needs: ${missing.join(", ")}`);
  }
  return input;
}
