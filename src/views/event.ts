// One workshop event as one line: time, kind, where, what.
import type { WorkshopEvent } from "../procedures/_index.ts";

function timerStop(unixusat: number): string {
  return new Date(unixusat).toISOString().slice(11, 23);
}
function whereHook(event: WorkshopEvent): string {
  const output = [event.area ?? "(root)", event.scope, event.project];
  return output.filter(Boolean).join(" › ");
}

export function eventText(event: WorkshopEvent): string {
  const time = new Date(event.unixusat).toISOString().slice(11, 23); // WHY? at least delegate it to separed handler
  /*
  const time = timerStop(event.unixusat)
  */
  const where = [event.area ?? "(root)", event.scope, event.project].filter(Boolean).join(" › "); // and... what it suppose to be? and again: WHY?
  /*
  const where = whereHook(event)
  */
  return `${time}  ${event.kind.padEnd(6)}  ${where}${event.inner ? `  ${event.inner}` : ""}`;
  // NOTE: explain me this one please
}
