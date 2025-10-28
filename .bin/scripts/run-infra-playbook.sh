#!/usr/bin/env bash

set -euo pipefail

readonly PLAYBOOK_NAME=${1:?"Merci de préciser le playbook a éxécuter"}
shift
readonly PRODUCT_NAME=${1:?"Merci de préciser le nom du product"}
shift
readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

INFRA_DIR="${ROOT_DIR}/infra"

function runPlaybook() {
  echo "Lancement du playbook ${PLAYBOOK_NAME} pour ${PRODUCT_NAME}-${ENV_FILTER}..."
  
  local ansible_extra_opts=()

  export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
  ansible-galaxy install --force "patrickjahns.promtail,1.31.0"
  ansible-galaxy install --force "geerlingguy.docker,7.0.2"
  ansible-galaxy collection install -U community.general
  ansible-galaxy collection install -U community.crypto
  ansible-galaxy collection install -U ansible.posix

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
    -i "${INFRA_DIR}/env.ini" \
    --limit "${ENV_FILTER}" \
    "${ansible_extra_opts[@]}" \
    "${INFRA_DIR}/ansible/${PLAYBOOK_NAME}" \
    "$@"
}

if [[ ! -s "${INFRA_DIR}/habilitations.yml" ]]; then
  echo "Attention, le fichier ${INFRA_DIR}/habilitations.yml n'existe pas ou est vide. Vous risquez de rencontrer une erreur lors de l'exécution du playbook."
fi;

# Do not show error log in CI
# Do not remove this behavior as displaying errors can reveal secrets
if [[ -z "${CI:-}" ]]; then
  runPlaybook "$@"
else
  runPlaybook "$@" &> /tmp/deploy.log
fi;
