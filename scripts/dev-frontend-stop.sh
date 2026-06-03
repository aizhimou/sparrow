#!/usr/bin/env bash

set -euo pipefail

PORT=""

usage() {
  cat <<'USAGE'
Usage: scripts/dev-frontend-stop.sh [--port PORT]

Stops the local Vite frontend started by scripts/dev-frontend-start.sh.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      PORT="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$ROOT_DIR/var/dev/pids"
PID_FILE="$PID_DIR/frontend.pid"
PORT_FILE="$PID_DIR/frontend.port"

if [[ -z "$PORT" && -f "$PORT_FILE" ]]; then
  PORT="$(cat "$PORT_FILE")"
fi
PORT="${PORT:-5173}"

collect_descendants() {
  local pid="$1"
  local child

  pgrep -P "$pid" 2>/dev/null | while read -r child; do
    collect_descendants "$child"
    echo "$child"
  done
}

pids=()
if [[ -f "$PID_FILE" ]]; then
  pid="$(cat "$PID_FILE")"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    while read -r child_pid; do
      [[ -n "$child_pid" ]] && pids+=("$child_pid")
    done < <(collect_descendants "$pid")
    pids+=("$pid")
  else
    echo "frontend has stale PID ${pid:-<empty>}"
  fi
fi

while read -r port_pid; do
  [[ -n "$port_pid" ]] && pids+=("$port_pid")
done < <(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)

if [[ "${#pids[@]}" -eq 0 ]]; then
  echo "frontend is not running"
  rm -f "$PID_FILE" "$PORT_FILE"
  exit 0
fi

unique_pids="$(printf "%s\n" "${pids[@]}" | awk 'NF && !seen[$0]++')"

while read -r target_pid; do
  [[ -n "$target_pid" ]] && kill "$target_pid" 2>/dev/null || true
done <<< "$unique_pids"

for _ in {1..30}; do
  still_running=false
  while read -r target_pid; do
    if [[ -n "$target_pid" ]] && kill -0 "$target_pid" 2>/dev/null; then
      still_running=true
    fi
  done <<< "$unique_pids"

  if [[ "$still_running" == "false" ]]; then
    rm -f "$PID_FILE" "$PORT_FILE"
    echo "Stopped frontend"
    exit 0
  fi
  sleep 1
done

echo "Failed to stop frontend within 30 seconds: PIDs $(echo "$unique_pids" | tr '\n' ' ')" >&2
exit 1
