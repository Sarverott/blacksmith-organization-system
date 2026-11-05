import type { BootstrapContext } from "./context.ts";

// a bootstrap that created nothing leaves no record; the record itself creates storylines
// on first use, so a dry run plans that too and both runs list the same paths
export function record(context: BootstrapContext): void {
  if (!context.changes.length) {
    return;
  }
  const { storylines } = context.workshop.system;
  if (context.dryRun) {
    storylines.ensure(context);
  } else {
    storylines.record({ event: "bootstrap", created: context.changes.length }, context);
  }
}
