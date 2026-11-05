// Knowledge: scrapnotes, craftsets, collections, recipes (glossary: craftbook).
import { Element } from "../../core/element.ts"; // instead of that grab import of BOS
// then BOS.Element should be one of getters that exports the models class

// every note or draft not yet promoted to a document (glossary: scrapnote)
export class Scrapnotes extends Element {
  // export class Scrapnotes extends BOS.Element {
  static type = "scrapnotes";
  static dirname = "scrapnotes";
}

// example of construction object looks like that: `new BOS.Scrapnotes(...args)`

export class Craftbook extends Element {
  // export class Craftbook extends BOS.Element {
  static type = "craftbook";
  static dirname = "craftbook";
  static children = [Scrapnotes]; // static children = [BOS.Scrapnotes];
}

// example of construction object looks like that: `new BOS.Craftbook(...args)`

// NOTE: if not like that we can use other ways to write same stuff but more pretty
