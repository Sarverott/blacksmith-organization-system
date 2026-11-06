// The almanac (glossary: almanac): the rulesets and chains of a project (docs/almanac/) first,
// then the universal ones that ship with the core (resources/almanac/).
import type { Host } from "../../core/host.ts";
import { join, packagePath } from "../../core/paths.ts";
import type { Chain } from "../../core/patterning.ts";
import type { Ruleset } from "../../core/ruling.ts";

export type Almanac = { places: string[]; rulesets: Ruleset[]; chains: Chain[] };

export const PROJECT_ALMANAC = "docs/almanac";
export const PACKAGE_ALMANAC = packagePath("resources", "almanac");

// the JSON files of a section of an almanac, in name order
function readSection<T>(host: Host, place: string, section: string): T[] {
  const dir = join(place, section);
  if (!host.isDirectory(dir)) {
    return [];
  }
  return host
    .list(dir)
    .filter((entry) => !entry.directory && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const path = join(dir, name);
      try {
        return JSON.parse(host.readText(path) ?? "null") as T;
      } catch (error) {
        throw new Error(`${path}: ${(error as Error).message}`);
      }
    })
    .filter((data): data is T => data !== null);
}

export function readAlmanac(host: Host, places: string[]): Almanac {
  const unique = [...new Set(places)].filter((place) => host.isDirectory(place));
  return {
    places: unique,
    rulesets: unique.flatMap((place) => readSection<Ruleset>(host, place, "rulesets")),
    chains: unique.flatMap((place) =>
      readSection<{ chains: Chain[] }>(host, place, "patterning").flatMap((file) => file.chains),
    ),
  };
}

// a project's almanac, then the universal one
export function almanacOf(host: Host, projectPath: string): Almanac {
  return readAlmanac(host, [join(projectPath, PROJECT_ALMANAC), PACKAGE_ALMANAC]);
}
