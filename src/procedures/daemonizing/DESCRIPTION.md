# daemonizing

Starts, stops, restarts and asks after a daemon (glossary:
[daemon](../../../docs/glossary/daemon.md)): a long-running program such as
`ollama serve`, kept alive by BOS's supervisor (`src/hosts/daemon/`), a
detached Node process with a pool of monitor threads for its logs.

Steps: `read` (the service: the workshop's `.BOS/setup/daemons/<name>.json`,
else the package's `resources/daemons/<name>.json`; its state; whether its
supervisor lives) → `act` (start: the service's spec is written beside its
state and the supervisor started, unless one lives already; stop: SIGTERM;
reload: SIGHUP; rotate: SIGUSR1; status: nothing) → `settle` (waits a little
for the state to show what was asked: instances started, or stopped).

A dry run says what it would do. The supervisor's signals and files are in
`src/core/daemon.ts`.
