// A family of projects, shemes and one throwbox (glossary: scope). Scopes nest, so the
// projects of a scope are the git repositories anywhere below it; a repository is not
// searched further (its members are its own business).
//
// A scope's version is GRIH (vG.R.I.H), kept in <scope>/.bos/scope.json (decision Q5).
import type { Context } from "../../core/context.ts";
import { Element } from "../../core/element.ts";
import { bumpGrih, GRIH_START, type LoopEvent } from "../../core/version.ts";
import { Project } from "../project/class.ts";
import { isRepository } from "../project/git.ts";

export const SCOPE_FILE = ".bos/scope.json";
const SKIPPED = new Set(["node_modules", "dist", "build", "site", "throwbox"]);

export type ScopeData = { version?: string; [field: string]: unknown };

export class Scope extends Element {
  static type = "scope";
  static maxDepth = 3;

  // is the scope itself a repository (a scope repo with submodule members)?
  isRepository(): boolean {
    return isRepository(this.host, this.path);
  }

  projects(): Project[] {
    const found: Project[] = [];
    const walk = (dir: string, depth: number) => {
      if (depth > Scope.maxDepth) return;
      for (const entry of this.host.list(dir)) {
        if (!entry.directory || entry.name.startsWith(".") || SKIPPED.has(entry.name)) continue;
        const path = `${dir}/${entry.name}`;
        if (isRepository(this.host, path)) found.push(new Project(this.host, path, this));
        else walk(path, depth + 1);
      }
    };
    walk(this.path, 1);
    return found;
  }

  data(): ScopeData | null {
    return this.readJSON<ScopeData | null>(SCOPE_FILE, null);
  }

  version(): string | null {
    return this.data()?.version ?? null;
  }

  // raise the scope's GRIH version for a loop event; a scope without one starts at 0.0.0.0
  bump(event: LoopEvent, context: Context): { from: string | null; to: string } {
    const data = this.data() ?? {};
    const from = data.version ?? null;
    const to = bumpGrih(from ?? GRIH_START, event);
    if (!context.dryRun) this.host.mkdir(this.file(".bos"));
    this.writeJSON(SCOPE_FILE, { ...data, version: to }, context);
    return { from, to };
  }
}
