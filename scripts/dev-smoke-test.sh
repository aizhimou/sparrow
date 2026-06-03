#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
API_URL="$API_BASE_URL/api"

"$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scripts/dev-backend-health.sh"

LOGIN_FILE="/tmp/sparrow-login.json"
PROJECTS_FILE="/tmp/sparrow-projects.json"

curl -sS "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}' \
  > "$LOGIN_FILE"

TOKEN="$(node -e "const fs=require('fs'); const body=JSON.parse(fs.readFileSync('$LOGIN_FILE','utf8')); if(body.code!==200) process.exit(1); process.stdout.write(body.data.token);")"

curl -sS "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  > "$PROJECTS_FILE"

node -e "const fs=require('fs'); const body=JSON.parse(fs.readFileSync('$PROJECTS_FILE','utf8')); if(body.code!==200 || !Array.isArray(body.data) || body.data.length < 1) process.exit(1); if(typeof body.data[0].id !== 'string') process.exit(1);"

echo "Smoke test: ok"
