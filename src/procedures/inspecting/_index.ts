import { Procedure } from "../../core/procedure.ts";
import { judge } from "./judge.ts";
import { readAreas } from "./read-areas.ts";
import { readForge } from "./read-forge.ts";
import { readMirrors } from "./read-mirrors.ts";
import { readOmnis } from "./read-omnis.ts";
import type { InspectContext } from "./report.ts";

export {
  emptyReport,
  type Finding,
  type InspectContext,
  type ScopeReport,
  type WorkshopReport,
} from "./report.ts";

export const inspecting = new Procedure<InspectContext>("inspecting", [
  { name: "read-areas", run: readAreas },
  { name: "read-forge", run: readForge },
  { name: "read-omnis", run: readOmnis },
  { name: "read-mirrors", run: readMirrors },
  { name: "judge", run: judge },
]);
