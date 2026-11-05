// The workshop: root of crafting on a host or partition (glossary: workshop).
// Five mandatory areas: .BOS (BOS itself), devarmory, forge, craftbook, archive.
import { Element } from "../../core/element.ts";
import type { Host } from "../../core/host.ts";
import { Archive } from "../archive/class.ts";
import { Craftbook } from "../craftbook/class.ts";
import { Devarmory } from "../devarmory/class.ts";
import { Forge } from "../forge/class.ts";
import { System } from "../system/class.ts";
import { type Located, locateWorkshop, WORKSHOP_DIRNAME } from "./locate.ts";

// what may lie in a workshop root besides the areas: the agents' guides and their settings
export const ROOT_FILES = new Set(["AGENTS.md", "CLAUDE.md", ".claude", "README.md", ".gitignore"]);

export class Workshop extends Element {
  static type = "workshop";
  static dirname = WORKSHOP_DIRNAME;
  static children = [System, Devarmory, Forge, Craftbook, Archive];

  readonly located: Located | null;

  constructor(
    host: Host,
    path: string,
    parent: Element | null = null,
    located: Located | null = null,
  ) {
    super(host, path, parent);
    this.located = located;
  }

  static locate(host: Host, explicit?: string): Workshop {
    const located = locateWorkshop(host, explicit);
    return new Workshop(host, located.root, null, located);
  }

  get system(): System {
    return this.child(System);
  }

  get forge(): Forge {
    return this.child(Forge);
  }

  get areaNames(): string[] {
    return Workshop.children.map((Kind) => Kind.dirname ?? Kind.type);
  }

  // entries in the root that are neither an area nor a known file
  strays(): string[] {
    const areas = new Set(this.areaNames);
    return this.host
      .list(this.path)
      .map((entry) => entry.name)
      .filter((name) => !areas.has(name) && !ROOT_FILES.has(name));
  }
}
