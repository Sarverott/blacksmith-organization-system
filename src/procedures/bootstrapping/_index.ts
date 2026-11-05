import { Procedure } from "../../core/procedure.ts";
import type { BootstrapContext } from "./context.ts";
import { ensureTree } from "./ensure-tree.ts";
import { record } from "./record.ts";

export type { BootstrapContext };

export const bootstrapping = new Procedure<BootstrapContext>("bootstrapping", [
  { name: "ensure-tree", run: ensureTree },
  { name: "record", run: record },
]);
