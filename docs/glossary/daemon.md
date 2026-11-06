# Daemon

> A long-running program of the workshop (`ollama serve`…), kept alive by
> BOS's supervisor: started, watched, restarted and stopped as code.

## What it is

A **service** says how to run it, in JSON: `resources/daemons/<name>.json`
in the package (every workshop has `ollama`), or the workshop's own
`.BOS/setup/daemons/<name>.json`, which wins.

```json
{
  "command": "ollama", "args": ["serve"],
  "context": "separate", "inherit": ["OLLAMA_MODELS", "CUDA_VISIBLE_DEVICES"],
  "env": { "OLLAMA_HOST": "127.0.0.1:11434" },
  "instances": 1, "restart": "on-failure", "maxRestarts": 5,
  "alerts": ["level=ERROR", "CUDA error"], "threads": 2,
  "ready": "http://127.0.0.1:11434/", "grace": 15000
}
```

- **instances**: how many run side by side (a cluster); each gets
  `BOS_DAEMON` and `BOS_INSTANCE=<n>`.
- **context**: `shared`, an instance sees the supervisor's whole environment
  and stays in its process group; `separate`, it sees only `PATH`, `HOME`,
  `USER`, `LANG` and the names in `inherit`, in a process group of its own,
  so no signal meant for the supervisor reaches it (and a stop reaches
  everything it started).
- **restart**: `on-failure` (default), `always` or `never`; restarts back
  off from 0.5 s to 30 s, and after `maxRestarts` in a row the instance is
  given up.
- **alerts**: regular expressions; the lines that match are copied to the
  alerts log by the **monitor threads** (`threads`, a pool of worker
  threads), so a flood of lines never holds up the supervisor.
- **ready**: a URL asked until it answers (then every 30 s).

## The supervisor

`src/hosts/daemon/supervisor.ts`: a detached Node process per daemon. It
writes every line of every instance into the daemon's log, keeps its state
current, and answers signals:

| Signal | It does |
| ------ | ------- |
| `TERM`, `INT` | stops every instance (TERM, KILL after `grace`), then itself |
| `HUP` | restarts every instance |
| `USR1` | rotates the log: `<name>.log` → `<name>.log.1` |
| `USR2` | writes the state now |

## Where

- `.BOS/data/daemons/<name>.service.json`: the service as it was started;
  `<name>.state.json`: supervisor, instances, restarts, readiness, counts.
- `.BOS/storylines/daemons/<name>.log`, `<name>.alerts.log`.

## In use

```sh
bos daemon list | start | run | stop | reload | rotate | status <name>
bos daemon logs <name> [--lines=40] [--alerts] [--follow]
scripts/devtools/ollama-serve.sh start | run | stop | restart | status | logs -f | alerts
```

Serving a model server calls no model. Which models may be called is the
House's (in a BOS scope: `.delegations/house/`): only `active` residents.

## In code

`src/core/daemon.ts` (the service, environments, restart policy, files),
`src/hosts/daemon/` (the supervisor and its monitor threads; `Host.supervise`,
`Host.signal`), `src/models/daemon/class.ts` (`Daemons`), the procedure
`daemonizing`, `bos daemon <tool>`.

## Open

- [`TODO`] ollama in a docker container with the GPU (Q17): needs the NVIDIA
  Container Toolkit on the machine.
- [`TODO`] Daemons started with the workshop (`bos open`), stopped with it.
