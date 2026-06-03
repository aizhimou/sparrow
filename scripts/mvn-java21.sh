#!/usr/bin/env bash

set -euo pipefail

if ! JAVA_HOME_21=$(/usr/libexec/java_home -v 21 2>/dev/null); then
  echo "JDK 21 not found. Install JDK 21 and retry." >&2
  exit 1
fi

export JAVA_HOME="$JAVA_HOME_21"
export PATH="$JAVA_HOME/bin:$PATH"

exec mvn "$@"
