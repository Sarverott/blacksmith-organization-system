// A project's AUTHORS file: its lines as they are, each with its entry (if any).
import type { Host } from "../../core/host.ts";
import { join } from "../../core/paths.ts";
import { type AuthorEntry, parseEntry } from "./entry.ts";

export type AuthorsLine = { text: string; entry: AuthorEntry | null };

export function authorsFile(projectPath: string): string {
  return join(projectPath, ".github", "AUTHORS");
}

// a missing file has no lines
export function readAuthors(host: Host, file: string): AuthorsLine[] {
  const text = host.readText(file);
  if (text === null) {
    return [];
  }
  const lines = text.split("\n");
  if (lines.at(-1) === "") {
    lines.pop();
  }
  return lines.map((line) => ({ text: line, entry: parseEntry(line) }));
}

export function authorsText(lines: AuthorsLine[]): string {
  return lines.length ? `${lines.map((line) => line.text).join("\n")}\n` : "";
}
