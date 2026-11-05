# bridges

One file per outside system BOS talks to (docs/architecture/bridges.md). A
bridge is the only place that system is touched: it runs the system's own
command line through `Host.run`, so the core still has one door to the
machine (`src/hosts/`) and tests replace the host's `run`.
