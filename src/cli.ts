#!/usr/bin/env node
// bos <model> <tool> [operands] [--flags]  ·  bos help  ·  bos --version
// One command per run: read the arguments, run the tool on BOS, print what it returned.
import { BOS } from "./bos.ts";
import { JsonFile } from "./core/json-file.ts";
import { packagePath } from "./core/paths.ts";
import { type Input, inputFor, parseArgs, type Tool } from "./core/tool.ts";
import { NodeHost } from "./hosts/node.ts";
import { findTool, TOOLS } from "./tools/_index.ts";
import { helpText } from "./views/help.ts";

const host = new NodeHost();
const manifest = new JsonFile<{ version: string }>(host, packagePath("package.json"));

// A checkout of the core may carry its own .env (see .env.example): the workshop it is developed
// against, e.g. WORKSHOP_ROOT on a test partition, so the home workshop stays out of sight.
// An installed package has none; variables already set in the shell win.
function loadCheckoutEnv(): void {
  const file = packagePath(".env");
  if (host.exists(file)) {
    process.loadEnvFile(file);
  }
}

// A tool that has its own --json flag streams: it prints its lines (JSON lines with --json)
// while it runs, and what it returns at the end is only a summary.
function streams(entry: Tool): boolean {
  return entry.args.some((arg) => arg.name === "json");
}

// What a tool returned, to the terminal:
// - a streaming tool printed its data already: its summary goes to stderr, stdout stays data
// - --json: the result as JSON
// - otherwise: the tool's text for people (its render), or JSON when it has none
function print(entry: Tool, result: unknown, input: Input, json: boolean): void {
  const asJson = JSON.stringify(result ?? null, null, 2);
  const forPeople = entry.render ? entry.render(result as never, input) : asJson;
  if (streams(entry)) {
    console.error(forPeople);
  } else {
    console.log(json ? asJson : forPeople);
  }
}

async function main(argv: string[]): Promise<number> {
  const { operands, flags } = parseArgs(argv);
  const { workshop, json, ...toolFlags } = flags;
  const [model, name, ...rest] = operands;

  if (flags.version) {
    console.log(manifest.data.version);
    return 0;
  }
  if (!model || model === "help") {
    console.log(helpText(TOOLS, manifest.data.version));
    return 0;
  }

  const entry = findTool(model, name);
  if (json && streams(entry)) {
    // a streaming tool takes --json itself: its lines become JSON lines
    toolFlags.json = json;
  }
  const input = inputFor(entry, rest, toolFlags);
  const bos = new BOS(host, { workshop: typeof workshop === "string" ? workshop : undefined });

  // Ctrl+C stops a long tool (bos workshop watch) cleanly instead of killing it
  const stop = new AbortController();
  process.once("SIGINT", () => stop.abort());

  const result = await entry.run(bos, input, {
    print: (line) => console.log(line),
    signal: stop.signal,
  });
  print(entry, result, input, Boolean(json));
  return 0;
}

loadCheckoutEnv();
main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(`bos: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  },
);
