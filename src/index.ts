// Library entry.
//   import { BOS, NodeHost } from "blacksmith-organization-system";
//   const bos = new BOS(new NodeHost());
//   await bos.bootstrap();  const report = await bos.inspect();
export { type Context, createContext, createIfMissing, type TraceEntry } from "./core/context.ts";
export { Element, type ElementClass, type ElementNode } from "./core/element.ts";
export type { Change, Entry, Host } from "./core/host.ts";
export * as paths from "./core/paths.ts";
export { Procedure, type Step } from "./core/procedure.ts";
export { type Arg, type Input, type IO, inputFor, parseArgs, type Tool, tool } from "./core/tool.ts";
export { bumpGrih, bumpSemver, EVENTS, GRIH_START, isLoopEvent, type LoopEvent } from "./core/version.ts";
export { NodeHost } from "./hosts/node.ts";
export { BOS, type BOSOptions, type WatchOptions } from "./main.ts";
export * from "./models/_index.ts";
export * from "./procedures/_index.ts";
export { findTool, TOOLS } from "./tools/_index.ts";
