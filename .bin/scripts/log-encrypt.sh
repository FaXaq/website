#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${ANSIBLE_VAULT_PASSWORD_FILE:-}" ]]; then
  ansible_extra_opts+=("--vault-password-file" "${SCRIPT_DIR}/view-vault-password.sh")
else
  echo "Récupération de la passphrase depuis l'environnement variable ANSIBLE_VAULT_PASSWORD_FILE" 
fi

readonly PASSPHRASE="${INFRA_DIR}/public_key.asc"

touch /tmp/deploy.log
gpg  -c --cipher-algo twofish --batch --passphrase-file "$PASSPHRASE" -o /tmp/deploy.log.gpg /tmp/deploy.log
