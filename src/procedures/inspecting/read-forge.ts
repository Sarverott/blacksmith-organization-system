import type { InspectContext } from "./report.ts";

export function readForge({ workshop, report }: InspectContext): void {
  const forge = workshop.forge;
  if (!forge.exists()) {
    return;
  }
  report.forge.looseFiles = forge.looseFiles();
  report.forge.scopes = forge.scopes().map((scope) => ({
    name: scope.name,
    path: scope.path,
    repository: scope.isRepository(),
    version: scope.version(),
    projects: scope.projects().map((project) => project.report()),
  }));
}
