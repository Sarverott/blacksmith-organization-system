// The parts of .BOS (glossary: system, setup, data, nestrelm, storylines).
import { Element } from "../../core/element.ts";

// .BOS/setup: keys, VPN, routing, aliases, tokens, setternet
export class Setup extends Element {
  static type = "setup";
  static dirname = "setup";
}

// .BOS/data: data BOS works from, e.g. <pack>.gitlist
export class Data extends Element {
  static type = "data";
  static dirname = "data";
}

// .BOS/nests: volumes and disks of containers and VMs, always indexed and guarded
export class Nests extends Element {
  static type = "nestrelm";
  static dirname = "nests";
  static descriptors = {
    ".index.json": () => ({ nests: {} }),
    ".manifest.json": () => ({ files: {} }),
  };
}
