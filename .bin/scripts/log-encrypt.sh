#!/usr/bin/env bash

set -euo pipefail

readonly PUBLIC_KEY="${INFRA_DIR}/public_key.asc"

touch /tmp/deploy.log
gpg  -e --batch --yes --recipient-file "$PUBLIC_KEY" -o /tmp/deploy.log.gpg /tmp/deploy.log
