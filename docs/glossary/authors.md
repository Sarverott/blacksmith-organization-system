# Authors

> Every entity that makes a project, one line each: people, AI agents, bots
> (GitHub Actions, dependabot…). A project keeps them in `.github/AUTHORS`.

## What it is

The contributors committee of a project, written down: whoever appears in
its commits (as author, committer or `Co-authored-by`) is an author.
`bos project authors` collects them from `git log` and appends the ones the
file does not name yet; nobody is ever removed.

## An entry

One line, its fields separated by tabs (any whitespace is read):

```text
NICKNAME	"NAMED IDENTITY"	<EMAIL>	(URL)	[SIGN::type::public sign]
```

| Entry | Holds | Is |
| ----- | ----- | -- |
| full | nickname, "named identity", `<email>`, `(url)` | a verified identity, presented |
| verified | nickname, `<email>` | the least that is a verified identity |
| mentioned | a nickname only, or an `<email>` only | unverified: just mentioned |

`[SIGN::type::...]`: a public signature of the entity, one or more; the sign
mechanics are later *(owner, phase 2)*. A line starting with `#` is a comment.

## How the file grows

- An entity of the commits that no entry names is appended, as a verified
  entry: its git name as the nickname (spaces → `-`), its email. The oldest
  first.
- A mentioned entry that the commits complete (a nickname gains its email,
  an email its nickname) is updated and moved to the bottom.
- An entity is named by an entry when the email is the same, or the git name
  is the entry's nickname or named identity, or begins the named identity
  (`Sett Sarverott` → `"Sett Sarverott A.A.B."`) *(assumed: so one person
  committing with several emails stays one entry)*.
- Everything else of the file stays as it is: its order, its spacing, its
  comments. Better entries are written by hand.

## In the loop

The `revision` step collects the authors before it bumps the version
(`loop-revision-bump-checks-pull-request.yml`); the craft loop gives this
job to `releasing` once the full loop runs.

Related: [[craft-loop]], [[project]].
