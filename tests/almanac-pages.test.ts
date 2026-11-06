// Q18: every ruleset's JSON gets a page in the docs (docs/_mkdocs/almanac.py generates it);
// the nav of docs/mkdocs.yml must list it, or the page is built but not reachable.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const nav = readFileSync("docs/mkdocs.yml", "utf8");
const rulesets = ["resources/almanac/rulesets", "docs/almanac/rulesets"].flatMap((dir) =>
  readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(`${dir}/${name}`, "utf8")).ruleset as string),
);

describe("the almanac's pages", () => {
  it.each(rulesets)("ruleset %s is in the docs' nav", (ruleset) => {
    expect(nav).toContain(`almanac/rulesets/${ruleset}.md`);
  });
});
