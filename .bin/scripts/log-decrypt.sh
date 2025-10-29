#!/usr/bin/env bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  read -p "Veuillez renseigner l'ID du run: " RUN_ID
else
    readonly RUN_ID="$1"
    shift
fi

if [ -z "${1:-}" ]; then
  read -p "Veuillez renseigner l'ID du job: " JOB_ID
else
    readonly JOB_ID="$1"
    shift
fi

rm -f /tmp/deploy.log.gpg

gh run download "$RUN_ID" -n "logs-$JOB_ID" -D /tmp

gpg -d --batch /tmp/deploy.log.gpg
