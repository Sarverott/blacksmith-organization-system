// git through its command line. Only what the core needs, one method each.
import type { Host } from "../core/host.ts";

export class Git {
  readonly host: Host;
  // the directory of the repository
  readonly cwd: string;

  constructor(host: Host, cwd: string) {
    this.host = host;
    this.cwd = cwd;
  }

  git(args: string[]): string {
    const { status, stdout, stderr } = this.host.run("git", args, { cwd: this.cwd });
    if (status !== 0) throw new Error(`git ${args.slice(0, 2).join(" ")}: ${(stderr || stdout).trim()}`);
    return stdout.trim();
  }

  // is the tag in this clone (in CI: checked out with its tags)
  tagExists(tag: string): boolean {
    return this.git(["tag", "--list", tag]) === tag;
  }

  // the tags that match a glob, e.g. v1.2.*
  tags(pattern: string): string[] {
    return this.git(["tag", "--list", pattern]).split("\n").filter(Boolean);
  }

  // a three-way merge of files into ours (git merge-file); true when it has conflicts
  mergeFile(ours: string, base: string, theirs: string): boolean {
    const { status, stderr } = this.host.run("git", ["merge-file", ours, base, theirs], { cwd: this.cwd });
    if (status < 0 || status > 127) throw new Error(`git merge-file: ${stderr.trim()}`);
    return status > 0;
  }

  // everyone in the history of HEAD, oldest first: author, committer and each
  // Co-authored-by trailer, as "Name <email>" lines (repeated; the caller dedupes)
  identities(): string[] {
    const format = "%an <%ae>%n%cn <%ce>%n%(trailers:key=Co-authored-by,valueonly,separator=%x0A)";
    const { status, stdout } = this.host.run("git", ["log", "--reverse", `--format=${format}`], { cwd: this.cwd });
    // a repository without commits has nobody yet
    if (status !== 0) return [];
    return stdout.split("\n").filter((line) => line.trim());
  }
}
