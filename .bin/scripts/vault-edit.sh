#!/usr/bin/env bash
set -euo pipefail

ansible-vault edit --vault-password-file=<($VAULT_PASSWORD_SCRIPT) "${VAULT_FILE}"
