# Mirror

> A copy of a project's repository on another host, kept identical to the
> source by the loop: every branch, every tag, deletions too.

## What it is

The **source** is where the project is worked on and released (for the core:
GitHub). A **mirror** only receives: nobody pushes to it by hand, its history
is the source's. Mirrors spread the project over hosts that do not depend on
one another, so it stays reachable (and forkable) when one host is down,
closed or gone.

A project lists them in `.github/bos.json`:

```json
"mirrors": {
  "source": { "host": "github.com", "web": "https://github.com/<owner>/<repo>" },
  "to": [
    { "name": "gitlab", "host": "gitlab.com", "web": "…", "git": "https://gitlab.com/<owner>/<repo>.git",
      "user": "oauth2", "secret": "MIRROR_GITLAB_TOKEN" }
  ]
}
```

`git` is where it is pushed (https with `user` and the token in the
environment variable `secret`, or `git@…` with the SSH key in it), `web` the
page whose HTTP status its badge shows.

## Its status

One badge per place, the HTTP status of its page: `200 OK` when it is there,
`404 NOT_FOUND` when it is missing; `403 FORBIDDEN` when its last update
failed. Each mirror also runs the checks on its own CI.

## In the loop

`mirrors-propagate-and-status-badges.yml` syncs it on every push to
`development` of the source (docs/architecture/workflows.md, "Mirrors"). [`TODO`] the mirrors of a
scope's private repositories on the self-hosted server (`__WORKSHOP/AGENTS.md`:
remotes policy) and the `archive/` mirrors in the workshop are the same idea
on other ground; how they meet is open.

Related: [[craft-loop]], [[project]], [[archive]].
