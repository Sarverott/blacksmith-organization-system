// .BOS: where BOS keeps itself inside a workshop (glossary: system).
// The only hidden area; everything else in the workshop is the owner's work.
import { Element } from "../../core/element.ts";
import { Data, Nests, Setup } from "./parts.ts";
import { Storylines } from "./storylines.ts";

export class System extends Element {
  static type = "system";
  static dirname = ".BOS";
  static children = [Setup, Data, Nests, Storylines];
  static descriptors = {
    "workshop.json": (element: Element) => ({
      createdBy: "blacksmith-organization-system",
      host: element.host.hostname(),
      unixusat: element.host.now(),
    }),
  };

  get storylines(): Storylines {
    return this.child(Storylines);
  }
}
