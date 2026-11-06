import type { InspectContext } from "./report.ts";

// the mirrors of the archive, so a forge copy that has one can be told apart
export function readMirrors({ workshop, report }: InspectContext): void {
  report.mirrors = workshop.archive.mirrors();
}
