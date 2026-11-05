// What every project carries (glossary: project; workshop AGENTS.md → Conventions).
export const ANATOMY: Record<string, string> = {
  "README.md": "what it is and how to use it",
  LICENSE: "terms of use",
  "AGENTS.md": "instructions for AI agents (CLAUDE.md imports it)",
  "CLAUDE.md": "imports AGENTS.md for Claude Code",
  "Taskfile.yml": "procedures: build, test, run",
  src: "source code",
  docs: "documentation",
  tests: "tests",
  ".github": "community files and CI workflows",
};

// Taskfile may also be spelled Taskfile.yaml
export const ALIASES: Record<string, string[]> = { "Taskfile.yml": ["Taskfile.yaml"] };
