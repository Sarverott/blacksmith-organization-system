import { drift } from "../../core/omnis.ts";
import { haloOf, sealedOf } from "../sealing/_index.ts";
import type { InspectContext } from "./report.ts";

// every project with a sealed halo, against its files now (projects without one cost nothing)
export function readOmnis({ host, report }: InspectContext): void {
  for (const project of report.forge.scopes.flatMap((scope) => scope.projects)) {
    const sealed = sealedOf(host, project.path);
    if (!sealed || !project.git) {
      continue;
    }
    const now = haloOf(host, project.path, sealed.allocators);
    report.omnis.push({ path: project.path, sealedAt: sealed.unixusat, drift: drift(sealed, now) });
  }
}
