// POSIX paths without node:path, so the core runs wherever a Host can be written.
// Every path the core keeps is absolute and uses "/".

export function join(...parts: string[]): string {
  return normalize(parts.filter(Boolean).join("/"));
}

export function normalize(path: string): string {
  const absolute = path.startsWith("/");
  const out: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (out.length && out[out.length - 1] !== "..") out.pop();
      else if (!absolute) out.push("..");
      continue;
    }
    out.push(part);
  }
  const body = out.join("/");
  return absolute ? `/${body}` : body || ".";
}

export function basename(path: string): string {
  return normalize(path).split("/").pop() ?? "";
}

export function dirname(path: string): string {
  const parts = normalize(path).split("/");
  parts.pop();
  const parent = parts.join("/");
  return parent || "/";
}

// "a/b" when target = root/a/b; "" when equal; null when target is outside root
export function inside(root: string, target: string): string | null {
  const base = normalize(root);
  const path = normalize(target);
  if (path === base) return "";
  const prefix = base === "/" ? "/" : `${base}/`;
  return path.startsWith(prefix) ? path.slice(prefix.length) : null;
}
