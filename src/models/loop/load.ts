// The loop of a project: its own .bos/loop.json, else the default loop.
import type { Host } from "../../core/host.ts";
import { join } from "../../core/paths.ts";
import { Loop } from "./class.ts";
import { DEFAULT_LOOP, type LoopData } from "./data.ts";

export function loopFile(projectPath: string): string {
  return join(projectPath, ".bos", "loop.json");
}

export function loopOf(host: Host, projectPath: string): Loop {
  const file = loopFile(projectPath);
  const text = host.readText(file);
  if (text === null) return new Loop();
  let own: Partial<LoopData>;
  try {
    own = JSON.parse(text);
  } catch (error) {
    throw new Error(`${file} is not JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  // fields left out keep the default
  return new Loop({ ...DEFAULT_LOOP, ...own }, file);
}
