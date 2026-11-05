// The spine of BOS: one object that holds the host, finds the workshop and runs
// the procedures on it. Every face of BOS (CLI, library, later MCP and HTTP) goes
// through these methods.
//   const bos = new BOS(new NodeHost());  const report = await bos.inspect();
import { Git } from "./bridges/git.ts";
import { GitHub } from "./bridges/github.ts";
import { createContext } from "./core/context.ts";
import type { Host } from "./core/host.ts";
import type { LoopEvent } from "./core/version.ts";
import {
  type Loop,
  loopOfSettings,
  type Project,
  projectAround,
  type Settings,
  settingsOf,
  type VersioningData,
  versioningOf,
  Workshop,
} from "./models/_index.ts";
import {
  automerging,
  type BootstrapContext,
  type BumpOutcome,
  bootstrapping,
  bumping,
  emptyReport,
  type FlowOutcome,
  inspecting,
  proposing,
  unbumped,
  undecided,
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

  // the active workshop: --workshop, $BOS_WORKSHOP, $WORKSHOP_ROOT/__WORKSHOP, an ancestor __WORKSHOP,
  // or ~/__WORKSHOP ($WORKSHOP_RENAME changes the name)
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

  // the settings of the project around dir (default: the current directory): .github/bos.json
  settings(dir?: string): { project: Project; settings: Settings; loop: Loop; versioning: VersioningData } {
    const project = projectAround(this.host, dir);
    const settings = settingsOf(this.host, project.path);
    return { project, settings, loop: loopOfSettings(settings), versioning: versioningOf(settings) };
  }

  // the craft loop of the project around dir
  loop(dir?: string): { project: Project; loop: Loop } {
    const { project, loop } = this.settings(dir);
    return { project, loop };
  }

  // bump the project's version for work landing on a station (only a released version moves)
  async bump(station: string, { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {}): Promise<BumpOutcome> {
    const { project, versioning } = this.settings(dir);
    const git = new Git(this.host, project.path);
    const context = {
      ...createContext(this.host, { dryRun }),
      projectPath: project.path,
      station,
      versioning,
      git,
      outcome: unbumped(),
    };
    return (await bumping.run(context)).outcome;
  }

  // open the pull request of a branch's forward step on GitHub
  async propose(
    branch: string,
    { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {},
  ): Promise<FlowOutcome> {
    const { project, loop } = this.loop(dir);
    const github = new GitHub(this.host, project.path);
    const context = { ...createContext(this.host, { dryRun }), loop, github, branch, outcome: undecided() };
    return (await proposing.run(context)).outcome;
  }

  // merge a loop pull request when the loop allows it
  async automerge(
    number: number,
    { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {},
  ): Promise<FlowOutcome> {
    const { project, loop } = this.loop(dir);
    const github = new GitHub(this.host, project.path);
    const context = { ...createContext(this.host, { dryRun }), loop, github, number, outcome: undecided() };
    return (await automerging.run(context)).outcome;
  }

  toString(): string {
    return `[<Blacksmith_Organization_System::${this.workshop.path}>]`;
  }
}
