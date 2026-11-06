import type { Context } from "../../core/context.ts";
import type { Forge } from "../../models/index.ts";

export type CreateKind = "scope" | "project" | "import";

export type CreateOutcome = {
  kind: CreateKind;
  scope: string;
  // the scope's path for kind scope, else the project's
  path: string;
  url: string | null;
  // it was there before (a project create then only fills in what is missing)
  existed: boolean;
  workspace: string | null;
  anatomy: { present: string[]; missing: string[] } | null;
  // every path made (or, in a dry run, that would be)
  changes: string[];
};

export type CreateContext = Context & {
  forge: Forge;
  // the scope (a/b for a nested one) and the project's name; import: taken from url when empty
  scopeName: string;
  name: string;
  seed: boolean;
  author: string;
  year: string;
  outcome: CreateOutcome;
};

export function uncreated(kind: CreateKind, url: string | null = null): CreateOutcome {
  return {
    kind,
    scope: "",
    path: "",
    url,
    existed: false,
    workspace: null,
    anatomy: null,
    changes: [],
  };
}
