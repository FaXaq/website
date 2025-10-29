#!/usr/bin/env bash
set -euo pipefail

echo "Updating local ui/.env"

case $ENV_NAME in
  production|local)
    ;;
  *)
    echo "Invalid argument: $ENV_NAME"
    echo "Usage: Provide 'production' or 'local' as the first argument."
    exit 1
    ;;
esac

ANSIBLE_CONFIG="${ANSIBLE_DIR}/ansible.cfg" ansible all \
  --limit "${ENV_NAME}" \
  -c local \
  -m template \
  -a "src=\"${INFRA_DIR}/.env_ui\" dest=\"${ROOT_DIR}/ui/.env\"" \
  --extra-vars "@${VAULT_FILE}" \
  --vault-password-file=<($VAULT_PASSWORD_SCRIPT)