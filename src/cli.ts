#!/usr/bin/env node
// bos <model> <tool> [operands] [--flags]  ·  bos help  ·  bos --version
import { existsSync, readFileSync } from "node:fs";

import { inputFor, parseArgs } from "./core/tool.ts";
import { NodeHost } from "./hosts/node.ts";
import { BOS } from "./main.ts";
import { findTool, TOOLS } from "./tools/_index.ts";
import { helpText } from "./views/help.ts";

const VERSION: string = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;

// A checkout of the core may carry its own .env (see .env.example): the workshop it is developed
// against, e.g. WORKSHOP_ROOT on a test partition, so the home workshop stays out of sight.
// An installed package has none; variables already set in the shell win.
const CHECKOUT_ENV = new URL("../.env", import.meta.url);
if (existsSync(CHECKOUT_ENV)) process.loadEnvFile(CHECKOUT_ENV);

async function main(argv: string[]): Promise<number> {
  const { operands, flags } = parseArgs(argv);
  const { workshop, json, ...toolFlags } = flags;
  if (flags.version) {
    console.log(VERSION);
    return 0;
  }
  const [model, name, ...rest] = operands;
  if (!model || model === "help") {
    console.log(helpText(TOOLS, VERSION));
    return 0;
  }
  const entry = findTool(model, name);
  if (json && entry.args.some((arg) => arg.name === "json")) toolFlags.json = json;
  const input = inputFor(entry, rest, toolFlags);
  const bos = new BOS(new NodeHost(), { workshop: typeof workshop === "string" ? workshop : undefined });
  const stop = new AbortController();
  process.once("SIGINT", () => stop.abort());
  const result = await entry.run(bos, input, { print: (line) => console.log(line), signal: stop.signal });
  // a streaming tool prints its lines itself; its closing summary goes to stderr, so stdout holds only data
  const streams = entry.args.some((arg) => arg.name === "json");
  const text = entry.render ? entry.render(result as never, input) : JSON.stringify(result ?? null, null, 2);
  if (streams) console.error(text);
  else if (json) console.log(JSON.stringify(result ?? null, null, 2));
  else console.log(text);
  return 0;
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(`bos: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  },
);
