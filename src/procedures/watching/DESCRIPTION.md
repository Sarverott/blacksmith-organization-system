# watching

Listens to the workshop: every change of a file below the workshop root
becomes a workshop event that says where it happened (area, and in the forge
the scope and project) and when (UNIXUSAT).

1. `start`: watch the root through the host; each change is classified
   (`classify.ts`) and handed to `context.onEvent`. Noise is dropped: `.git/`,
   `node_modules/`, BOS's own `.BOS/storylines/` (so recording never feeds
   itself), and repeats of one path within `quietMs`.
2. `wait`: keep listening until `context.signal` aborts (Ctrl+C in the CLI),
   then stop the watcher. If the host's watcher fails (e.g. Linux has no
   inotify watches left because an editor holds them all), the wait ends and
   the procedure fails with that error: a watch never goes deaf silently.

With `record`, every event is also appended to
`.BOS/storylines/logs/workshop.jsonl`. This is the base the later workmodes
stand on: tasks that react to changes in the forge (autocommit, checks).
