import type { Context } from "../../core/context.ts";
import { Procedure } from "../../core/procedure.ts";
import type { LoopEvent } from "../../core/version.ts";
import type { Scope, Workshop } from "../../models/_index.ts";

export type VersionContext = Context & {
  workshop: Workshop;
  scope: Scope;
  event: LoopEvent;
  result?: { scope: string; event: LoopEvent; from: string | null; to: string };
};

export const versioning = new Procedure<VersionContext>("versioning", [
  {
    name: "bump",
    run: (context) => {
      if (!context.scope.exists()) throw new Error(`no scope at ${context.scope.path}`);
      const { from, to } = context.scope.bump(context.event, context);
      context.result = { scope: context.scope.name, event: context.event, from, to };
    },
  },
  {
    name: "record",
    run: (context) => {
      if (context.dryRun || !context.result) return;
      const { scope, event, from, to } = context.result;
      context.workshop.system.storylines.record({ event: "scope-bump", scope, loopEvent: event, from, to }, context);
    },
  },
]);
