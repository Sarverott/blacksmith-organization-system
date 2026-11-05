import { dirname } from "../../core/paths.ts";
import {
  type AuthorEntry,
  authorsText,
  completed,
  entryOf,
  formatEntry,
  type Identity,
  names,
  parseIdentity,
  readAuthors,
} from "../../models/index.ts";
import type { CreditContext } from "./context.ts";

const keyOf = ({ name, email }: Identity) => `${name.toLowerCase()} <${email.toLowerCase()}>`;

export function read(context: CreditContext): void {
  context.lines = readAuthors(context.host, context.file);
  const seen = new Set<string>();
  for (const line of context.git.identities()) {
    const identity = parseIdentity(line);
    if (!identity || seen.has(keyOf(identity))) {
      continue;
    }
    seen.add(keyOf(identity));
    context.identities.push(identity);
  }
}

export function match(context: CreditContext): void {
  const { lines, outcome } = context;
  for (const identity of context.identities) {
    const at = lines.findIndex((line) => line.entry && names(line.entry, identity));
    if (at === -1) {
      const entry = entryOf(identity);
      const text = formatEntry(entry);
      lines.push({ text, entry });
      outcome.added.push(text);
      continue;
    }
    const entry = lines[at]?.entry as AuthorEntry;
    const better = completed(entry, identity);
    if (!better) {
      continue;
    }
    // a mentioned entry, completed: updated and moved to the bottom
    const text = formatEntry(better);
    lines.splice(at, 1);
    lines.push({ text, entry: better });
    outcome.updated.push(text);
  }
  context.changes.push(...outcome.updated.map((text) => `updated: ${text}`));
  context.changes.push(...outcome.added.map((text) => `added: ${text}`));
}

export function write(context: CreditContext): void {
  const { outcome } = context;
  if (!outcome.added.length && !outcome.updated.length) {
    return;
  }
  if (context.dryRun) {
    outcome.action = "would-write";
    return;
  }
  context.host.mkdir(dirname(context.file));
  context.host.writeText(context.file, authorsText(context.lines));
  outcome.action = "written";
}
