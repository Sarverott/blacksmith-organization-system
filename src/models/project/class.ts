// One concrete project repository inside a scope (glossary: project).
import { Element } from "../../core/element.ts";
import { ALIASES, ANATOMY } from "./anatomy.ts";
import { type GitState, readGit } from "./git.ts";
import { type DeclaredVersion, readVersion } from "./version.ts";

export type ProjectReport = {
  name: string;
  path: string;
  git: GitState;
  version: DeclaredVersion;
  anatomy: { present: string[]; missing: string[] };
};

export class Project extends Element {
  static type = "project";

  anatomy(): { present: string[]; missing: string[] } {
    const has = (part: string) => [part, ...(ALIASES[part] ?? [])].some((name) => this.host.exists(this.file(name)));
    const parts = Object.keys(ANATOMY);
    return { present: parts.filter(has), missing: parts.filter((part) => !has(part)) };
  }

  report(): ProjectReport {
    return {
      name: this.name,
      path: this.path,
      git: readGit(this.host, this.path),
      version: readVersion(this.host, this.path),
      anatomy: this.anatomy(),
    };
  }
}
