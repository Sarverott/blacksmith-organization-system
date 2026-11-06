// Getting started with the BOS core as a library. It only reads: bootstrap and authors run
// as dry runs, so it can be tried on any workshop without changing it.
//   WORKSHOP_ROOT=/run/media/<you>/<partition>/ npm start
import { BOS, NodeHost } from "blacksmith-organization-system";

// 1. The machine. BOS touches it only through a Host; NodeHost is the one for Node.js.
//    new BOS() without it throws: "give it the machine".
const host = new NodeHost();

// 2. The workshop. { workshop } is the workshop itself (a directory named __WORKSHOP) or
//    the directory that holds one, e.g. a partition root. Without it BOS looks at
//    $BOS_WORKSHOP, $WORKSHOP_ROOT, a __WORKSHOP above the current directory, ~/__WORKSHOP.
//    Try things on a development workshop, not the home one (bos almanac judge says why).
const root = process.env.BOS_WORKSHOP ?? process.env.WORKSHOP_ROOT;
if (!root) {
  console.error("Set WORKSHOP_ROOT to the directory that holds your development __WORKSHOP.");
  process.exit(1);
}
const bos = new BOS(host, { workshop: root });

// String(bos) names it; console.log(bos) shows only its host and options, because the
// workshop is a getter (found once, then kept): `delete bos.workshop` removes nothing.
console.log(String(bos));
console.log("found by:", bos.workshop.located?.source);

// 3. Every method that works is async: await it (or .then), else you print a Promise.
//    A dry run plans exactly what the real run would create, and writes nothing.
const plan = await bos.bootstrap({ dryRun: true });
console.log(
  plan.changes.length
    ? `bootstrap would create:\n  ${plan.changes.join("\n  ")}`
    : "bootstrap: nothing missing",
);

// 4. The areas, as elements: each knows its path and whether it exists.
for (const area of bos.workshop.areas) {
  console.log(`  ${area.exists() ? "✓" : "✗"} ${area.constructor.type.padEnd(9)} ${area.path}`);
}

// 5. Inspect: the whole workshop as one report, with findings (reads only).
const report = await bos.inspect();
const scopes = report.forge.scopes;
console.log(`\n${scopes.length} scopes, ${scopes.flatMap((s) => s.projects).length} projects`);
for (const finding of report.findings.slice(0, 5)) {
  console.log(`  ${finding.level.padEnd(7)} ${finding.rule}: ${finding.path}`);
}

// 6. The project around the current directory (a git repository): who made it. authors()
//    writes .github/AUTHORS - here only as a dry run. Outside a repository it throws.
try {
  const credit = await bos.authors({ dryRun: true });
  console.log(`\n${credit.file}: ${credit.added.length} would be added`);
} catch (error) {
  console.log(`\nno project here: ${error.message}`);
}

// 7. The almanac: does a case break a rule of the environment? In words or as fields.
console.log("");
for (const words of [
  "Cleo pushes development and dev/Cleo",
  "Cleo pushes master",
  "cat .env",
  { role: "agent", action: "publish", target: "npm" },
]) {
  const { judgement } = await bos.judge(words);
  console.log(`${judgement.verdict.padEnd(9)} ${JSON.stringify(words)}`);
  console.log(`          ${judgement.rule?.statement ?? "no rule applies: ask"}`);
}

// 8. Situations met before: after these events, what usually comes next, and what solved it.
const { prediction, chains } = await bos.recall(["commit", "hook:bump-version"]);
console.log(`\nafter ${prediction.after}:`);
for (const { event, p } of prediction.next) {
  console.log(`  ${Math.round(p * 100)}% ${event}`);
}
console.log(`known: ${chains[0]?.id} - ${chains[0]?.solution}`);
