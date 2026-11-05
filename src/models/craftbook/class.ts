// Knowledge: scrapnotes, craftsets, collections, recipes (glossary: craftbook).
// Built as BOS.<Model> too:  new BOS.Craftbook(host, path)  new BOS.Scrapnotes(host, path)
import { Element } from "../../core/element.ts";

// every note or draft not yet promoted to a document (glossary: scrapnote)
export class Scrapnotes extends Element {
  static type = "scrapnotes";
  static dirname = "scrapnotes";
}

export class Craftbook extends Element {
  static type = "craftbook";
  static dirname = "craftbook";
  static children = [Scrapnotes];
}
