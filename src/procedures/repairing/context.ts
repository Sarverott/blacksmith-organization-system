import type { Context } from "../../core/context.ts";
import type { Workshop } from "../../models/index.ts";

export type Move = { from: string; to: string };

export type RepairOutcome = {
  misplaced: string[];
  moves: Move[];
  duplicates: string[];
  scaffolding: string[];
  conflicts: Move[];
  // directories removed once empty
  emptied: string[];
  applied: boolean;
};

export type RepairContext = Context & {
  workshop: Workshop;
  confirm: boolean;
  outcome: RepairOutcome;
};

export function unrepaired(): RepairOutcome {
  return {
    misplaced: [],
    moves: [],
    duplicates: [],
    scaffolding: [],
    conflicts: [],
    emptied: [],
    applied: false,
  };
}
