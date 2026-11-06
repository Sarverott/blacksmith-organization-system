#!/usr/bin/env node
// bos <model> <tool> [operands] [--flags]  ·  bos help  ·  bos --version  ·  bos (a REPL)
// One command per run: read the arguments, run the tool on BOS, print what it returned.
// Without a command in a terminal (or with --repl): a REPL, each line one <model> <tool>.
import { createInterface } from "node:readline";
import { BOS } from "./bos.ts";
import { JsonFile } from "./core/json-file.ts";
import { packagePath } from "./core/paths.ts";
import { type Input, inputFor, parseArgs, splitLine, type Tool } from "./core/tool.ts";
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

// one command: bos <model> <tool> [operands] [--flags]
async function command(argv: string[], signal: AbortSignal): Promise<number> {
  const { operands, flags } = parseArgs(argv);
  const { workshop, json, repl: _repl, ...toolFlags } = flags;
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
  const result = await entry.run(bos, input, { print: (line) => console.log(line), signal });
  print(entry, result, input, Boolean(json));
  return 0;
}

const failure = (error: unknown) =>
  `bos: ${error instanceof Error ? error.message : String(error)}`;

// the REPL: each line is one command, with the flags bos was started with (--workshop=…);
// a failed command says why and the next line comes; exit, quit or Ctrl+D ends it.
// Ctrl+C stops the running tool (bos workshop watch), at the prompt it ends the REPL.
async function repl(startFlags: string[]): Promise<number> {
  const terminal = Boolean(process.stdin.isTTY);
  const lines = createInterface({ input: process.stdin, output: process.stdout, terminal });
  if (terminal) {
    console.log(`bos ${manifest.data.version}: <model> <tool> [operands] [--flags], help, exit`);
  }
  const prompt = () => terminal && lines.prompt();
  lines.setPrompt("bos> ");
  let running: AbortController | null = null;
  lines.on("SIGINT", () => (running ? running.abort() : lines.close()));
  let failed = 0;
  prompt();
  for await (const line of lines) {
    const argv = splitLine(line);
    if (argv[0] === "exit" || argv[0] === "quit") {
      break;
    }
    if (argv.length) {
      running = new AbortController();
      try {
        await command([...argv, ...startFlags], running.signal);
      } catch (error) {
        failed++;
        console.error(failure(error));
      }
      running = null;
    }
    prompt();
  }
  lines.close();
  // piped lines (bos --repl < commands): the exit code says whether any of them failed
  return failed ? 1 : 0;
}

async function main(argv: string[]): Promise<number> {
  const { operands, flags } = parseArgs(argv);
  if (flags.repl || (!operands.length && !flags.version && process.stdin.isTTY)) {
    return repl(argv.filter((arg) => arg.startsWith("--") && arg !== "--repl"));
  }
  // Ctrl+C stops a long tool (bos workshop watch) cleanly instead of killing it
  const stop = new AbortController();
  process.once("SIGINT", () => stop.abort());
  return command(argv, stop.signal);
}

loadCheckoutEnv();
main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(failure(error));
    process.exitCode = 1;
  },
);
