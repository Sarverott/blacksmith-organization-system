import type { ProposeContext } from "./context.ts";

const BUMP = /^(chore\(release\):|bump:)/;

export function route(context: ProposeContext): void {
  const step = context.loop.step(context.branch);
  context.outcome.step = step;
  if (!step) {
    context.outcome.reason = `${context.branch} is not part of the loop`;
  } else if (!context.loop.data.autocreate) {
    context.outcome.reason = "autocreate is off";
  }
}

export function weigh(context: ProposeContext): void {
  const { outcome, loop, github } = context;
  if (outcome.reason || !outcome.step) {
    return;
  }
  const { from, to } = outcome.step;
  const { aheadBy, commits } = github.compare(to, from);
  if (aheadBy === 0) {
    outcome.reason = `${from} has nothing new for ${to}`;
  } else if (
    from !== loop.data.release &&
    !commits.some((c) => c.parents === 1 && !BUMP.test(c.message))
  ) {
    outcome.reason = `${from} has only merges and release bumps for ${to}`;
  }
}

export function open(context: ProposeContext): void {
  const { outcome, github } = context;
  if (outcome.reason || !outcome.step) {
    return;
  }
  const { from, to, automerge } = outcome.step;
  const existing = github.openPullRequest(from, to);
  if (existing !== null) {
    Object.assign(outcome, {
      action: "exists",
      pullRequest: existing,
      reason: `#${existing} is already open`,
    });
    return;
  }
  const plan = `pull request ${from} → ${to}`;
  context.changes.push(plan);
  if (context.dryRun) {
    Object.assign(outcome, { action: "would-open", reason: `would open the ${plan}` });
    return;
  }
  const body = [
    `### Loop step: \`${from}\` → \`${to}\``,
    "",
    `Opened by the BOS craft loop (${context.loop.source === "default" ? "the default loop" : `\`${context.loop.source}\``}).`,
    `Merges by itself once checked: **${automerge ? "yes" : "no, a person merges it"}**.`,
  ].join("\n");
  const number = github.createPullRequest(from, to, `Loop: ${from} → ${to}`, body);
  Object.assign(outcome, { action: "opened", pullRequest: number, reason: `opened #${number}` });
}
