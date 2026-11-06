// Templates of the package (resources/project-template/…): files copied with {{field}}
// filled in. npm leaves .gitignore and dot-directories out of a package in places, so a
// leading "_" of a template's name stands for "." (_gitignore → .gitignore, _github/ → .github/).
import type { Host } from "./host.ts";

export type Fields = Record<string, string>;

export function fill(text: string, fields: Fields): string {
  return text.replace(/\{\{(\w+)\}\}/g, (whole, key: string) => fields[key] ?? whole);
}

export const targetName = (templateName: string) => templateName.replace(/^_/, ".");

// every file of a template directory: its path in the template, and where it goes
export function templateFiles(host: Host, root: string): { from: string; to: string }[] {
  const out: { from: string; to: string }[] = [];
  const walk = (dir: string, target: string) => {
    for (const entry of host.list(dir ? `${root}/${dir}` : root)) {
      const from = dir ? `${dir}/${entry.name}` : entry.name;
      const to = target ? `${target}/${targetName(entry.name)}` : targetName(entry.name);
      if (entry.directory) {
        walk(from, to);
      } else {
        out.push({ from, to });
      }
    }
  };
  walk("", "");
  return out.sort((a, b) => a.to.localeCompare(b.to));
}
