#!/usr/bin/env python3
"""Copies the docs into the GitHub wiki's checkout, in the wiki's own shape.

    uv run --project docs python scripts/gh-wiki.py [--wiki docs/.gh-wiki]   (task docs:wiki)

The wiki is flat: docs/glossary/grih.md becomes the page glossary-grih, a
folder's README.md the page named after the folder (docs/README.md is Home).
Links between docs pages become wiki links, Obsidian [[links]] too; links to
anything else point at the file in the repository. Home, _Sidebar and _Footer
are rendered from resources/docs-templates/ (the sidebar from the MkDocs
nav). Pages written last time and gone from the docs are removed (listed in
the wiki's .bos-wiki.json); pages written by hand in the wiki are left alone.
Committing and pushing the wiki is left to the caller (loop-master-release-and-publish.yml).

Python, not the TypeScript core: it is a build-side tool of the docs, run in
the docs' uv project next to MkDocs (whose YAML loader it borrows).
"""

import argparse
import json
import posixpath
import re
from pathlib import Path
from string import Template

import yaml

ROOT = Path(__file__).resolve().parent.parent
LINK = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)\s]+)(\s+\"[^\"]*\")?\)")
WIKILINK = re.compile(r"\[\[([^\]|#]+)(#[^\]|]*)?(?:\|([^\]]+))?\]\]")
FENCE = re.compile(r"^(```|~~~)")
MANIFEST = ".bos-wiki.json"


class Loader(yaml.SafeLoader):
    """mkdocs.yml with its !ENV and !!python tags read as plain values."""


Loader.add_multi_constructor("", lambda loader, suffix, node: None)


def page_name(source: str) -> str:
    """docs-relative path of a page → its wiki page name."""
    path = posixpath.splitext(source)[0]
    if posixpath.basename(path) == "README":
        path = posixpath.dirname(path)
    if not path:
        return "Home"
    return path.lstrip(".").replace("/", "-")


def heading(path: Path) -> str:
    """the page's first # heading, without what follows a colon."""
    for line in path.read_text().splitlines():
        if line.startswith("# "):
            return line[2:].split(":")[0].strip()
    return path.stem


def nav_pages(nav, docs: Path, depth=0):
    """the MkDocs nav → (sidebar lines, every page in it); Home is not listed."""
    lines, pages = [], []
    for item in nav or []:
        title, value = next(iter(item.items())) if isinstance(item, dict) else (None, item)
        if isinstance(value, list):
            sub_lines, sub_pages = nav_pages(value, docs, depth + 1)
            lines.append(f"{'  ' * depth}- **{title}**")
            lines += sub_lines
            pages += sub_pages
        else:
            pages.append(value)
            if page_name(value) == "Home":
                continue
            label = title or heading(docs / value)
            lines.append(f"{'  ' * depth}- [{label}]({page_name(value)})")
    return lines, pages


def rewrite(text: str, source: str, pages: set, by_stem: dict, repo: str) -> str:
    here = posixpath.dirname(source)

    def link(match):
        label, target, title = match.group(1), match.group(2), match.group(3) or ""
        if re.match(r"^[a-z]+:|^#|^/", target):
            return match.group(0)
        path, _, anchor = target.partition("#")
        resolved = posixpath.normpath(posixpath.join(here, path))
        if resolved.endswith("/") or not posixpath.splitext(resolved)[1]:
            resolved = posixpath.join(resolved, "README.md")
        anchor = f"#{anchor}" if anchor else ""
        if resolved in pages:
            return f"[{label}]({page_name(resolved)}{anchor}{title})"
        outside = posixpath.normpath(posixpath.join("docs", resolved.removesuffix("/README.md")))
        return f"[{label}]({repo}/blob/master/{outside}{anchor}{title})"

    def wikilink(match):
        target, label = match.group(1).strip(), (match.group(3) or match.group(1)).strip()
        found = by_stem.get(target.lower())
        return f"[{label}]({page_name(found)})" if found else label

    out, fenced = [], False
    for line in text.splitlines(keepends=True):
        if FENCE.match(line.lstrip()):
            fenced = not fenced
        out.append(line if fenced else WIKILINK.sub(wikilink, LINK.sub(link, line)))
    return "".join(out)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--wiki", default=str(ROOT / "docs" / ".gh-wiki"), help="the wiki's checkout")
    parser.add_argument("--dry-run", action="store_true", help="only list what would be written")
    args = parser.parse_args()

    docs = ROOT / "docs"
    wiki = Path(args.wiki)
    config = yaml.load((docs / "mkdocs.yml").read_text(), Loader=Loader)
    repo = config["repo_url"].rstrip("/")
    site = "https://blacksmith-organization-system.readthedocs.io/"
    version = json.loads((ROOT / "package.json").read_text())["version"]
    values = {"repo": repo, "docs": site, "version": version}
    templates = ROOT / "resources" / "docs-templates"

    nav, pages = nav_pages(config["nav"], docs)
    page_set = set(pages)
    by_stem = {posixpath.splitext(posixpath.basename(p))[0].lower(): p for p in pages}

    written = {}
    for source in pages:
        text = rewrite((docs / source).read_text(), source, page_set, by_stem, repo)
        name = page_name(source)
        if name == "Home":
            text = Template((templates / "Home.md").read_text()).substitute(values, content=text.rstrip())
        written[f"{name}.md"] = text
    written["_Sidebar.md"] = Template((templates / "_Sidebar.md").read_text()).substitute(values, nav="\n".join(nav))
    written["_Footer.md"] = Template((templates / "_Footer.md").read_text()).substitute(values)

    manifest = wiki / MANIFEST
    before = set(json.loads(manifest.read_text())) if manifest.exists() else set()
    stale = sorted(before - set(written))
    if args.dry_run:
        print("\n".join([*(f"write {n}" for n in written), *(f"remove {n}" for n in stale)]))
        return
    if not (wiki / ".git").exists():
        raise SystemExit(f"{wiki} is not a checkout of the wiki: git clone <repo>.wiki.git {wiki}")
    for name, text in written.items():
        (wiki / name).write_text(text)
    for name in stale:
        (wiki / name).unlink(missing_ok=True)
    manifest.write_text(json.dumps(sorted(written), indent=2) + "\n")
    print(f"{len(written)} pages written to {wiki}, {len(stale)} removed")


if __name__ == "__main__":
    main()
