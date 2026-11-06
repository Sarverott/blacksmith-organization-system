import { Procedure } from "../../core/procedure.ts";
import type { DaemonContext } from "./context.ts";
import { act, read, settle } from "./steps.ts";

export {
  type DaemonAction,
  type DaemonContext,
  type DaemonOutcome,
  quietDaemon,
} from "./context.ts";

export const daemonizing = new Procedure<DaemonContext>("daemonizing", [
  { name: "read", run: read },
  { name: "act", run: act },
  { name: "settle", run: settle },
]);
