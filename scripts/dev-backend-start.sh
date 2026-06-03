#!/usr/bin/env bash

set -euo pipefail

PORT="8080"
RESTART=false
FOREGROUND=false

usage() {
  cat <<'USAGE'
Usage: scripts/dev-backend-start.sh [--port PORT] [--restart] [--foreground]

Starts the local Spring Boot backend.
Logs are written to var/dev/logs/backend.log.
PID is written to var/dev/pids/backend.pid.
USAGE
}

load_env_file() {
  local env_file="$1"
  local line key value

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue
    key="${line%%=*}"
    value="${line#*=}"
    key="$(printf '%s' "$key" | xargs)"
    [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
    if [[ "$value" == \"*\" && "$value" == *\" ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
      value="${value:1:${#value}-2}"
    fi
    export "$key=$value"
  done < "$env_file"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      PORT="${2:-}"
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

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  echo "--port must be a positive integer" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.backend.local"
LOG_DIR="$ROOT_DIR/var/dev/logs"
PID_DIR="$ROOT_DIR/var/dev/pids"
LOG_FILE="$LOG_DIR/backend.log"
PID_FILE="$PID_DIR/backend.pid"
PORT_FILE="$PID_DIR/backend.port"

mkdir -p "$LOG_DIR" "$PID_DIR" "$ROOT_DIR/var/dev/h2" "$ROOT_DIR/var/logs/backend"

if [[ -f "$ENV_FILE" ]]; then
  load_env_file "$ENV_FILE"
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE")"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    if [[ "$RESTART" == "true" ]]; then
      "$ROOT_DIR/scripts/dev-backend-stop.sh"
    else
      echo "backend is already running with PID $OLD_PID. Use --restart to restart it." >&2
      exit 1
    fi
  fi
fi

if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  if [[ "$RESTART" == "true" ]]; then
    "$ROOT_DIR/scripts/dev-backend-stop.sh" --port "$PORT"
  else
    echo "Port $PORT is already in use. Use --restart or choose another port." >&2
    exit 1
  fi
fi

: > "$LOG_FILE"
echo "$PORT" > "$PORT_FILE"
export SPARROW_BACKEND_PORT="$PORT"

if [[ "$FOREGROUND" == "true" ]]; then
  echo $$ > "$PID_FILE"
  echo "Starting backend in foreground with PID $$"
  echo "URL: http://localhost:$PORT"
  echo "Log: $LOG_FILE"
  exec > >(tee -a "$LOG_FILE") 2>&1
  cd "$ROOT_DIR"
  ./scripts/mvn-java21.sh -f backend/pom.xml -DskipTests package
  JAVA_HOME_21=$(/usr/libexec/java_home -v 21)
  exec "$JAVA_HOME_21/bin/java" -jar backend/target/sparrow-backend-0.1.0.jar
fi

(
  cd "$ROOT_DIR"
  ./scripts/mvn-java21.sh -f backend/pom.xml -DskipTests package >> "$LOG_FILE" 2>&1
  JAVA_HOME_21=$(/usr/libexec/java_home -v 21)
  python3 - "$ROOT_DIR" "$LOG_FILE" "$PID_FILE" \
    "$JAVA_HOME_21/bin/java" "$ROOT_DIR/backend/target/sparrow-backend-0.1.0.jar" <<'PY'
import os
import subprocess
import sys

root_dir, log_file, pid_file, java_bin, jar_file = sys.argv[1:]

with open(log_file, "ab", buffering=0) as log:
    process = subprocess.Popen(
        [java_bin, "-jar", jar_file],
        cwd=root_dir,
        stdin=subprocess.DEVNULL,
        stdout=log,
        stderr=subprocess.STDOUT,
        env=os.environ.copy(),
        start_new_session=True,
    )

with open(pid_file, "w", encoding="utf-8") as pid:
    pid.write(str(process.pid))
PY
)

PID="$(cat "$PID_FILE")"
echo "Started backend with PID $PID"
echo "URL: http://localhost:$PORT"
echo "Log: $LOG_FILE"
