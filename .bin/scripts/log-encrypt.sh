#!/usr/bin/env bash

set -euo pipefail

readonly PASSPHRASE="${INFRA_DIR}/public_key.asc"

touch /tmp/deploy.log
gpg  -c --cipher-algo twofish --batch --passphrase-file "$PASSPHRASE" -o /tmp/deploy.log.gpg /tmp/deploy.log
