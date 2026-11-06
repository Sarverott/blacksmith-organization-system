#!/usr/bin/env bash
# ollama serve under BOS's supervisor (src/hosts/daemon/; glossary: daemon), on the active
# workshop: its log in .BOS/storylines/daemons/ollama.log, its state in .BOS/data/daemons/.
# The service is resources/daemons/ollama.json, or the workshop's own
# .BOS/setup/daemons/ollama.json (it wins): OLLAMA_HOST, what it inherits (OLLAMA_MODELS,
# CUDA_VISIBLE_DEVICES…), the alerts its monitor threads flag.
#
# Serving calls no model. Which models may be called is the House's (in a BOS scope:
# .delegations/house/): only `active` residents.
#
# Usage: ollama-serve.sh [start|run|stop|restart|reload|rotate|status|logs [-f]|alerts] [--workshop=<path>]
#   start    detached; nothing when it runs already
#   run      in this terminal, every log line shown; Ctrl+C stops it
#   restart  stop, then start
#   reload   every instance restarted by the supervisor (SIGHUP)
#   logs -f  the log, followed; alerts: the flagged lines
set -euo pipefail
here="$(cd "$(dirname "$0")/../.." && pwd)"
bos() { node "$here/src/cli.ts" "$@"; }

action="${1:-status}"
shift || true
extra=()
follow=()
for arg in "$@"; do
  case "$arg" in
    -f | --follow) follow=(--follow) ;;
    *) extra+=("$arg") ;;
  esac
done

if ! command -v ollama > /dev/null; then
  echo "ollama is not installed (https://ollama.com/download)" >&2
  exit 127
fi

url="http://${OLLAMA_HOST:-127.0.0.1:11434}/"
served_elsewhere() {
  # it answers, but BOS's supervisor does not run it: another ollama (systemd, a desktop app)
  curl -fsS -m 2 "$url" > /dev/null 2>&1 &&
    ! bos daemon status ollama "${extra[@]}" | grep -q "running"
}

case "$action" in
  start | run)
    if served_elsewhere; then
      echo "ollama answers on $url already, not under BOS: stop that one first (systemctl stop ollama?)" >&2
      exit 1
    fi
    bos daemon "$action" ollama "${extra[@]}"
    ;;
  restart)
    bos daemon stop ollama "${extra[@]}"
    bos daemon start ollama "${extra[@]}"
    ;;
  stop | reload | rotate | status) bos daemon "$action" ollama "${extra[@]}" ;;
  logs) bos daemon logs ollama "${follow[@]}" "${extra[@]}" ;;
  alerts) bos daemon logs ollama --alerts "${follow[@]}" "${extra[@]}" ;;
  *)
    sed -n '/^# Usage/,/^set -e/p' "$0" | sed '$d; s/^# \{0,1\}//'
    exit 2
    ;;
esac
