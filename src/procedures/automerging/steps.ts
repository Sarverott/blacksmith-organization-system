import type { AutomergeContext } from "./context.ts";

export function read(context: AutomergeContext): void {
  const pr = context.github.pullRequest(context.number);
  context.pullRequest = pr;
  context.outcome.pullRequest = pr.number;
  if (pr.state !== "OPEN") {
    context.outcome.reason = `#${pr.number} is ${pr.state.toLowerCase()}`;
  }
}

export function decide(context: AutomergeContext): void {
  const { outcome, pullRequest: pr, loop } = context;
  if (outcome.reason || !pr) {
    return;
  }
  const step = loop.step(pr.head);
  outcome.step = step;
  const forward = step !== null && step.to === pr.base;
  if (pr.crossRepository) {
    outcome.reason = `#${pr.number} comes from a fork: a person merges it`;
  } else if (!forward) {
    outcome.reason = `${pr.head} → ${pr.base} is not a forward step of the loop: a person merges it`;
  } else if (!step.automerge) {
    outcome.reason = `automerge is off for ${pr.head} → ${pr.base}: a person merges it`;
  }
}

export function merge(context: AutomergeContext): void {
  const { outcome, pullRequest: pr } = context;
  if (outcome.reason || !pr) {
    return;
  }
  context.changes.push(`merge of #${pr.number} ${pr.head} → ${pr.base}`);
  if (context.dryRun) {
    Object.assign(outcome, { action: "would-merge", reason: `would merge #${pr.number}` });
    return;
  }
  context.github.merge(pr.number);
  Object.assign(outcome, {
    action: "merged",
    reason: `merged #${pr.number} ${pr.head} → ${pr.base}`,
  });
}
