// The workshop report as text for people. Machines get the report itself (--json).
import type { ElementNode } from "../core/element.ts";
import { inside } from "../core/paths.ts";
import type { Finding, WorkshopReport } from "../procedures/_index.ts";

const MARK = { error: "✗", warning: "!", info: "·" };

function areaLines(node: ElementNode, root: string, depth = 0): string[] {
  const mark = node.exists ? "✓" : node.mandatory ? "✗" : "·";
  const name = depth === 0 ? node.path : (inside(root, node.path) ?? node.path).split("/").pop();
  const descriptors = node.descriptors.map((d) => (d.exists ? d.name : `${d.name}?`));
  const note = !node.exists && !node.mandatory ? "  (created on first use)" : "";
  const own = `${"  ".repeat(depth)}${mark} ${name}${descriptors.length ? `  [${descriptors.join(", ")}]` : ""}${note}`;
  return [own, ...node.children.flatMap((child) => areaLines(child, root, depth + 1))];
}

function forgeLines(report: WorkshopReport): string[] {
  const { scopes } = report.forge;
  const count = scopes.reduce((sum, scope) => sum + scope.projects.length, 0);
  const lines = [`forge: ${scopes.length} scopes, ${count} projects`];
  for (const scope of scopes) {
    lines.push(
      `  ${scope.name}${scope.version ? `  vG.R.I.H ${scope.version}` : ""}${scope.repository ? "  (repository)" : ""}`,
    );
    for (const project of scope.projects) {
      const rel = inside(scope.path, project.path) ?? project.name;
      const branch = project.git?.branch ?? (project.git?.detached ? "(detached)" : "(no HEAD)");
      const version = project.version ? `v${project.version.version}` : "-";
      const parts = project.anatomy.present.length + project.anatomy.missing.length;
      lines.push(
        `    ${rel}  ${branch}  ${version}  anatomy ${project.anatomy.present.length}/${parts}`,
      );
    }
  }
  return lines;
}

function findingLines(findings: Finding[], all: boolean): string[] {
  const count = (level: Finding["level"]) => findings.filter((f) => f.level === level).length;
  const lines = [
    `findings: ${count("error")} errors, ${count("warning")} warnings, ${count("info")} notes`,
  ];
  for (const finding of findings) {
    if (finding.level === "info" && !all) {
      continue;
    }
    lines.push(
      `  ${MARK[finding.level]} ${finding.rule}  ${finding.path}\n      ${finding.message}`,
    );
  }
  if (!all && count("info")) {
    lines.push("  (notes hidden: --all shows them)");
  }
  return lines;
}

export function statusText(report: WorkshopReport, { all = false } = {}): string {
  const head = `workshop ${report.root}${report.source ? `  (found by: ${report.source})` : ""}`;
  const areas = report.areas ? areaLines(report.areas, report.root).slice(1) : [];
  const strays = report.strays.length ? [`  ! not areas: ${report.strays.join(", ")}`] : [];
  return [
    head,
    ...areas,
    ...strays,
    "",
    ...forgeLines(report),
    "",
    ...findingLines(report.findings, all),
  ].join("\n");
}

export function bootstrapText(changes: string[], dryRun: boolean): string {
  if (!changes.length) {
    return "nothing missing: the workshop is complete";
  }
  return [
    `${dryRun ? "would create" : "created"} ${changes.length}:`,
    ...changes.map((path) => `  + ${path}`),
  ].join("\n");
}
