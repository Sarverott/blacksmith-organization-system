// The spine of BOS: one object that holds the host, finds the workshop and runs
// the procedures on it. Every face of BOS (CLI, library, later MCP and HTTP) goes
// through these methods.
//   const bos = new BOS(new NodeHost());  const report = await bos.inspect();
import { createContext } from "./core/context.ts";
import type { Host } from "./core/host.ts";
import type { LoopEvent } from "./core/version.ts";
import { Workshop } from "./models/_index.ts";
import {
  type BootstrapContext,
  bootstrapping,
  emptyReport,
  inspecting,
  type VersionContext,
  versioning,
  type WorkshopEvent,
  type WorkshopReport,
  watching,
} from "./procedures/_index.ts";

export type BOSOptions = { workshop?: string };

export type WatchOptions = {
  signal: AbortSignal;
  onEvent: (event: WorkshopEvent) => void;
  record?: boolean;
  quietMs?: number;
};

export class BOS {
  readonly host: Host;
  readonly options: BOSOptions;
  #workshop: Workshop | null = null;

  constructor(host: Host, options: BOSOptions = {}) {
    this.host = host;
    this.options = options;
  }

  // the active workshop: --workshop, $BOS_WORKSHOP, an ancestor __WORKSHOP, or ~/__WORKSHOP
  get workshop(): Workshop {
    this.#workshop ??= Workshop.locate(this.host, this.options.workshop);
    return this.#workshop;
  }

  // build the base of the environment: create what is missing, never overwrite
  async bootstrap({ dryRun = false } = {}): Promise<BootstrapContext> {
    return bootstrapping.run({ ...createContext(this.host, { dryRun }), workshop: this.workshop });
  }

  // the whole workshop as one coherent environment, with findings; reads only
  async inspect(): Promise<WorkshopReport> {
    const context = { ...createContext(this.host), workshop: this.workshop, report: emptyReport(this.workshop) };
    return (await inspecting.run(context)).report;
  }

  // listen to every change in the workshop until options.signal aborts
  async watch({ signal, onEvent, record = false, quietMs = 250 }: WatchOptions): Promise<void> {
    await watching.run({ ...createContext(this.host), workshop: this.workshop, signal, onEvent, record, quietMs });
  }

  // raise a scope's GRIH version for one loop event
  async bumpScope(name: string, event: LoopEvent, { dryRun = false } = {}): Promise<VersionContext> {
    const scope = this.workshop.forge.scope(name);
    return versioning.run({ ...createContext(this.host, { dryRun }), workshop: this.workshop, scope, event });
  }

  toString(): string {
    return `[<Blacksmith_Organization_System::${this.workshop.path}>]`;
  }
}
