#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$ROOT_DIR/scripts/dev-backend-start.sh" --restart

for _ in {1..60}; do
  if "$ROOT_DIR/scripts/dev-backend-health.sh" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

"$ROOT_DIR/scripts/dev-backend-health.sh"
"$ROOT_DIR/scripts/dev-frontend-start.sh" --restart

echo "Stack started"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
