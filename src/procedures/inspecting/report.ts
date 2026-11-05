import type { Context } from "../../core/context.ts";
import type { ElementNode } from "../../core/element.ts";
import type { ProjectReport, Workshop } from "../../models/_index.ts";

export type Finding = { level: "error" | "warning" | "info"; rule: string; path: string; message: string };

export type ScopeReport = {
  name: string;
  path: string;
  repository: boolean;
  version: string | null;
  projects: ProjectReport[];
};

export type WorkshopReport = {
  root: string;
  source: string | null;
  areas: ElementNode | null;
  strays: string[];
  forge: { looseFiles: string[]; scopes: ScopeReport[] };
  findings: Finding[];
};

export type InspectContext = Context & { workshop: Workshop; report: WorkshopReport };

export function emptyReport(workshop: Workshop): WorkshopReport {
  return {
    root: workshop.path,
    source: workshop.located?.source ?? null,
    areas: null,
    strays: [],
    forge: { looseFiles: [], scopes: [] },
    findings: [],
  };
}
