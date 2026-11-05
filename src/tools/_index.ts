// Every tool of the core, in the order `bos help` shows them.
import type { Tool } from "../core/tool.ts";
import { devlogTools } from "./devlog.ts";
import { scopeTools } from "./scope.ts";
import { versionTools } from "./version.ts";
import { workshopTools } from "./workshop.ts";

export const TOOLS: Tool[] = [...workshopTools, ...scopeTools, ...devlogTools, ...versionTools];

export function findTool(model: string | undefined, name: string | undefined): Tool {
  const entry = TOOLS.find((t) => t.model === model && t.name === name);
  if (entry) return entry;
  const models = [...new Set(TOOLS.map((t) => t.model))];
  if (!models.includes(String(model))) throw new Error(`unknown model "${model}" (models: ${models.join(", ")})`);
  const names = TOOLS.filter((t) => t.model === model).map((t) => t.name);
  throw new Error(`${model} has no tool "${name}" (tools: ${names.join(", ")})`);
}
