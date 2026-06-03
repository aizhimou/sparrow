#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"

usage() {
  cat <<'USAGE'
Usage: scripts/dev-backend-health.sh

Checks the backend Actuator health endpoint.
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

HEALTH_FILE="/tmp/sparrow-backend-health.json"

echo "Backend health: $API_BASE_URL/actuator/health"
rm -f "$HEALTH_FILE"
HTTP_STATUS="$(curl -sS -o "$HEALTH_FILE" -w "%{http_code}" "$API_BASE_URL/actuator/health" || true)"
if [[ -s "$HEALTH_FILE" ]]; then
  cat "$HEALTH_FILE"
else
  echo "<no response body>"
fi
echo

if [[ "$HTTP_STATUS" != "200" ]]; then
  echo "Backend health check failed with HTTP $HTTP_STATUS" >&2
  exit 1
fi

echo "Backend health: ok"
