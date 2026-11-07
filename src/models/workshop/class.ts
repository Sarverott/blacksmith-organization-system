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

  get archive(): Archive {
    return this.child(Archive);
  }

  // the five areas as elements (.BOS, devarmory, forge, craftbook, archive)
  get areas(): Element[] {
    return this.childElements();
  }

  get areaNames(): string[] {
    return Workshop.children.map((Kind) => Kind.dirname ?? Kind.type);
  }

  // areas of a workshop lying beside it, in the directory that holds it: a second workshop
  // half-made there (a partition root given where __WORKSHOP was meant), their paths
  misplacedAreas(): string[] {
    const holder = this.path.replace(/\/[^/]+$/, "") || "/";
    if (holder === this.path) {
      return [];
    }
    const present = new Set(this.host.list(holder).map((entry) => entry.name));
    return this.areaNames.filter((name) => present.has(name)).map((name) => `${holder}/${name}`);
  }

  // the names of the files BOS itself writes into the tree (descriptors), at their places:
  // ".BOS/workshop.json", "devarmory/manifest.json"…
  scaffolding(): string[] {
    const out: string[] = [];
    const walk = (element: Element, at: string) => {
      for (const name of Object.keys(element.kind.descriptors)) {
        out.push(at ? `${at}/${name}` : name);
      }
      for (const child of element.childElements()) {
        walk(child, at ? `${at}/${child.kind.dirname ?? ""}` : (child.kind.dirname ?? ""));
      }
    };
    walk(this, "");
    return out;
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
