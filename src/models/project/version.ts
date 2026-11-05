// The version a project declares, from the first manifest that has one.
import type { Host } from "../../core/host.ts";
import { join } from "../../core/paths.ts";

export type DeclaredVersion = { version: string; source: string } | null;

const READERS: [string, (text: string) => string | undefined][] = [
  ["metadata.json", (text) => JSON.parse(text).version],
  ["package.json", (text) => JSON.parse(text).version],
  ["pyproject.toml", (text) => text.match(/^\[project\][^[]*?^version\s*=\s*"([^"]+)"/ms)?.[1]],
];

export function readVersion(host: Host, root: string): DeclaredVersion {
  for (const [source, read] of READERS) {
    const text = host.readText(join(root, source));
    if (text === null) {
      continue;
    }
    try {
      const version = read(text);
      if (version) {
        return { version, source };
      }
    } catch {
      // a broken manifest declares nothing; the next one may
    }
  }
  return null;
}
