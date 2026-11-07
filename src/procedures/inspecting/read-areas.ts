import type { InspectContext } from "./report.ts";

export function readAreas({ workshop, report }: InspectContext): void {
  report.areas = workshop.inspect();
  report.strays = workshop.exists() ? workshop.strays() : [];
  report.misplaced = workshop.misplacedAreas();
}
