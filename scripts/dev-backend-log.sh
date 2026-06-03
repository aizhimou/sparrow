#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$ROOT_DIR/var/dev/logs/backend.log"

if [[ ! -f "$LOG_FILE" ]]; then
  echo "Backend log does not exist yet: $LOG_FILE" >&2
  exit 1
fi

tail -f "$LOG_FILE"
