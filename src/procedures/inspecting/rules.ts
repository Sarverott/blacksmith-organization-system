// One function per concern; each returns the findings it sees in the report.
import type { ElementNode } from "../../core/element.ts";
import { mirrorName } from "../../models/index.ts";
import type { Finding, WorkshopReport } from "./report.ts";

type Rule = (report: WorkshopReport) => Finding[];

const walk = (node: ElementNode | null): ElementNode[] =>
  node ? [node, ...node.children.flatMap((child) => walk(child))] : [];

export const missingArea: Rule = (report) =>
  walk(report.areas)
    .filter((node) => node.mandatory && !node.exists)
    .map((node) => ({
      level: "error",
      rule: "missing-area",
      path: node.path,
      message: `${node.type} is missing (bos workshop bootstrap creates it)`,
    }));

export const missingDescriptor: Rule = (report) =>
  walk(report.areas)
    .filter((node) => node.exists)
    .flatMap((node) =>
      node.descriptors
        .filter((descriptor) => !descriptor.exists)
        .map((descriptor) => ({
          level: "warning" as const,
          rule: "missing-descriptor",
          path: `${node.path}/${descriptor.name}`,
          message: `${node.type} has no ${descriptor.name}`,
        })),
    );

export const areasBesideWorkshop: Rule = (report) =>
  report.misplaced.map((path) => ({
    level: "error",
    rule: "areas-beside-workshop",
    path,
    message:
      "an area of a workshop outside it (a second workshop half-made beside it): bos workshop repair moves what it holds inside",
  }));

export const strayInRoot: Rule = (report) =>
  report.strays.map((name) => ({
    level: "warning",
    rule: "stray-in-root",
    path: `${report.root}/${name}`,
    message: "not a workshop area: move it into one of them",
  }));

export const looseInForge: Rule = (report) =>
  report.forge.looseFiles.map((name) => ({
    level: "info",
    rule: "loose-in-forge",
    path: `${report.root}/forge/${name}`,
    message: "a file in the forge itself, outside any scope",
  }));

export const scopeWithoutVersion: Rule = (report) =>
  report.forge.scopes
    .filter((scope) => !scope.version)
    .map((scope) => ({
      level: "info",
      rule: "scope-without-version",
      path: scope.path,
      message: "no GRIH version yet (bos scope bump <scope> <event> starts it)",
    }));

const projects = (report: WorkshopReport) => report.forge.scopes.flatMap((scope) => scope.projects);

export const workOnMaster: Rule = (report) =>
  projects(report)
    .filter((project) => project.git?.branch === "master" || project.git?.branch === "main")
    .map((project) => ({
      level: "warning",
      rule: "work-on-master",
      path: project.path,
      message: `checked out on ${project.git?.branch}: work happens on development or dev/<name>; a read-only clone belongs in the archive (bos archive mirror ${project.path})`,
    }));

// a project of the forge whose mirror is in the archive already: the forge copy can go
export const mirroredInForge: Rule = (report) => {
  const mirrors = new Set(report.mirrors);
  const forge = `${report.root}/forge/`;
  return projects(report)
    .filter((project) => mirrors.has(mirrorName(project.path.slice(forge.length))))
    .map((project) => ({
      level: "info",
      rule: "mirrored-in-forge",
      path: project.path,
      message: `mirrored in archive/.repos-mirrors/ already: bos archive mirror ${project.path} --confirm removes this copy`,
    }));
};

export const misspeltBranch: Rule = (report) =>
  projects(report)
    .filter((project) => project.git?.branch === "developement")
    .map((project) => ({
      level: "info",
      rule: "misspelt-branch",
      path: project.path,
      message: "on developement: the branch is called development now (decision Q1)",
    }));

export const incompleteAnatomy: Rule = (report) =>
  projects(report)
    .filter((project) => project.anatomy.missing.length)
    .map((project) => ({
      level: "info",
      rule: "incomplete-anatomy",
      path: project.path,
      message: `missing ${project.anatomy.missing.join(", ")}`,
    }));

export const omnisDrift: Rule = (report) =>
  report.omnis
    .filter(({ drift }) => drift.added.length || drift.changed.length || drift.removed)
    .map(({ path, sealedAt, drift }) => ({
      level: "warning",
      rule: "omnis-drift",
      path,
      message:
        `changed since sealed at UNIXUSAT=${sealedAt}: ${drift.changed.length} changed, ` +
        `${drift.added.length} added, ${drift.removed} removed (bos project omnis shows them)`,
    }));

export const RULES: Rule[] = [
  areasBesideWorkshop,
  missingArea,
  missingDescriptor,
  strayInRoot,
  looseInForge,
  scopeWithoutVersion,
  workOnMaster,
  mirroredInForge,
  misspeltBranch,
  incompleteAnatomy,
  omnisDrift,
];
