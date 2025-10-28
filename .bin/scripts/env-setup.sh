#!/usr/bin/env bash
set -euo pipefail

echo "Updating local ui/.env"
ANSIBLE_CONFIG="${ANSIBLE_DIR}/ansible.cfg" ansible all \
  --limit "local" \
  -m template \
  -a "src=\"${TEMPLATES_DIR}/.env_ui\" dest=\"${ROOT_DIR}/ui/.env\"" \
  --extra-vars "@${VAULT_FILE}" \
  --vault-password-file=<($VAULT_PASSWORD_SCRIPT)

corepack yarn setup