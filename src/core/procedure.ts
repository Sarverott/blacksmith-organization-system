// A procedure is an ordered list of named steps sharing one context.
// Every BOS behaviour is a procedure; every run leaves a trace in context.trace.
import type { Context } from "./context.ts";

export type Step<C extends Context> = { name: string; run: (context: C) => void | Promise<void> };

export class Procedure<C extends Context = Context> {
  readonly name: string;
  readonly steps: Step<C>[];

  constructor(name: string, steps: Step<C>[]) {
    this.name = name;
    this.steps = steps;
  }

  async run(context: C): Promise<C> {
    for (const step of this.steps) {
      const started = context.host.now();
      try {
        await step.run(context);
        context.trace.push({
          procedure: this.name,
          step: step.name,
          ok: true,
          ms: context.host.now() - started,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        context.trace.push({ procedure: this.name, step: step.name, ok: false, error: message });
        throw new Error(`${this.name} › ${step.name}: ${message}`, { cause: error });
      }
    }
    return context;
  }
}
