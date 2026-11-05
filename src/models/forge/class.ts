// Active work, the desk: scopes of projects (glossary: forge).
import { Element } from "../../core/element.ts";
import { Scope } from "../scope/class.ts";

export class Forge extends Element {
  static type = "forge";
  static dirname = "forge";

  scopes(): Scope[] {
    return this.host
      .list(this.path)
      .filter((entry) => entry.directory && !entry.name.startsWith("."))
      .map((entry) => new Scope(this.host, this.file(entry.name), this));
  }

  scope(name: string): Scope {
    return new Scope(this.host, this.file(name), this);
  }

  // loose files lying in the forge itself, outside any scope
  looseFiles(): string[] {
    return this.host
      .list(this.path)
      .filter((entry) => !entry.directory)
      .map((entry) => entry.name);
  }
}
