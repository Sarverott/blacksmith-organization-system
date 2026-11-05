// .BOS/storylines: records of what happened in the workshop (glossary: storylines).
// Not needed to launch: created with the first recorded event.
import type { Context } from "../../core/context.ts";
import { Element } from "../../core/element.ts";

export class Logs extends Element {
  static type = "logs";
  static dirname = "logs";
}

export class Ttystories extends Element {
  static type = "ttystories";
  static dirname = "ttystories";
}

export class Manifests extends Element {
  static type = "manifests";
  static dirname = "manifests";
}

export type StoryEvent = { event: string; [field: string]: unknown };

export class Storylines extends Element {
  static type = "storylines";
  static dirname = "storylines";
  static mandatory = false;
  static children = [Logs, Ttystories, Manifests];
  static descriptors = {
    "metadata.json": (element: Element) => ({
      origin: {
        host: element.host.hostname(),
        user: element.host.user(),
        unixusat: element.host.now(),
        createdBy: "blacksmith-organization-system",
      },
    }),
  };

  get logs(): Logs {
    return this.child(Logs);
  }

  // one JSON line per event in logs/workshop.jsonl; creates storylines on first use
  record(event: StoryEvent, context: Context): StoryEvent & { unixusat: number; host: string } {
    const entry = { unixusat: this.host.now(), host: this.host.hostname(), ...event };
    if (!context.dryRun) {
      this.ensure(context);
      this.host.appendText(this.logs.file("workshop.jsonl"), `${JSON.stringify(entry)}\n`);
    }
    return entry;
  }
}
