// Tools, listed with checksums so missing or damaged ones can be found (glossary: devarmory).
import { Element } from "../../core/element.ts";

export class Devarmory extends Element {
  static type = "devarmory";
  static dirname = "devarmory";
  static descriptors = { "manifest.json": () => ({ tools: {}, files: {} }) }; // format still [TODO]
}
