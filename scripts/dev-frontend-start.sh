#!/usr/bin/env bash

set -euo pipefail

HOST="0.0.0.0"
PORT="5173"
API_BASE_URL="http://localhost:8080/api"
RESTART=false
FOREGROUND=false

usage() {
  cat <<'USAGE'
Usage: scripts/dev-frontend-start.sh [--host HOST] [--port PORT] [--api-base-url URL] [--restart] [--foreground]

Starts the local Vite frontend with the real backend API enabled.
Logs are written to var/dev/logs/frontend.log.
PID is written to var/dev/pids/frontend.pid.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      HOST="${2:-}"
      shift 2
      ;;
    --port)
      PORT="${2:-}"
      shift 2
      ;;
    --api-base-url)
      API_BASE_URL="${2:-}"
      shift 2
      ;;
    --restart)
      RESTART=true
      shift
      ;;
    --foreground)
      FOREGROUND=true
      shift
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
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/var/dev/logs"
PID_DIR="$ROOT_DIR/var/dev/pids"
LOG_FILE="$LOG_DIR/frontend.log"
PID_FILE="$PID_DIR/frontend.pid"
PORT_FILE="$PID_DIR/frontend.port"

mkdir -p "$LOG_DIR" "$PID_DIR"

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE")"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    if [[ "$RESTART" == "true" ]]; then
      "$ROOT_DIR/scripts/dev-frontend-stop.sh"
    else
      echo "frontend is already running with PID $OLD_PID. Use --restart to restart it." >&2
      exit 1
    fi
  fi
fi

if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  if [[ "$RESTART" == "true" ]]; then
    "$ROOT_DIR/scripts/dev-frontend-stop.sh" --port "$PORT"
  else
    echo "Port $PORT is already in use. Use --restart or choose another port." >&2
    exit 1
  fi
fi

: > "$LOG_FILE"
echo "$PORT" > "$PORT_FILE"

ensure_dependencies() {
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    npm ci
  fi
}

if [[ "$FOREGROUND" == "true" ]]; then
  echo $$ > "$PID_FILE"
  echo "Starting frontend in foreground with PID $$"
  echo "URL: http://localhost:$PORT"
  echo "API: $API_BASE_URL"
  echo "Log: $LOG_FILE"
  exec > >(tee -a "$LOG_FILE") 2>&1
  cd "$FRONTEND_DIR"
  ensure_dependencies
  VITE_USE_MOCK_API=false VITE_API_BASE_URL="$API_BASE_URL" \
    exec npm run dev -- --host "$HOST" --port "$PORT"
fi

(
  cd "$FRONTEND_DIR"
  ensure_dependencies >> "$LOG_FILE" 2>&1
  python3 - "$FRONTEND_DIR" "$LOG_FILE" "$PID_FILE" "$API_BASE_URL" \
    "$HOST" "$PORT" <<'PY'
import os
import subprocess
import sys

frontend_dir, log_file, pid_file, api_base_url, host, port = sys.argv[1:]
env = os.environ.copy()
env["VITE_USE_MOCK_API"] = "false"
env["VITE_API_BASE_URL"] = api_base_url

with open(log_file, "ab", buffering=0) as log:
    process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--host", host, "--port", port],
        cwd=frontend_dir,
        stdin=subprocess.DEVNULL,
        stdout=log,
        stderr=subprocess.STDOUT,
        env=env,
        start_new_session=True,
    )

with open(pid_file, "w", encoding="utf-8") as pid:
    pid.write(str(process.pid))
PY
)

PID="$(cat "$PID_FILE")"
echo "Started frontend with PID $PID"
echo "URL: http://localhost:$PORT"
echo "API: $API_BASE_URL"
echo "Log: $LOG_FILE"
