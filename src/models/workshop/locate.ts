// Finding the active workshop (glossary: workshop → Rules): the first rule that answers wins.
import type { Host } from "../../core/host.ts";
import { basename, dirname, inside, join, normalize } from "../../core/paths.ts";

export const WORKSHOP_DIRNAME = "__WORKSHOP";

export function findAncestorWorkshop(start: string): string | null {
  let dir = normalize(start);
  while (dir !== "/") {
    if (basename(dir) === WORKSHOP_DIRNAME) return dir;
    dir = dirname(dir);
  }
  return null;
}

export type Located = { root: string; source: string };

export function locateWorkshop(host: Host, explicit?: string): Located {
  const absolute = (path: string) => normalize(path.startsWith("/") ? path : join(host.cwd(), path));
  const variable = host.env("BOS_WORKSHOP")?.replace(/^~(?=$|\/)/, host.home());
  const rules: [string, () => string | null | undefined][] = [
    ["--workshop option", () => explicit && absolute(explicit)],
    ["$BOS_WORKSHOP", () => variable && absolute(variable)],
    ["ancestor of the current directory", () => findAncestorWorkshop(host.cwd())],
    ["default per user", () => join(host.home(), WORKSHOP_DIRNAME)],
  ];
  for (const [source, rule] of rules) {
    const root = rule();
    if (root) return { root, source };
  }
  throw new Error("no workshop found");
}

export type Place = { area: string | null; scope?: string | null; project?: string | null; inner?: string | null };

// where a path sits inside a workshop: its area and, in the forge, its scope;
// null when outside. The project needs the scope's tree: Workshop.placeOf resolves it.
export function placeOf(root: string, target: string): Place | null {
  const rel = inside(root, target);
  if (rel === null) return null;
  if (rel === "") return { area: null };
  const [area = null, ...rest] = rel.split("/");
  if (area === "forge") return { area, scope: rest[0] ?? null, inner: rest.slice(1).join("/") || null };
  return { area, inner: rest.join("/") || null };
}
