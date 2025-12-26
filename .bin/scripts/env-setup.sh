#!/usr/bin/env bash
set -euo pipefail


case $ENV_NAME in
  production|local)
    ;;
  *)
    echo "Invalid argument: $ENV_NAME"
    echo "Usage: Provide 'production' or 'development' as the first argument."
    exit 1
    ;;
esac

echo "Updating local web/.env"

# Sanitize ENV_NAME to be 'local' or 'production'
if [[ "$ENV_NAME" == "development" ]]; then
  ENV_NAME="local"
elif [[ "$ENV_NAME" != "local" && "$ENV_NAME" != "production" ]]; then
  echo "Invalid argument: $ENV_NAME"
  echo "Usage: Provide 'production' or 'development' as the first argument."
  exit 1
fi


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