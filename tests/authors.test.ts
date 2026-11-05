import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BOS, formatEntry, kindOf, NodeHost, parseEntry } from "../src/index.ts";
import { gitRepo, tempWorkshop, write } from "./helpers.ts";

// a project whose commits are by these people ("Name <email>"), each with its trailers
function project(commits: { by: string; trailers?: string[] }[], authors?: string): string {
  const dir = join(tempWorkshop(), "p");
  gitRepo(dir);
  if (authors !== undefined) {
    write(join(dir, ".github", "AUTHORS"), authors);
  }
  for (const { by, trailers = [] } of commits) {
    const [, name = "", email = ""] = by.match(/^(.*) <(.*)>$/) ?? [];
    const message = ["chore: step", trailers.join("\n")].filter(Boolean).join("\n\n");
    // env, not -c user.*: a git hook running these tests exports GIT_AUTHOR_* / GIT_COMMITTER_*
    const env = { ...process.env, GIT_AUTHOR_NAME: name, GIT_AUTHOR_EMAIL: email };
    Object.assign(env, { GIT_COMMITTER_NAME: name, GIT_COMMITTER_EMAIL: email });
    execFileSync("git", ["commit", "-q", "--allow-empty", "-m", message], { cwd: dir, env });
  }
  return dir;
}

const kind = (line: string) => {
  const entry = parseEntry(line);
  return entry && kindOf(entry);
};

const authors = (dir: string) => readFileSync(join(dir, ".github", "AUTHORS"), "utf8");

describe("authors: entries", () => {
  it("reads every kind of entry, spaces or tabs, and writes it with tabs", () => {
    const full = parseEntry(
      `Sarverott   "Sett Sarverott A.A.B."   <sett@sarverott.com>  (https://sett.sarverott.com)`,
    );
    expect(full).toEqual({
      nickname: "Sarverott",
      identity: "Sett Sarverott A.A.B.",
      email: "sett@sarverott.com",
      url: "https://sett.sarverott.com",
      signs: [],
    });
    expect(full && kindOf(full)).toBe("full");
    expect(full && formatEntry(full)).toBe(
      'Sarverott\t"Sett Sarverott A.A.B."\t<sett@sarverott.com>\t(https://sett.sarverott.com)',
    );
    expect(kind("Cleo\t<noreply@anthropic.com>")).toBe("verified");
    expect(kind("someone")).toBe("mentioned");
    expect(kind("<a@b.c>")).toBe("mentioned");
    expect(parseEntry("X <x@y> [SIGN::gpg::ABC]")?.signs).toEqual(["SIGN::gpg::ABC"]);
    expect(parseEntry("# a comment")).toBeNull();
    expect(parseEntry("  ")).toBeNull();
  });
});

describe("authors: bos project authors", () => {
  it("appends whoever the commits name and the file does not, the oldest first, once each", async () => {
    const dir = project(
      [
        { by: "Sett Sarverott <private@example.com>" },
        {
          by: "Sett Sarverott <sett@sarverott.com>",
          trailers: ["Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"],
        },
        { by: "github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" },
        {
          by: "Sett Sarverott <sett@sarverott.com>",
          trailers: ["Co-authored-by: Claude Sonnet 5.5 <noreply@anthropic.com>"],
        },
      ],
      'Sarverott   "Sett Sarverott A.A.B."   <sett@sarverott.com>  (https://sett.sarverott.com)\n# agents\nCleo\t"Claude Code (Anthropic)"\t<noreply@anthropic.com>\n',
    );
    const outcome = await new BOS(new NodeHost()).authors({ dir });
    expect(outcome).toMatchObject({
      action: "written",
      added: ["github-actions[bot]\t<41898282+github-actions[bot]@users.noreply.github.com>"],
      updated: [],
    });
    expect(authors(dir)).toBe(
      'Sarverott   "Sett Sarverott A.A.B."   <sett@sarverott.com>  (https://sett.sarverott.com)\n# agents\nCleo\t"Claude Code (Anthropic)"\t<noreply@anthropic.com>\ngithub-actions[bot]\t<41898282+github-actions[bot]@users.noreply.github.com>\n',
    );
    expect(await new BOS(new NodeHost()).authors({ dir })).toMatchObject({ action: "none" });
  });

  it("completes a mentioned entry and moves it to the bottom; plans only on a dry run; makes a missing file", async () => {
    const dir = project(
      [{ by: "Jane Doe <jane@example.com>" }, { by: "Bob <bob@example.com>" }],
      "<jane@example.com>\nBob\nAlice\n",
    );
    const bos = new BOS(new NodeHost());
    expect(await bos.authors({ dir, dryRun: true })).toMatchObject({ action: "would-write" });
    expect(authors(dir)).toBe("<jane@example.com>\nBob\nAlice\n");
    expect(await bos.authors({ dir })).toMatchObject({
      updated: ["Jane-Doe\t<jane@example.com>", "Bob\t<bob@example.com>"],
      added: [],
    });
    expect(authors(dir)).toBe("Alice\nJane-Doe\t<jane@example.com>\nBob\t<bob@example.com>\n");

    const fresh = project([{ by: "Jane Doe <jane@example.com>" }]);
    await bos.authors({ dir: fresh });
    expect(authors(fresh)).toBe("Jane-Doe\t<jane@example.com>\n");
  });
});
