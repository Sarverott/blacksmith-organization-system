// A raw change below the workshop root → a workshop event, or null when it is noise.
import type { Change } from "../../core/host.ts";
import { dirname, inside, join } from "../../core/paths.ts";
import type { Workshop } from "../../models/index.ts";
import { isRepository } from "../../models/project/git.ts";
import { placeOf } from "../../models/workshop/locate.ts";
import type { WorkshopEvent } from "./context.ts";

const NOISE = [/(^|\/)\.git(\/|$)/, /(^|\/)node_modules(\/|$)/, /^\.BOS\/storylines(\/|$)/];

export function isNoise(relative: string): boolean {
  return NOISE.some((pattern) => pattern.test(relative));
}

// the nearest git repository between the changed path and its scope
function projectOf(workshop: Workshop, scopeDir: string, path: string): string | null {
  let dir = workshop.host.isDirectory(path) ? path : dirname(path);
  while (inside(scopeDir, dir)) {
    if (isRepository(workshop.host, dir)) {
      return inside(scopeDir, dir);
    }
    dir = dirname(dir);
  }
  return null;
}

export function classify(workshop: Workshop, change: Change): WorkshopEvent | null {
  if (isNoise(change.path)) {
    return null;
  }
  const path = join(workshop.path, change.path);
  const place = placeOf(workshop.path, path);
  if (!place) {
    return null;
  }
  const scope = place.scope ?? null;
  const project = scope ? projectOf(workshop, join(workshop.forge.path, scope), path) : null;
  const inner = project
    ? inside(join(workshop.forge.path, scope ?? "", project), path) || null
    : (place.inner ?? null);
  return {
    unixusat: workshop.host.now(),
    kind: change.kind,
    path,
    area: place.area,
    scope,
    project,
    inner,
  };
}
