# docs-templates

Templates of the pages only the GitHub wiki has, rendered by
`scripts/gh-wiki.py` (`task docs:wiki`) with Python's `string.Template`
(`$name`; a literal dollar is `$$`). Edit them here, never in the wiki.

| Template | Becomes | Variables |
| -------- | ------- | --------- |
| `Home.md` | the wiki's front page | `$content` (docs/README.md, links rewritten), `$version`, `$repo`, `$docs` |
| `_Sidebar.md` | the menu beside every page | `$nav` (the MkDocs nav as a list), `$version`, `$repo`, `$docs` |
| `_Footer.md` | the line below every page | `$version`, `$repo`, `$docs` |

`$repo` is the repository's URL, `$docs` the Read the Docs site, `$version`
the version in `package.json`.
