import { Procedure } from "../../core/procedure.ts";
import type { ArchiveContext } from "./context.ts";
import { check, locate, mirror, remove } from "./steps.ts";

export { type ArchiveContext, type ArchiveOutcome, unarchived } from "./context.ts";

export const archiving = new Procedure<ArchiveContext>("archiving", [
  { name: "locate", run: locate },
  { name: "check", run: check },
  { name: "mirror", run: mirror },
  { name: "remove", run: remove },
]);
