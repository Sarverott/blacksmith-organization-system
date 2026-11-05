// One workshop event as one line, for `bos workshop watch`:
//
//   14:03:27.512  change  forge › blacksmith-organization-system › bos-skillset  README.md
//   └── when ──┘  └kind┘  └──── where: area › scope › project ───────────────┘  └ what ─┘
//
// when:  the clock time of the event (UTC, to the millisecond)
// kind:  "change" (a file's content) or "rename" (created, moved or deleted), padded so
//        the columns line up
// where: the area of the workshop, and inside the forge its scope and project;
//        "(root)" for a file at the top of the workshop
// what:  the path inside that place, when the event is below it
import type { WorkshopEvent } from "../procedures/index.ts";

// the clock time of a UNIXUSAT (unix time in milliseconds): "14:03:27.512"
// (an ISO date is "2026-11-05T14:03:27.512Z"; characters 11-23 are its time)
function timerStop(unixusat: number): string {
  return new Date(unixusat).toISOString().slice(11, 23);
}

// the place of the event: "forge › scope › project", only the parts it has
function whereHook(event: WorkshopEvent): string {
  const parts = [event.area ?? "(root)", event.scope, event.project];
  return parts.filter(Boolean).join(" › ");
}

export function eventText(event: WorkshopEvent): string {
  const when = timerStop(event.unixusat);
  const kind = event.kind.padEnd(6);
  const where = whereHook(event);
  const what = event.inner ? `  ${event.inner}` : "";
  return `${when}  ${kind}  ${where}${what}`;
}
