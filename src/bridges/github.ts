// GitHub through its CLI, `gh` (authenticated by GH_TOKEN in GitHub Actions, or `gh auth login`).
import type { Host } from "../core/host.ts";

export type Comparison = { aheadBy: number; commits: { parents: number; message: string }[] };
export type PullRequest = { number: number; state: string; base: string; head: string; crossRepository: boolean };

export class GitHub {
  readonly host: Host;
  // the directory of the repository; gh finds the repository from its remote
  readonly cwd: string;

  constructor(host: Host, cwd: string) {
    this.host = host;
    this.cwd = cwd;
  }

  gh(args: string[]): string {
    const { status, stdout, stderr } = this.host.run("gh", args, { cwd: this.cwd });
    if (status !== 0) throw new Error(`gh ${args.slice(0, 2).join(" ")}: ${(stderr || stdout).trim()}`);
    return stdout.trim();
  }

  json<T>(args: string[]): T {
    return JSON.parse(this.gh(args)) as T;
  }

  // owner/name: $GITHUB_REPOSITORY inside Actions, else asked from gh
  repository(): string {
    return (
      this.host.env("GITHUB_REPOSITORY") ||
      this.gh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"])
    );
  }

  // what head has that base has not
  compare(base: string, head: string): Comparison {
    const raw = this.json<{ ahead_by: number; commits: { parents: unknown[]; commit: { message: string } }[] }>([
      "api",
      `repos/${this.repository()}/compare/${base}...${head}`,
    ]);
    return {
      aheadBy: raw.ahead_by,
      commits: raw.commits.map((c) => ({ parents: c.parents.length, message: c.commit.message })),
    };
  }

  // the open pull request from head into base, if any
  openPullRequest(head: string, base: string): number | null {
    const found = this.json<{ number: number }[]>([
      "pr",
      "list",
      "--head",
      head,
      "--base",
      base,
      "--state",
      "open",
      "--json",
      "number",
    ]);
    return found[0]?.number ?? null;
  }

  createPullRequest(head: string, base: string, title: string, body: string): number {
    const url = this.gh(["pr", "create", "--head", head, "--base", base, "--title", title, "--body", body]);
    const number = Number(url.replace(/\/+$/, "").split("/").pop());
    if (!Number.isInteger(number)) throw new Error(`gh pr create: no pull request number in "${url}"`);
    return number;
  }

  pullRequest(number: number): PullRequest {
    const raw = this.json<{
      number: number;
      state: string;
      baseRefName: string;
      headRefName: string;
      isCrossRepository: boolean;
    }>(["pr", "view", String(number), "--json", "number,state,baseRefName,headRefName,isCrossRepository"]);
    return {
      number: raw.number,
      state: raw.state,
      base: raw.baseRefName,
      head: raw.headRefName,
      crossRepository: raw.isCrossRepository,
    };
  }

  merge(number: number): void {
    this.gh(["pr", "merge", String(number), "--merge"]);
  }
}
