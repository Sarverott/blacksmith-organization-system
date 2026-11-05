import type { BootstrapContext } from "./context.ts";

// the workshop and every mandatory part declared by the models
export function ensureTree(context: BootstrapContext): void {
  context.workshop.ensure(context);
}
