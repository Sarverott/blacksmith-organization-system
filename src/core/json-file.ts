// One JSON file: read once when first asked, changed in place, saved on demand.
// It goes through a Host, like every file the core touches.
//   const manifest = new JsonFile<{ version: string }>(host, packagePath("package.json"));
//   manifest.data.version;                        // read on first use
//   manifest.data.version = "2.0.0"; manifest.save();
import type { Host } from "./host.ts";
import { serialize } from "./serialize.ts";

export class JsonFile<T extends object> {
  readonly host: Host;
  readonly path: string;
  // what the file holds, parsed; null until first read
  #data: T | null = null;

  constructor(host: Host, path: string) {
    this.host = host;
    this.path = path;
  }

  exists(): boolean {
    return this.host.exists(this.path);
  }

  // the parsed content; read from the file the first time
  get data(): T {
    this.#data ??= this.#load();
    return this.#data;
  }

  set data(value: T) {
    this.#data = value;
  }

  // read the file again, dropping what was changed in memory
  read(): this {
    this.#data = this.#load();
    return this;
  }

  // write what is in memory to the file
  save(): this {
    this.host.writeText(this.path, serialize(this.data));
    return this;
  }

  #load(): T {
    const text = this.host.readText(this.path);
    if (text === null) {
      throw new Error(`${this.path}: no such file`);
    }
    return JSON.parse(text) as T;
  }
}
