// The workshop report as text for people (`bos workshop status`). Machines get the report
// itself (--json). Three blocks: the areas as a tree, the forge's scopes and projects, the
// findings.
import type { ElementNode } from "../core/element.ts";
import { inside } from "../core/paths.ts";
import type { ProjectReport } from "../models/index.ts";
import type { Finding, ScopeReport, WorkshopReport } from "../procedures/index.ts";

// ---- areas: one line per element, indented by depth ----
//   ✓ craftbook  [manifest.json]
//     · scrapnotes  (created on first use)

// ✓ there, ✗ missing and needed, · missing and only made when first used
function areaMark(node: ElementNode): string {
  if (node.exists) {
    return "✓";
  }
  return node.mandatory ? "✗" : "·";
}

// the descriptor files of an element; a missing one ends with ?
function descriptorsText(node: ElementNode): string {
  if (!node.descriptors.length) {
    return "";
  }
  const names = node.descriptors.map((file) => (file.exists ? file.name : `${file.name}?`));
  return `  [${names.join(", ")}]`;
}

function areaLines(node: ElementNode, root: string, depth = 0): string[] {
  const indent = "  ".repeat(depth);
  const name = depth === 0 ? node.path : (inside(root, node.path) ?? node.path).split("/").pop();
  const later = !node.exists && !node.mandatory ? "  (created on first use)" : "";
  const own = `${indent}${areaMark(node)} ${name}${descriptorsText(node)}${later}`;
  const children = node.children.flatMap((child) => areaLines(child, root, depth + 1));
  return [own, ...children];
}

// ---- forge: each scope, then its projects ----
//   blacksmith-organization-system  vG.R.I.H 0.1.2.3  (repository)
//     bos-skillset  development  v1.3.0  anatomy 8/8

function scopeLine(scope: ScopeReport): string {
  const version = scope.version ? `  vG.R.I.H ${scope.version}` : "";
  const repository = scope.repository ? "  (repository)" : "";
  return `  ${scope.name}${version}${repository}`;
}

function projectLine(scope: ScopeReport, project: ProjectReport): string {
  const where = inside(scope.path, project.path) ?? project.name;
  const branch = project.git?.branch ?? (project.git?.detached ? "(detached)" : "(no HEAD)");
  const version = project.version ? `v${project.version.version}` : "-";
  const { present, missing } = project.anatomy;
  return `    ${where}  ${branch}  ${version}  anatomy ${present.length}/${present.length + missing.length}`;
}

function forgeLines(report: WorkshopReport): string[] {
  const { scopes } = report.forge;
  const projects = scopes.reduce((sum, scope) => sum + scope.projects.length, 0);
  const lines = [`forge: ${scopes.length} scopes, ${projects} projects`];
  for (const scope of scopes) {
    lines.push(scopeLine(scope));
    lines.push(...scope.projects.map((project) => projectLine(scope, project)));
  }
  return lines;
}

// ---- findings: counted, then each (notes only with --all) ----

const MARK = { error: "✗", warning: "!", info: "·" };

function findingLines(findings: Finding[], all: boolean): string[] {
  const count = (level: Finding["level"]) => findings.filter((f) => f.level === level).length;
  const shown = findings.filter((finding) => all || finding.level !== "info");
  const lines = [
    `findings: ${count("error")} errors, ${count("warning")} warnings, ${count("info")} notes`,
    ...shown.map(
      (finding) =>
        `  ${MARK[finding.level]} ${finding.rule}  ${finding.path}\n      ${finding.message}`,
    ),
  ];
  if (!all && count("info")) {
    lines.push("  (notes hidden: --all shows them)");
  }
  return lines;
}

export function statusText(report: WorkshopReport, { all = false } = {}): string {
  const found = report.source ? `  (found by: ${report.source})` : "";
  // the root itself is the head line, so the tree starts with its areas
  const areas = report.areas ? areaLines(report.areas, report.root).slice(1) : [];
  const strays = report.strays.length ? [`  ! not areas: ${report.strays.join(", ")}`] : [];
  return [
    `workshop ${report.root}${found}`,
    ...areas,
    ...strays,
    "",
    ...forgeLines(report),
    "",
    ...findingLines(report.findings, all),
  ].join("\n");
}

// what `bos workshop bootstrap` created (or would, in a dry run)
export function bootstrapText(changes: string[], dryRun: boolean): string {
  if (!changes.length) {
    return "nothing missing: the workshop is complete";
  }
  const verb = dryRun ? "would create" : "created";
  return [`${verb} ${changes.length}:`, ...changes.map((path) => `  + ${path}`)].join("\n");
}
