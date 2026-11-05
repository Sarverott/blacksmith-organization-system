// The bridges: one base runs every outside system's command; git's two ends share it.
import { describe, expect, it } from "vitest";

import {
  Bitbucket,
  Bridge,
  Git,
  Gitea,
  GitHub,
  GitLab,
  LocalGit,
  NodeHost,
  RemoteGit,
  type RunResult,
  SourceHut,
} from "../src/index.ts";

// a host that answers every command the same, and remembers where it ran
class OneAnswer extends NodeHost {
  readonly calls: string[] = [];
  readonly answer: RunResult;
  constructor(answer: RunResult) {
    super();
    this.answer = answer;
  }
  override run(command: string, args: string[], options?: { cwd?: string }): RunResult {
    this.calls.push(`${options?.cwd} ${command} ${args.join(" ")}`);
    return this.answer;
  }
}

describe("bridges", () => {
  it("run their commands in their directory, and name a failed one", () => {
    const ok = new OneAnswer({ status: 0, stdout: "v1.0.0\n", stderr: "" });
    expect(new LocalGit(ok, "/repo").tags("v1.*")).toEqual(["v1.0.0"]);
    expect(ok.calls).toEqual(["/repo git tag --list v1.*"]);

    const failed = new OneAnswer({ status: 128, stdout: "", stderr: "not a git repository\n" });
    expect(() => new GitHub(failed, "/repo").gh(["pr", "list"])).toThrow(
      "gh pr list: not a git repository",
    );
  });

  it("are one family: git's two ends, the hosts of remotes", () => {
    const host = new NodeHost();
    expect(new LocalGit(host, ".")).toBeInstanceOf(Git);
    for (const Remote of [GitHub, Gitea, GitLab, Bitbucket, SourceHut]) {
      const remote = new Remote(host, ".", "mirror");
      expect(remote).toBeInstanceOf(RemoteGit);
      expect(remote).toBeInstanceOf(Bridge);
      expect(remote.role).toBe("mirror");
      expect(Remote.domain).toMatch(/\./);
    }
    expect(new GitHub(host, ".").role).toBe("source");
  });
});
