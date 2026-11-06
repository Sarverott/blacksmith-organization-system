// The steps of the GitHub workflows (scripts/workflows/), run on a temporary clone with a
// scripted `gh` first in PATH.
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { write } from "./helpers.ts";

const script = resolve("scripts/workflows/pull-request.sh");

// origin with master at 1.0.0 and revision one commit ahead at `version`; a clone of it
function clone(version: string): string {
  const dir = mkdtempSync(join(tmpdir(), "bos-workflows-"));
  const git = (cwd: string, ...args: string[]) =>
    execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], { cwd });
  const work = join(dir, "work");
  execFileSync("git", ["init", "-q", "-b", "master", work]);
  write(join(work, "package.json"), '{ "version": "1.0.0" }\n');
  git(work, "add", ".");
  git(work, "commit", "-qm", "base");
  git(work, "checkout", "-qb", "revision");
  write(join(work, "package.json"), `{ "version": "${version}" }\n`);
  git(work, "commit", "-qam", "feat: more");
  execFileSync("git", ["clone", "-q", "--bare", work, join(dir, "origin.git")]);
  execFileSync("git", ["clone", "-q", join(dir, "origin.git"), join(dir, "clone")]);
  return dir;
}

// `gh` that logs its arguments; `pr list` finds `open` (a URL, or nothing)
function scriptedGh(dir: string, open: string): string {
  const bin = join(dir, "bin");
  write(
    join(bin, "gh"),
    `#!/bin/sh\necho "$@" >> "${dir}/gh.log"\n` +
      `case "$1 $2" in "pr list") echo "${open}";; "pr create") echo https://x/pull/2;; esac\n`,
  );
  chmodSync(join(bin, "gh"), 0o755);
  return bin;
}

function run(dir: string, open: string): string {
  const bin = scriptedGh(dir, open);
  const { status, stderr } = spawnSync("bash", [script, "revision", "master"], {
    cwd: join(dir, "clone"),
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GITHUB_OUTPUT: "" },
    encoding: "utf8",
  });
  expect(stderr).toBe("");
  expect(status).toBe(0);
  return readFileSync(join(dir, "gh.log"), "utf8");
}

describe("pull-request.sh", () => {
  it("opens the pull request titled with the version it releases", () => {
    const log = run(clone("1.1.0"), "");
    expect(log).toContain(
      "pr create --head revision --base master --title v1.1.0: revision → master",
    );
  });

  it("brings an open one up to the version it now releases", () => {
    const log = run(clone("1.1.3"), "https://x/pull/1");
    expect(log).toContain("pr edit https://x/pull/1 --title v1.1.3: revision → master");
    expect(log).toContain("merging it releases v1.1.3");
    expect(log).not.toContain("pr create");
  });
});

describe("mirrors.sh", () => {
  // one bitbucket mirror; `git` and `curl` scripted: git logs, every page answers 200
  function pushWith(token: string): string {
    const dir = mkdtempSync(join(tmpdir(), "bos-mirrors-"));
    const url = "https://bitbucket.org/w/r.git";
    const mirror = { name: "bb", host: "bitbucket.org", web: "https://bitbucket.org/w/r" };
    write(
      join(dir, ".github/bos.json"),
      JSON.stringify({
        mirrors: {
          source: { host: "github.com", web: "https://github.com/o/r" },
          to: [{ ...mirror, git: url, user: "x-token-auth", secret: "MIRROR_BB" }],
        },
      }),
    );
    const bin = join(dir, "bin");
    write(join(bin, "git"), `#!/bin/sh\necho "$@" >> "${dir}/git.log"\n`);
    write(join(bin, "curl"), "#!/bin/sh\nprintf 200\n");
    chmodSync(join(bin, "git"), 0o755);
    chmodSync(join(bin, "curl"), 0o755);
    const { status } = spawnSync("bash", [resolve("scripts/workflows/mirrors.sh"), "badges"], {
      cwd: dir,
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, MIRROR_BB: token, HOME: dir },
    });
    expect(status).toBe(0);
    return readFileSync(join(dir, "git.log"), "utf8");
  }

  // the sign-in is built from its parts here, so no literal "user:token@host" sits in the
  // source for secret scanners (GitGuardian flagged one as a Basic Auth String)
  const signIn = (user: string, token: string) => `https://${user}:${token}@bitbucket.org`;

  it("signs in to bitbucket by the kind of its token", () => {
    const access = "fake-access-token";
    const api = "ATATT-fake-api-token";
    expect(pushWith(access)).toContain(signIn("x-token-auth", access));
    expect(pushWith(api)).toContain(signIn("x-bitbucket-api-token-auth", api));
  });
});
