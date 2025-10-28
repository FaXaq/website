#!/usr/bin/env bash

set -euo pipefail

readonly PLAYBOOK_NAME=${1:?"Merci de le nom du playbook"}
shift
readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

function runPlaybook() {
  echo "Lancement du playbook ${PLAYBOOK_NAME} pour l'environnement ${ENV_FILTER}..."

  if [[ -z "${ANSIBLE_BECOME_PASS:-}" ]]; then
    if [[ $* != *"pass"* ]]; then
      ansible_extra_opts+=("--ask-become-pass")
    fi
  fi

  if [[ -z "${ANSIBLE_REMOTE_USER:-}" ]]; then
    if [[ $* != *"--user"* ]]; then
      echo "Vous n'avez pas précisé d'utilisateur, ajoutez l'option --user <username> ou de définissez la variable d'environnement ANSIBLE_REMOTE_USER."
    fi
  fi

  # This env-vars is used by CI to decrypt
  if [[ -z "${ANSIBLE_VAULT_PASSWORD_FILE:-}" ]]; then
    ansible_extra_opts+=("--vault-password-file" "${SCRIPT_DIR}/vault-password-show.sh")
  else
    echo "Récupération de la passphrase depuis l'environnement variable ANSIBLE_VAULT_PASSWORD_FILE" 
  fi

  ANSIBLE_CONFIG="${INFRA_DIR}/ansible/ansible.cfg" ansible-playbook \
      --limit "${ENV_FILTER}" \
      "${ansible_extra_opts[@]}" \
      "${INFRA_DIR}/ansible/${PLAYBOOK_NAME}" \
      "$@"
}

# Do not show error log in CI
# Do not remove this behavior as displaying errors can reveal secrets
if [[ -z "${CI:-}" ]]; then
  runPlaybook "$@"
else
  runPlaybook "$@" &> /tmp/deploy.log
fi;
