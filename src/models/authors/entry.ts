// One line of AUTHORS (glossary: authors):
//   NICKNAME	"NAMED IDENTITY"	<EMAIL>	(URL)	[SIGN::type::public sign]
export type AuthorEntry = {
  nickname: string | null;
  identity: string | null;
  email: string | null;
  url: string | null;
  signs: string[];
};

export type AuthorKind = "full" | "verified" | "mentioned";

// someone in the commits: author, committer or Co-authored-by
export type Identity = { name: string; email: string };

const TOKEN = /"([^"]*)"|<([^>]*)>|\(([^)]*)\)|\[([^\]]*)\]|(\S+)/g;

// null for a blank line or a # comment
export function parseEntry(line: string): AuthorEntry | null {
  const text = line.trim();
  if (!text || text.startsWith("#")) return null;
  const entry: AuthorEntry = { nickname: null, identity: null, email: null, url: null, signs: [] };
  for (const [, identity, email, url, sign, bare] of text.matchAll(TOKEN)) {
    if (identity !== undefined) entry.identity ??= identity;
    else if (email !== undefined) entry.email ??= email;
    else if (url !== undefined) entry.url ??= url;
    else if (sign !== undefined) entry.signs.push(sign);
    else if (bare !== undefined) entry.nickname ??= bare;
  }
  return entry;
}

export function formatEntry(entry: AuthorEntry): string {
  return [
    entry.nickname,
    entry.identity === null ? null : `"${entry.identity}"`,
    entry.email === null ? null : `<${entry.email}>`,
    entry.url === null ? null : `(${entry.url})`,
    ...entry.signs.map((sign) => `[${sign}]`),
  ]
    .filter((field) => field !== null)
    .join("\t");
}

export function kindOf(entry: AuthorEntry): AuthorKind {
  if (!entry.nickname || !entry.email) return "mentioned";
  return entry.identity && entry.url ? "full" : "verified";
}

const same = (a: string | null, b: string) => a !== null && a.toLowerCase() === b.toLowerCase();

// does the entry name this identity (glossary: the matching is assumed)
export function names(entry: AuthorEntry, { name, email }: Identity): boolean {
  if (email && same(entry.email, email)) return true;
  if (!name) return false;
  if (same(entry.nickname, name) || same(entry.identity, name)) return true;
  return Boolean(entry.identity?.toLowerCase().startsWith(`${name.toLowerCase()} `));
}

export function nicknameOf(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

// a new entry for an identity no entry names: verified, or mentioned when half is missing
export function entryOf({ name, email }: Identity): AuthorEntry {
  return { nickname: name ? nicknameOf(name) : null, identity: null, email: email || null, url: null, signs: [] };
}

// what an identity adds to a mentioned entry; null when nothing
export function completed(entry: AuthorEntry, { name, email }: Identity): AuthorEntry | null {
  if (kindOf(entry) !== "mentioned") return null;
  const nickname = entry.nickname ?? (name ? nicknameOf(name) : null);
  const mail = entry.email ?? (email || null);
  if (nickname === entry.nickname && mail === entry.email) return null;
  return { ...entry, nickname, email: mail };
}

// "Name <email>", as git trailers write it
export function parseIdentity(text: string): Identity | null {
  const match = text.trim().match(/^(.*?)\s*<([^>]*)>$/);
  if (match) return { name: (match[1] ?? "").trim(), email: (match[2] ?? "").trim() };
  return text.trim() ? { name: text.trim(), email: "" } : null;
}
