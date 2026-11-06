// .gitignore read by BOS itself (decision Q16): the files of a model outside a git repository
// (an area of the workshop: craftbook/, archive/…) are counted as git would count them.
//   treeFiles(host, "/w/__WORKSHOP/craftbook") → ["recipes/bread.md", …]
// The patterns of gitignore(5): # comments, !negation, a leading or middle / anchors to the
// .gitignore's directory, a trailing / matches directories only, *, ?, [abc], **. The last
// pattern that matches decides; a directory left out is never entered.
import type { Host } from "./host.ts";

export type IgnoreRule = {
  // the directory of the .gitignore, relative to the walked root ("" for the root)
  base: string;
  regex: RegExp;
  negate: boolean;
  dirOnly: boolean;
};

const special = /[.+^${}()|\\]/;

function patternRegex(pattern: string): string {
  let out = "";
  for (let at = 0; at < pattern.length; at++) {
    const char = pattern[at] ?? "";
    if (char === "*" && pattern[at + 1] === "*") {
      const before = at === 0 || pattern[at - 1] === "/";
      const after = pattern[at + 2] === "/";
      if (before && after) {
        out += "(?:.*/)?"; // **/ : no directory or any
        at += 2;
      } else {
        out += ".*"; // /** : everything inside
        at += 1;
      }
    } else if (char === "*") {
      out += "[^/]*";
    } else if (char === "?") {
      out += "[^/]";
    } else if (char === "[") {
      const end = pattern.indexOf("]", at + 1);
      if (end === -1) {
        out += "\\[";
      } else {
        out += `[${pattern.slice(at + 1, end).replace(/^!/, "^")}]`;
        at = end;
      }
    } else if (char === "\\" && at + 1 < pattern.length) {
      at++;
      out += special.test(pattern[at] ?? "") ? `\\${pattern[at]}` : (pattern[at] ?? "");
    } else {
      out += special.test(char) ? `\\${char}` : char;
    }
  }
  return out;
}

// the rules of one .gitignore whose directory is base
export function ignoreRules(text: string, base = ""): IgnoreRule[] {
  const rules: IgnoreRule[] = [];
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.replace(/(?<!\\)\s+$/, "");
    if (!line || line.startsWith("#")) {
      continue;
    }
    const negate = line.startsWith("!");
    if (negate) {
      line = line.slice(1);
    }
    const dirOnly = line.endsWith("/");
    line = line.replace(/\/+$/, "");
    if (!line) {
      continue;
    }
    // a slash at the start or in the middle anchors it to base; else it matches at any depth
    const anchored = line.includes("/");
    line = line.replace(/^\//, "");
    const body = patternRegex(line);
    rules.push({
      base,
      regex: new RegExp(anchored ? `^${body}$` : `^(?:.*/)?${body}$`),
      negate,
      dirOnly,
    });
  }
  return rules;
}

// is the path (relative to the walked root, with /) left out; the last rule that matches decides
export function ignored(rules: IgnoreRule[], path: string, directory: boolean): boolean {
  let out = false;
  for (const rule of rules) {
    if (rule.dirOnly && !directory) {
      continue;
    }
    const inBase = rule.base === "" || path.startsWith(`${rule.base}/`);
    if (!inBase) {
      continue;
    }
    const relative = rule.base === "" ? path : path.slice(rule.base.length + 1);
    if (rule.regex.test(relative)) {
      out = !rule.negate;
    }
  }
  return out;
}

// every file below root that no .gitignore leaves out, relative to root and sorted; .git is
// never entered, nor a directory that is a model or a repository of its own (.bos/, .git)
export function treeFiles(host: Host, root: string): string[] {
  const files: string[] = [];
  const walk = (dir: string, inherited: IgnoreRule[]) => {
    const here = dir ? `${root}/${dir}` : root;
    const own = host.readText(`${here}/.gitignore`);
    const rules = own === null ? inherited : [...inherited, ...ignoreRules(own, dir)];
    for (const entry of host.list(here)) {
      const path = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.name === ".git" || ignored(rules, path, entry.directory)) {
        continue;
      }
      if (!entry.directory) {
        files.push(path);
        continue;
      }
      const inner = `${root}/${path}`;
      if (host.exists(`${inner}/.bos`) || host.exists(`${inner}/.git`)) {
        continue;
      }
      walk(path, rules);
    }
  };
  walk("", []);
  return files.sort();
}
