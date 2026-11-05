// Library entry: everything the core offers, in the order it is built.
//   import { BOS, NodeHost } from "blacksmith-organization-system";
//   const bos = new BOS(new NodeHost());
//   await bos.bootstrap();  const report = await bos.inspect();
//   const craftbook = new BOS.Craftbook(bos.host, "/path/to/__WORKSHOP/craftbook");
// biome-ignore-all assist/source/organizeImports: the sections are in reading order

// the spine: one object, every procedure as a method, every model as BOS.<Model>
export { BOS, type BOSOptions, type WatchOptions } from "./bos.ts";

// the machine: the one door to it (Host, NodeHost) and the outside systems through it
export type { Change, Entry, Host, RunResult } from "./core/host.ts";
export { NodeHost, WATCH_LIMIT } from "./hosts/node.ts";
export * from "./bridges/index.ts";

// the parts everything is made of (src/core/)
export * from "./core/context.ts";
export * from "./core/element.ts";
export * from "./core/emitter.ts";
export * from "./core/json-file.ts";
export * as paths from "./core/paths.ts";
export * from "./core/procedure.ts";
export * from "./core/serialize.ts";
export * from "./core/tool.ts";
export * from "./core/version.ts";

// the glossary as classes, every procedure, every `bos <model> <tool>`
export * from "./models/index.ts";
export * from "./procedures/index.ts";
export { findTool, TOOLS } from "./tools/_index.ts";
