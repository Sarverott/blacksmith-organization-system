// Element anatomy (glossary: element-anatomy): a directory plus descriptor files.
// Every model of the workshop is an Element. Its fixed parts are declared once,
// statically, and the same declaration drives creating (ensure) and reading (inspect).
//   class Forge extends Element { static type = "forge"; static dirname = "forge"; }
import { type Context, createIfMissing } from "./context.ts";
import type { Host } from "./host.ts";
import { basename, join } from "./paths.ts";
// NOTE: hmmm... why not make it listen? make Element extend event emitter to allow us define listeners with for example:
/*
// DRAFT OF IDEA EXAMPLE
const testNote = new BOS.Scrapnote(...)
testNote.on("test", ()=>{})
testNote.emmit("test")
*/

export type Descriptor = (element: Element, context: Context) => string | object;

export type ElementClass = {
  new (host: Host, path: string, parent?: Element | null): Element;
  type: string;
  dirname: string | null;
  mandatory: boolean;
  children: ElementClass[];
  descriptors: Record<string, Descriptor>;
};

export type ElementNode = {
  type: string;
  path: string;
  exists: boolean;
  mandatory: boolean;
  descriptors: { name: string; exists: boolean }[];
  children: ElementNode[];
};

export class Element {
  static type = "element";
  // fixed directory name, relative to the parent; null for freely named elements (a scope, a project)
  static dirname: string | null = null;
  // created together with its parent when missing
  static mandatory = true;
  // fixed child elements (areas, organs), in the order they are shown
  static children: ElementClass[] = [];
  // { filename: default content } written when missing, never overwritten
  static descriptors: Record<string, Descriptor> = {};

  readonly host: Host;
  readonly path: string;
  readonly parent: Element | null;

  constructor(host: Host, path: string, parent: Element | null = null) {
    this.host = host;
    this.path = path;
    this.parent = parent;
  }

  get kind(): ElementClass {
    return this.constructor as ElementClass;
  }

  get type(): string {
    return this.kind.type;
  }

  get name(): string {
    return basename(this.path);
  }

  file(...names: string[]): string {
    return join(this.path, ...names);
  }

  exists(): boolean {
    return this.host.isDirectory(this.path);
  }

  child<T extends Element>(Kind: {
    new (host: Host, path: string, parent?: Element | null): T;
    dirname: string | null;
  }): T {
    return new Kind(this.host, this.file(Kind.dirname ?? ""), this);
  }

  childElements(): Element[] {
    return this.kind.children.map((Kind) => this.child(Kind));
  }

  // create the directory, missing descriptors and mandatory children; never overwrite
  ensure(context: Context): this {
    createIfMissing(context, this.path, () => this.host.mkdir(this.path));
    for (const [name, content] of Object.entries(this.kind.descriptors)) {
      const target = this.file(name);
      createIfMissing(context, target, () =>
        this.host.writeText(target, serialize(content(this, context))),
      );
    }
    for (const child of this.childElements()) {
      if (child.kind.mandatory) {
        child.ensure(context);
      }
    }
    return this;
  }

  // what exists of this element and its fixed parts; reads only
  inspect(parentMandatory = true): ElementNode {
    const mandatory = parentMandatory && this.kind.mandatory;
    return {
      type: this.type,
      path: this.path,
      exists: this.exists(),
      mandatory,
      descriptors: Object.keys(this.kind.descriptors).map((name) => ({
        name,
        exists: this.host.exists(this.file(name)),
      })),
      children: this.childElements().map((child) => child.inspect(mandatory)),
    };
  }

  readJSON<T>(name: string, fallback: T): T {
    const text = this.host.readText(this.file(name));
    if (text === null) {
      return fallback;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  }

  writeJSON(name: string, value: object, context: Context): void {
    if (!context.dryRun) {
      this.host.writeText(this.file(name), serialize(value));
    }
    context.changes.push(this.file(name));
  }

  toString(): string {
    return `[<BOS.${this.type}::${this.path}>]`;
  }
}

export function serialize(content: string | object): string {
  return typeof content === "string" ? content : `${JSON.stringify(content, null, 2)}\n`;
}

// NOTE: all that uses this is actualy placed in src/models as i see... or at least most of uses is there
