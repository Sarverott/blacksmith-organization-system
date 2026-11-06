import { LocalGit } from "../../bridges/index.ts";
import { createIfMissing } from "../../core/context.ts";
import { packagePath } from "../../core/paths.ts";
import { fill, templateFiles } from "../../core/template.ts";
import { GRIH_START } from "../../core/version.ts";
import { Project, SCOPE_FILE } from "../../models/index.ts";
import type { CreateContext } from "./context.ts";

export const PROJECT_TEMPLATE = packagePath("resources", "project-template");

const NAME = /^[A-Za-z0-9_][\w.-]*$/;

// what to clone: gh:owner/repo or owner/repo (GitHub), any git URL, or a path (/…, ./…, ../…);
// with the owner and the repository it names
export function parseSource(source: string): { url: string; owner: string; repo: string } {
  const short = /^(?:gh:)?([\w.-]+)\/([\w.-]+?)(?:\.git)?$/.exec(source);
  const github = short && (source.startsWith("gh:") || !/^[./~]/.test(source));
  const url = github ? `https://github.com/${short[1]}/${short[2]}.git` : source;
  const parts = url
    .replace(/\/+$/, "")
    .replace(/\.git$/, "")
    .split(/[/:]/)
    .filter(Boolean);
  const repo = parts.pop() ?? "";
  const owner = parts.pop() ?? "";
  return { url, owner, repo };
}

export function locate(context: CreateContext): void {
  const { outcome, forge } = context;
  if (outcome.kind === "import") {
    const { url, owner, repo } = parseSource(outcome.url ?? "");
    outcome.url = url;
    context.scopeName ||= owner.toLowerCase();
    context.name ||= repo;
  }
  const segments = context.scopeName.split("/");
  if (!segments.every((part) => NAME.test(part))) {
    throw new Error(`not a scope name: "${context.scopeName}" (letters, digits, _ . -; a/b nests)`);
  }
  if (outcome.kind !== "scope" && !NAME.test(context.name)) {
    throw new Error(`not a project name: "${context.name}" (letters, digits, _ . -)`);
  }
  outcome.scope = context.scopeName;
  const scopePath = `${forge.path}/${context.scopeName}`;
  outcome.path = outcome.kind === "scope" ? scopePath : `${scopePath}/${context.name}`;
  outcome.existed = context.host.exists(outcome.path);
  if (outcome.kind === "import" && outcome.existed) {
    throw new Error(`${outcome.path} is there already: nothing is cloned over it`);
  }
}

const scopePath = (context: CreateContext) => `${context.forge.path}/${context.scopeName}`;

// the scope's own parts: its directory, .bos/scope.json, throwbox/
export function scope(context: CreateContext): void {
  const { host } = context;
  const root = scopePath(context);
  createIfMissing(context, root, () => host.mkdir(root));
  createIfMissing(context, `${root}/${SCOPE_FILE}`, () => {
    host.mkdir(`${root}/.bos`);
    host.writeText(
      `${root}/${SCOPE_FILE}`,
      `${JSON.stringify({ version: GRIH_START }, null, 2)}\n`,
    );
  });
  createIfMissing(context, `${root}/throwbox`, () => host.mkdir(`${root}/throwbox`));
}

// the repository: a new one on development, or a clone
export function make(context: CreateContext): void {
  const { outcome, host } = context;
  if (outcome.kind === "scope") {
    return;
  }
  if (outcome.kind === "import") {
    context.changes.push(outcome.path);
    if (!context.dryRun) {
      new LocalGit(host, scopePath(context)).clone(outcome.url ?? "", outcome.path);
    }
    return;
  }
  createIfMissing(context, outcome.path, () => host.mkdir(outcome.path));
  createIfMissing(context, `${outcome.path}/.git`, () => new LocalGit(host, outcome.path).init());
}

// the standard anatomy from the template, and .bos/bos.json; nothing overwritten
export function seed(context: CreateContext): void {
  const { outcome, host } = context;
  if (outcome.kind === "scope" || (outcome.kind === "import" && !context.seed)) {
    return;
  }
  const fields = {
    name: context.name,
    scope: context.scopeName,
    author: context.author,
    year: context.year,
  };
  for (const { from, to } of templateFiles(host, PROJECT_TEMPLATE)) {
    const target = `${outcome.path}/${to}`;
    createIfMissing(context, target, () => {
      host.mkdir(target.replace(/\/[^/]+$/, ""));
      host.writeText(target, fill(host.readText(`${PROJECT_TEMPLATE}/${from}`) ?? "", fields));
    });
  }
  const bos = `${outcome.path}/.bos/bos.json`;
  createIfMissing(context, bos, () => {
    host.mkdir(`${outcome.path}/.bos`);
    host.writeText(
      bos,
      `${JSON.stringify({ type: "project", scope: context.scopeName, created: host.now() }, null, 2)}\n`,
    );
  });
}

type Workspace = { folders?: { path: string }[]; settings?: object };

// <scope>/<scope>.code-workspace: every project of the scope and the scope itself
export function workspace(context: CreateContext): void {
  const { outcome, host } = context;
  const root = scopePath(context);
  const file = `${root}/${context.scopeName.split("/").pop()}.code-workspace`;
  outcome.workspace = file;
  const projects = context.forge
    .scope(context.scopeName)
    .projects()
    .map((project) => project.path.slice(root.length + 1));
  if (outcome.kind !== "scope" && !projects.includes(context.name)) {
    projects.push(context.name);
  }
  const wanted = [...projects.sort(), "."];
  const text = host.readText(file);
  if (text === null) {
    createIfMissing(context, file, () =>
      host.writeText(
        file,
        `${JSON.stringify({ folders: wanted.map((path) => ({ path })), settings: {} }, null, "\t")}\n`,
      ),
    );
    return;
  }
  let data: Workspace;
  try {
    data = JSON.parse(text) as Workspace;
  } catch {
    // written by hand with comments: left as it is
    return;
  }
  const have = new Set((data.folders ?? []).map((folder) => folder.path));
  const missing = wanted.filter((path) => !have.has(path));
  if (!missing.length) {
    return;
  }
  context.changes.push(file);
  if (!context.dryRun) {
    data.folders = [...(data.folders ?? []), ...missing.map((path) => ({ path }))];
    host.writeText(file, `${JSON.stringify(data, null, "\t")}\n`);
  }
}

export function report(context: CreateContext): void {
  const { outcome, host } = context;
  if (outcome.kind !== "scope" && host.exists(outcome.path)) {
    outcome.anatomy = new Project(host, outcome.path).anatomy();
  }
}
