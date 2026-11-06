// A monitor thread of the supervisor: it reads the lines handed to it and sends back those
// that match the service's alert patterns (src/core/daemon.ts, alertMatcher). Several run
// side by side, so matching never holds up the supervisor's own event loop.
import { parentPort, workerData } from "node:worker_threads";
import { alertMatcher } from "../../core/daemon.ts";

const alert = alertMatcher((workerData as { patterns: string[] }).patterns);

parentPort?.on("message", (line: string) => {
  if (alert(line)) {
    parentPort?.postMessage(line);
  }
});
