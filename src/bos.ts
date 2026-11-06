// The spine of BOS: one object that holds the host, finds the workshop and runs
// the procedures on it. Every face of BOS (CLI, library, later MCP and HTTP) goes
// through these methods.
//   const bos = new BOS(new NodeHost());  const report = await bos.inspect();
import { GitHub, LocalGit } from "./bridges/index.ts";
import { createContext } from "./core/context.ts";
import { Element } from "./core/element.ts";
import type { Host } from "./core/host.ts";
import { type Allocators, DEFAULT_ALLOCATORS, OMNIS_FILE } from "./core/omnis.ts";
import type { LoopEvent } from "./core/version.ts";
import * as Models from "./models/index.ts";
import * as Procedures from "./procedures/index.ts";

export type BOSOptions = { workshop?: string };

export type WatchOptions = {
  signal: AbortSignal;
  onEvent: (event: Procedures.WorkshopEvent) => void;
  record?: boolean;
  quietMs?: number;
};

export class BOS {
  // Every model, reachable and built as BOS.<Model>: new BOS.Craftbook(host, path).
  // (The models themselves extend Element from src/core: BOS imports them, so they cannot
  // extend BOS.Element while this file is still loading.)
  static readonly Element = Element;
  static readonly Workshop = Models.Workshop;
  static readonly System = Models.System;
  static readonly Setup = Models.Setup;
  static readonly Data = Models.Data;
  static readonly Nests = Models.Nests;
  static readonly Storylines = Models.Storylines;
  static readonly Logs = Models.Logs;
  static readonly Manifests = Models.Manifests;
  static readonly Ttystories = Models.Ttystories;
  static readonly Devarmory = Models.Devarmory;
  static readonly Forge = Models.Forge;
  static readonly Scope = Models.Scope;
  static readonly Project = Models.Project;
  static readonly Devlog = Models.Devlog;
  static readonly Craftbook = Models.Craftbook;
  static readonly Scrapnotes = Models.Scrapnotes;
  static readonly Archive = Models.Archive;
  static readonly Loop = Models.Loop;

  readonly host: Host;
  readonly options: BOSOptions;
  #workshop: Models.Workshop | null = null;

  constructor(host: Host, options: BOSOptions = {}) {
    if (!host) {
      throw new TypeError("new BOS(host): give it the machine, e.g. new BOS(new NodeHost())");
    }
    this.host = host;
    this.options = options;
  }

  // the active workshop: --workshop, $BOS_WORKSHOP, $WORKSHOP_ROOT/__WORKSHOP, an ancestor __WORKSHOP,
  // or ~/__WORKSHOP ($WORKSHOP_RENAME changes the name)
  get workshop(): Models.Workshop {
    this.#workshop ??= Models.Workshop.locate(this.host, this.options.workshop);
    return this.#workshop;
  }

  // build the base of the environment: create what is missing, never overwrite
  async bootstrap({ dryRun = false } = {}): Promise<Procedures.BootstrapContext> {
    return Procedures.bootstrapping.run({
      ...createContext(this.host, { dryRun }),
      workshop: this.workshop,
    });
  }

  // the whole workshop as one coherent environment, with findings; reads only
  async inspect(): Promise<Procedures.WorkshopReport> {
    const context = {
      ...createContext(this.host),
      workshop: this.workshop,
      report: Procedures.emptyReport(this.workshop),
    };
    return (await Procedures.inspecting.run(context)).report;
  }

  // listen to every change in the workshop until options.signal aborts
  async watch({ signal, onEvent, record = false, quietMs = 250 }: WatchOptions): Promise<void> {
    await Procedures.watching.run({
      ...createContext(this.host),
      workshop: this.workshop,
      signal,
      onEvent,
      record,
      quietMs,
    });
  }

  // raise a scope's GRIH version for one loop event
  async bumpScope(
    name: string,
    event: LoopEvent,
    { dryRun = false } = {},
  ): Promise<Procedures.VersionContext> {
    const scope = this.workshop.forge.scope(name);
    return Procedures.versioning.run({
      ...createContext(this.host, { dryRun }),
      workshop: this.workshop,
      scope,
      event,
    });
  }

  // the settings of the project around dir (default: the current directory): .github/bos.json
  settings(dir?: string): {
    project: Models.Project;
    settings: Models.Settings;
    loop: Models.Loop;
    versioning: Models.VersioningData;
  } {
    const project = Models.projectAround(this.host, dir);
    const settings = Models.settingsOf(this.host, project.path);
    return {
      project,
      settings,
      loop: Models.loopOfSettings(settings),
      versioning: Models.versioningOf(settings),
    };
  }

  // the craft loop of the project around dir
  loop(dir?: string): { project: Models.Project; loop: Models.Loop } {
    const { project, loop } = this.settings(dir);
    return { project, loop };
  }

  // bump the project's version for work landing on a station (once the line it leaves is released)
  async bump(
    station: string,
    { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {},
  ): Promise<Procedures.BumpOutcome> {
    const { project, versioning } = this.settings(dir);
    const git = new LocalGit(this.host, project.path);
    const context = {
      ...createContext(this.host, { dryRun }),
      projectPath: project.path,
      station,
      everyCommit: false,
      versioning,
      git,
      outcome: Procedures.unbumped(),
    };
    return (await Procedures.bumping.run(context)).outcome;
  }

  // the bump of one commit on a contributor's branch (versioning.commits): every
  // commit has its own version; other branches bump nothing here
  async bumpCommit({
    dir,
    dryRun = false,
  }: {
    dir?: string;
    dryRun?: boolean;
  } = {}): Promise<Procedures.BumpOutcome> {
    const { project, versioning } = this.settings(dir);
    const branch = project.report().git?.branch ?? null;
    if (!branch || !Models.branchMatches(branch, versioning.commits.branches)) {
      const where = branch ?? "a detached HEAD";
      return {
        ...Procedures.unbumped(),
        reason: `${where} is not one of ${versioning.commits.branches.join(", ")}: no bump`,
      };
    }
    const context = {
      ...createContext(this.host, { dryRun }),
      projectPath: project.path,
      station: branch,
      everyCommit: true,
      versioning,
      git: new LocalGit(this.host, project.path),
      outcome: Procedures.unbumped(),
    };
    return (await Procedures.bumping.run(context)).outcome;
  }

  // git's merge driver for package.json / package-lock.json: the higher version on
  // every side, then a usual three-way merge into ours
  async mergeVersion(
    base: string,
    ours: string,
    theirs: string,
    { dir }: { dir?: string } = {},
  ): Promise<Procedures.ReconcileOutcome> {
    const { project } = this.loop(dir);
    const context = {
      ...createContext(this.host),
      git: new LocalGit(this.host, project.path),
      files: { base, ours, theirs },
      texts: { base: "", ours: "", theirs: "" },
      outcome: Procedures.unreconciled(),
    };
    return (await Procedures.reconciling.run(context)).outcome;
  }

  // name everyone of the project's commits in its .github/AUTHORS
  async authors({
    dir,
    dryRun = false,
  }: {
    dir?: string;
    dryRun?: boolean;
  } = {}): Promise<Procedures.CreditOutcome> {
    const { project } = this.loop(dir);
    const file = Models.authorsFile(project.path);
    const context = {
      ...createContext(this.host, { dryRun }),
      file,
      git: new LocalGit(this.host, project.path),
      lines: [],
      identities: [],
      outcome: Procedures.uncredited(file),
    };
    return (await Procedures.crediting.run(context)).outcome;
  }

  // the project's halo (.bos/.omnis.toml) now, against the sealed one; seal: true writes it
  async omnis({
    dir,
    seal = false,
    dryRun = false,
    allocators = DEFAULT_ALLOCATORS,
  }: {
    dir?: string;
    seal?: boolean;
    dryRun?: boolean;
    allocators?: Allocators;
  } = {}): Promise<Procedures.SealOutcome> {
    const { project } = this.loop(dir);
    const context = {
      ...createContext(this.host, { dryRun }),
      projectPath: project.path,
      git: new LocalGit(this.host, project.path),
      allocators,
      seal,
      sealed: null,
      halo: [],
      outcome: Procedures.unsealed(`${project.path}/${OMNIS_FILE}`),
    };
    return (await Procedures.sealing.run(context)).outcome;
  }

  // open the pull request of a branch's forward step on GitHub
  async propose(
    branch: string,
    { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {},
  ): Promise<Procedures.FlowOutcome> {
    const { project, loop } = this.loop(dir);
    const github = new GitHub(this.host, project.path);
    const context = {
      ...createContext(this.host, { dryRun }),
      loop,
      github,
      branch,
      outcome: Procedures.undecided(),
    };
    return (await Procedures.proposing.run(context)).outcome;
  }

  // merge a loop pull request when the loop allows it
  async automerge(
    number: number,
    { dir, dryRun = false }: { dir?: string; dryRun?: boolean } = {},
  ): Promise<Procedures.FlowOutcome> {
    const { project, loop } = this.loop(dir);
    const github = new GitHub(this.host, project.path);
    const context = {
      ...createContext(this.host, { dryRun }),
      loop,
      github,
      number,
      outcome: Procedures.undecided(),
    };
    return (await Procedures.automerging.run(context)).outcome;
  }

  toString(): string {
    return `[<Blacksmith_Organization_System::${this.workshop.path}>]`;
  }
}
