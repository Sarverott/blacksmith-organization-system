import type { RepairContext } from "./context.ts";

export function find(context: RepairContext): void {
  context.outcome.misplaced = context.workshop.misplacedAreas();
}

export function plan(context: RepairContext): void {
  const { host, workshop, outcome } = context;
  const scaffolding = new Set(workshop.scaffolding());
  const holder = workshop.path.replace(/\/[^/]+$/, "");
  const same = (a: string, b: string) => {
    const left = host.digest(a, "sha1");
    return left !== null && left === host.digest(b, "sha1");
  };
  const walk = (relative: string) => {
    const from = `${holder}/${relative}`;
    const to = `${workshop.path}/${relative}`;
    if (!host.exists(to)) {
      outcome.moves.push({ from, to });
      return;
    }
    if (host.isDirectory(from)) {
      if (!host.isDirectory(to)) {
        outcome.conflicts.push({ from, to });
        return;
      }
      for (const entry of host.list(from)) {
        walk(`${relative}/${entry.name}`);
      }
      return;
    }
    if (same(from, to)) {
      outcome.duplicates.push(from);
    } else if (scaffolding.has(relative)) {
      outcome.scaffolding.push(from);
    } else {
      outcome.conflicts.push({ from, to });
    }
  };
  for (const area of outcome.misplaced) {
    walk(area.slice(holder.length + 1));
  }
}

export function apply(context: RepairContext): void {
  const { host, outcome } = context;
  const touched = [
    ...outcome.moves.map((move) => move.from),
    ...outcome.duplicates,
    ...outcome.scaffolding,
  ];
  context.changes.push(...touched);
  if (!context.confirm || context.dryRun) {
    return;
  }
  for (const { from, to } of outcome.moves) {
    host.move(from, to);
  }
  for (const path of [...outcome.duplicates, ...outcome.scaffolding]) {
    host.removeTree(path);
  }
  // the directories left empty, deepest first, up to and with the area itself
  const emptyOut = (dir: string): boolean => {
    if (!host.isDirectory(dir)) {
      return !host.exists(dir);
    }
    const allEmpty = host
      .list(dir)
      .every((entry) => entry.directory && emptyOut(`${dir}/${entry.name}`));
    if (allEmpty && host.list(dir).length === 0) {
      host.removeTree(dir);
      outcome.emptied.push(dir);
      return true;
    }
    return false;
  };
  for (const area of outcome.misplaced) {
    emptyOut(area);
  }
  outcome.applied = true;
}
