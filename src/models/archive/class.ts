// Work at rest: sarcophags, exhibits, mirrors (glossary: archive).
import { Element } from "../../core/element.ts";

// where the bare clones of read-only repositories lie (decision Q6; glossary: repos-mirrors)
export const REPOS_MIRRORS = ".repos-mirrors";

export class Archive extends Element {
  static type = "archive";
  static dirname = "archive";

  get mirrorsPath(): string {
    return this.file(REPOS_MIRRORS);
  }

  // a project of the forge by its path below forge/ ("sarverott/github-repos/x") → its
  // mirror: archive/.repos-mirrors/sarverott___github-repos___x.git
  mirrorOf(forgeRelative: string): string {
    return `${this.mirrorsPath}/${mirrorName(forgeRelative)}`;
  }

  // the mirrors there, by name ("<scope>___<project>.git")
  mirrors(): string[] {
    return this.host
      .list(this.mirrorsPath)
      .filter((entry) => entry.directory && entry.name.endsWith(".git"))
      .map((entry) => entry.name)
      .sort();
  }
}

export const mirrorName = (forgeRelative: string) =>
  `${forgeRelative.split("/").filter(Boolean).join("___")}.git`;
