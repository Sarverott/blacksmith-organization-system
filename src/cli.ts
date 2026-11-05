#!/usr/bin/env node
// bos <model> <tool> [operands] [--flags]  ·  bos help  ·  bos --version
import { existsSync, readFileSync } from "node:fs";

import { inputFor, parseArgs } from "./core/tool.ts";
import { NodeHost } from "./hosts/node.ts";
import { BOS } from "./main.ts";
import { findTool, TOOLS } from "./tools/_index.ts";
import { helpText } from "./views/help.ts";

const VERSION: string = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
// NOTE: make that version info reading be adopted to be reusable and more optimized - CHECKOUT_ENV uses same trick with path handling and both should be implemented instead as function in src/core/paths.ts
/*
helpers.jsonfile = {
  constructor(pathname){
    this.filepath=pathname // should be internal protected, if i remember right it was something with `_` or `$`
  }
  // NOTE: handle of `this.data` if can be handled with this or similar handling then let's implement it https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  read(){
    // reads content of json file to this object as parsed
    // uses this.load to write with accesible this.data proxy the variable hidden as _data or something like that
    return this
  }
  get load(){
    // just returns this: JSON.parse(readFileSync( this.filepath , "utf8"))
  }
  set save(data){
    writeFileSync( this.filepath , JSON.parse(data) , "utf8")
  }
  write(){

  }
}


*/


// A checkout of the core may carry its own .env (see .env.example): the workshop it is developed
// against, e.g. WORKSHOP_ROOT on a test partition, so the home workshop stays out of sight.
// An installed package has none; variables already set in the shell win.
const CHECKOUT_ENV = new URL("../.env", import.meta.url); // NOTE: as i see here this can be delegated to helpers
if (existsSync(CHECKOUT_ENV)) process.loadEnvFile(CHECKOUT_ENV);

// NOTE: above way is the dirty ways - find out more elegant approach


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

  // NOTE: this code is obfuscated as hell!!!!!!! it cannot remain like that

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

// NOTE: what about REPL and readline inputs handling? this only handles command invoking as i assume
