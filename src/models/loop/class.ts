// The craft loop of one project: which branch goes where, and what merges by itself.
import { DEFAULT_LOOP, type LoopData } from "./data.ts";

export type LoopStep = { from: string; to: string; automerge: boolean; back: string[] };

export class Loop {
  readonly data: LoopData;
  // where the data came from: "default" or the path of a .github/bos.json
  readonly source: string;

  constructor(data: LoopData = DEFAULT_LOOP, source = "default") {
    this.data = data;
    this.source = source;
    const problems = Loop.problems(data);
    if (problems.length) throw new Error(`loop (${source}): ${problems.join("; ")}`);
  }

  static problems(data: LoopData): string[] {
    const out: string[] = [];
    const known = new Set(data.stations);
    const check = (name: string, where: string) => {
      if (!known.has(name)) out.push(`${where}: "${name}" is not a station`);
    };
    for (const [from, targets] of Object.entries(data.directions)) {
      check(from, "directions");
      if (!targets.length) out.push(`directions: "${from}" goes nowhere`);
      for (const to of targets) check(to, `directions of ${from}`);
    }
    for (const station of data.stations) if (!data.directions[station]) out.push(`"${station}" has no directions`);
    for (const name of Object.keys(data.automerge)) check(name, "automerge");
    check(data.contributors.into, "contributors.into");
    check(data.release, "release");
    if (known.has(data.contributors.pattern) || !data.contributors.pattern.endsWith("*"))
      out.push(`contributors.pattern "${data.contributors.pattern}" must end with * and not be a station`);
    return out;
  }

  isContributor(branch: string): boolean {
    return branch.startsWith(this.data.contributors.pattern.slice(0, -1)) && !this.data.stations.includes(branch);
  }

  // the forward step of a branch, or null when the branch is not part of the loop
  step(branch: string): LoopStep | null {
    if (this.isContributor(branch))
      return { from: branch, to: this.data.contributors.into, automerge: false, back: [] };
    const [to, ...back] = this.data.directions[branch] ?? [];
    if (!to) return null;
    return { from: branch, to, automerge: this.data.automerge[branch] ?? false, back };
  }

  // every forward step, in the order of the stations
  steps(): LoopStep[] {
    return this.data.stations.map((station) => this.step(station)).filter((step): step is LoopStep => step !== null);
  }
}
