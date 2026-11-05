// The base of every bridge: an outside system reached through its own command line, run by
// Host.run (the one door to the machine) in one directory, so tests script it like any host.
// A bridge extends the core's mechanics; which models take which bridge is BRAINSTORM Q14.
import type { Host } from "../core/host.ts";

export class Bridge {
  readonly host: Host;
  // where the system's commands run, e.g. the directory of a repository
  readonly cwd: string;

  constructor(host: Host, cwd: string) {
    this.host = host;
    this.cwd = cwd;
  }

  // the command's output, or an error naming it ("git tag --list: …")
  protected command(bin: string, args: string[]): string {
    const { status, stdout, stderr } = this.host.run(bin, args, { cwd: this.cwd });
    if (status !== 0) {
      throw new Error(`${bin} ${args.slice(0, 2).join(" ")}: ${(stderr || stdout).trim()}`);
    }
    return stdout.trim();
  }
}
