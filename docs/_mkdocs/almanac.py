"""MkDocs hook: a page for every ruleset of the almanac, generated from its JSON (Q18).

The rulesets stay JSON, read by plain code; people read them as Markdown made
from resources/docs-templates/ruleset.md. Both the core's universal rulesets
(resources/almanac/rulesets/) and this project's own (docs/almanac/rulesets/)
become almanac/rulesets/<ruleset>.md. scripts/gh-wiki.py imports ruleset_pages()
to put the same pages into the GitHub wiki.
"""
import json
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parent.parent.parent
PLACES = ("resources/almanac/rulesets", "docs/almanac/rulesets")
REPO = "https://github.com/Sarverott/blacksmith-organization-system"


def _either(patterns) -> str:
    words = [f"`{p}`" for p in (patterns if isinstance(patterns, list) else [patterns])]
    return words[0] if len(words) == 1 else f"{', '.join(words[:-1])} or {words[-1]}"


def _conditions(conditions: dict) -> str:
    return "; ".join(f"{field} is {_either(patterns)}" for field, patterns in conditions.items())


def _rule(number: int, rule: dict) -> str:
    lines = [f"### {number}. `{rule['id']}` · {rule['verdict']}", "", rule["statement"], ""]
    lines.append(f"- **when**: {_conditions(rule['when'])}")
    if rule.get("unless"):
        lines.append(f"- **unless**: {_conditions(rule['unless'])}")
    if rule.get("source"):
        lines.append(f"- **source**: {rule['source']}")
    return "\n".join(lines)


def ruleset_page(ruleset: dict, source: str, repo: str = REPO) -> str:
    roles = ruleset.get("roles") or {}
    roles_text = (
        "\n## Roles\n\n" + "\n".join(f"- **{role}**: {_either(names)}" for role, names in roles.items()) + "\n"
        if roles
        else ""
    )
    template = Template((ROOT / "resources" / "docs-templates" / "ruleset.md").read_text())
    return template.substitute(
        ruleset=ruleset["ruleset"],
        about=ruleset.get("about", "Rules of the almanac."),
        source=source,
        repo=repo,
        roles=roles_text,
        rules="\n\n".join(_rule(n, rule) for n, rule in enumerate(ruleset["rules"], 1))
        or "None of its own: the rulesets after it decide.",
    )


def ruleset_pages(root: Path = ROOT, repo: str = REPO) -> dict:
    """docs-relative path of each generated page → its Markdown"""
    pages = {}
    for place in PLACES:
        for path in sorted((root / place).glob("*.json")):
            ruleset = json.loads(path.read_text())
            pages[f"almanac/rulesets/{ruleset['ruleset']}.md"] = ruleset_page(ruleset, f"{place}/{path.name}", repo)
    return pages


def on_files(files, config):
    from mkdocs.structure.files import File

    for uri, text in ruleset_pages(repo=config["repo_url"].rstrip("/")).items():
        files.append(File.generated(config, uri, content=text))
    return files
