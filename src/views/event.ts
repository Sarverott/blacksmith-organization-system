// One workshop event as one line: time, kind, where, what.
import type { WorkshopEvent } from "../procedures/_index.ts";

export function eventText(event: WorkshopEvent): string {
  const time = new Date(event.unixusat).toISOString().slice(11, 23);
  const where = [event.area ?? "(root)", event.scope, event.project].filter(Boolean).join(" › ");
  return `${time}  ${event.kind.padEnd(6)}  ${where}${event.inner ? `  ${event.inner}` : ""}`;
}
