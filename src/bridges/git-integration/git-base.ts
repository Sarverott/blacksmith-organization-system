// git through its command line: what both ends of a repository share, a clone here
// (local-git.ts) and a place it is pushed to (remote-git.ts).
import { Bridge } from "../base.ts";

export class Git extends Bridge {
  git(args: string[]): string {
    return this.command("git", args);
  }
}
