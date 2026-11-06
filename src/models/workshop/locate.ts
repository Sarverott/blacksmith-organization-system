// Finding the active workshop (glossary: workshop → Rules): the first rule that answers wins.
import type { Host } from "../../core/host.ts";
import { basename, dirname, inside, join, normalize } from "../../core/paths.ts";

export const WORKSHOP_DIRNAME = "__WORKSHOP";

// $WORKSHOP_RENAME names the workshop directory differently (e.g. ".__WORKSHOP")
export function workshopName(host: Host): string {
  return host.env("WORKSHOP_RENAME")?.trim() || WORKSHOP_DIRNAME;
}

export function findAncestorWorkshop(start: string, name = WORKSHOP_DIRNAME): string | null {
  let dir = normalize(start);
  while (dir !== "/") {
    if (basename(dir) === name) {
      return dir;
    }
    dir = dirname(dir);
  }
  return null;
}

export type Located = { root: string; source: string };

// the workshop itself (--workshop, $BOS_WORKSHOP), or the directory that holds it
// ($WORKSHOP_ROOT, e.g. a partition kept for tests and demonstrations, so the home workshop
// stays private). A workshop is a directory named __WORKSHOP: a --workshop or $BOS_WORKSHOP
// not so named is taken as the directory that holds one, like $WORKSHOP_ROOT (the draft
// snippets gave a partition root and BOS built a second workshop beside __WORKSHOP).
export function locateWorkshop(host: Host, explicit?: string): Located {
  const name = workshopName(host);
  const absolute = (path: string) =>
    normalize(path.startsWith("/") ? path : join(host.cwd(), path));
  const named = (path: string) => {
    const full = absolute(path);
    return basename(full) === name ? full : join(full, name);
  };
  const variable = (name: string) =>
    host
      .env(name)
      ?.trim()
      .replace(/^~(?=$|\/)/, host.home()) || undefined;
  const workshop = variable("BOS_WORKSHOP");
  const root = variable("WORKSHOP_ROOT");
  const rules: [string, () => string | null | undefined][] = [
    ["--workshop option", () => explicit && named(explicit)],
    ["$BOS_WORKSHOP", () => workshop && named(workshop)],
    ["$WORKSHOP_ROOT", () => root && join(absolute(root), name)],
    ["ancestor of the current directory", () => findAncestorWorkshop(host.cwd(), name)],
    ["default per user", () => join(host.home(), name)],
  ];
  for (const [source, rule] of rules) {
    const root = rule();
    if (root) {
      return { root, source };
    }
  }
  throw new Error("no workshop found");
}

export type Place = {
  area: string | null;
  scope?: string | null;
  project?: string | null;
  inner?: string | null;
};

// where a path sits inside a workshop: its area and, in the forge, its scope;
// null when outside. The project needs the scope's tree: Workshop.placeOf resolves it.
export function placeOf(root: string, target: string): Place | null {
  const rel = inside(root, target);
  if (rel === null) {
    return null;
  }
  if (rel === "") {
    return { area: null };
  }
  const [area = null, ...rest] = rel.split("/");
  if (area === "forge") {
    return { area, scope: rest[0] ?? null, inner: rest.slice(1).join("/") || null };
  }
  return { area, inner: rest.join("/") || null };
}
