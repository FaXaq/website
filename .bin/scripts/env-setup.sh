#!/usr/bin/env bash
set -euo pipefail


case $ENV_NAME in
  production|local)
    ;;
  *)
    echo "Invalid argument: $ENV_NAME"
    echo "Usage: Provide 'production' or 'local' as the first argument."
    exit 1
    ;;
esac

echo "Updating local web/.env"

ANSIBLE_CONFIG="${ANSIBLE_DIR}/ansible.cfg" ansible all \
  --limit "${ENV_NAME}" \
  -c local \
  -m template \
  -a "src=\"${INFRA_DIR}/.env_web\" dest=\"${WEB_DIR}/.env\"" \
  --extra-vars "@${VAULT_FILE}" \
  --vault-password-file=<($VAULT_PASSWORD_SCRIPT)

echo "Updating local web/.env"

ANSIBLE_CONFIG="${ANSIBLE_DIR}/ansible.cfg" ansible all \
  --limit "${ENV_NAME}" \
  -c local \
  -m template \
  -a "src=\"${INFRA_DIR}/.env_server\" dest=\"${SERVER_DIR}/.env\"" \
  --extra-vars "@${VAULT_FILE}" \
  --vault-password-file=<($VAULT_PASSWORD_SCRIPT)