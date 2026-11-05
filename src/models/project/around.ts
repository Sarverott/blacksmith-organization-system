// The project around a path: the nearest git repository at or above it.
import type { Host } from "../../core/host.ts";
import { dirname, join, normalize } from "../../core/paths.ts";
import { Project } from "./class.ts";
import { isRepository } from "./git.ts";

export function projectAround(host: Host, dir?: string): Project {
  const start = normalize(dir ? (dir.startsWith("/") ? dir : join(host.cwd(), dir)) : host.cwd());
  for (let at = start; ; at = dirname(at)) {
    if (isRepository(host, at)) return new Project(host, at);
    if (at === "/") throw new Error(`${start} is not inside a git repository`);
  }
}
