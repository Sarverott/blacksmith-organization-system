// extends git-base
// A clone on this machine: its tags, its history, merges of its files. Only what the core
// needs, one method each.
import { Git } from "./git-base.ts";

export class LocalGit extends Git {
  // is the tag in this clone (in CI: checked out with its tags)
  tagExists(tag: string): boolean {
    return this.git(["tag", "--list", tag]) === tag;
  }

  // the tags that match a glob, e.g. v1.2.*
  tags(pattern: string): string[] {
    return this.git(["tag", "--list", pattern]).split("\n").filter(Boolean);
  }

  // the files below dir (relative to it) that no .gitignore leaves out: tracked ones
  // and new ones (git ls-files --cached --others --exclude-standard)
  files(dir = "."): string[] {
    return this.git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", dir])
      .split("\0")
      .filter(Boolean);
  }

  // what is not committed: modified, staged and new files (git status --porcelain), one each
  uncommitted(): string[] {
    return this.git(["status", "--porcelain", "--untracked-files=all"]).split("\n").filter(Boolean);
  }

  // the commit checked out (HEAD), null in a repository without commits
  head(): string | null {
    const { status, stdout } = this.host.run("git", ["rev-parse", "--verify", "-q", "HEAD"], {
      cwd: this.cwd,
    });
    return status === 0 ? stdout.trim() : null;
  }

  // every ref's commit (git for-each-ref), e.g. to check another clone holds them all
  refCommits(): string[] {
    return this.git(["for-each-ref", "--format=%(objectname)"]).split("\n").filter(Boolean);
  }

  // does this clone hold the commit
  hasCommit(sha: string): boolean {
    return (
      this.host.run("git", ["cat-file", "-e", `${sha}^{commit}`], { cwd: this.cwd }).status === 0
    );
  }

  // the URL of a remote, null when there is none
  remoteUrl(name = "origin"): string | null {
    const { status, stdout } = this.host.run("git", ["remote", "get-url", name], { cwd: this.cwd });
    return status === 0 ? stdout.trim() || null : null;
  }

  // a new repository here, its first branch named (development: where work happens)
  init(branch = "development"): void {
    this.git(["init", "--quiet", "--initial-branch", branch, "."]);
  }

  // a clone of url into target (relative to this directory, or absolute)
  clone(url: string, target: string): void {
    this.git(["clone", "--quiet", url, target]);
  }

  // a value of git config (user.name…), null when it is not set
  config(key: string): string | null {
    const { status, stdout } = this.host.run("git", ["config", "--get", key], { cwd: this.cwd });
    return status === 0 ? stdout.trim() || null : null;
  }

  // a bare mirror of source at target (git clone --mirror): every ref, the remotes' too
  cloneMirror(source: string, target: string): void {
    this.git(["clone", "--quiet", "--mirror", source, target]);
  }

  // in a mirror: every ref of source fetched again, gone ones pruned
  fetchMirror(source: string): void {
    this.git(["fetch", "--quiet", "--prune", source, "+refs/*:refs/*"]);
  }

  setRemoteUrl(name: string, url: string): void {
    this.git(["remote", "set-url", name, url]);
  }

  // a three-way merge of files into ours (git merge-file); true when it has conflicts
  mergeFile(ours: string, base: string, theirs: string): boolean {
    const { status, stderr } = this.host.run("git", ["merge-file", ours, base, theirs], {
      cwd: this.cwd,
    });
    if (status < 0 || status > 127) {
      throw new Error(`git merge-file: ${stderr.trim()}`);
    }
    return status > 0;
  }

  // everyone in the history of HEAD, oldest first: author, committer and each
  // Co-authored-by trailer, as "Name <email>" lines (repeated; the caller dedupes)
  identities(): string[] {
    const format = "%an <%ae>%n%cn <%ce>%n%(trailers:key=Co-authored-by,valueonly,separator=%x0A)";
    const { status, stdout } = this.host.run("git", ["log", "--reverse", `--format=${format}`], {
      cwd: this.cwd,
    });
    // a repository without commits has nobody yet
    if (status !== 0) {
      return [];
    }
    return stdout.split("\n").filter((line) => line.trim());
  }
}
