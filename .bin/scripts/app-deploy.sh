#!/usr/bin/env bash
set -euo pipefail

readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

function deploy() {
  echo "Déploiement sur l'environnement ${ENV_FILTER}..."
  echo "${ROOT_DIR}/.bin/scripts/run-app-playbook.sh" "deploy.yml" "$ENV_FILTER" "$@"
  "${ROOT_DIR}/.bin/scripts/run-app-playbook.sh" "deploy.yml" "$ENV_FILTER" "$@"
}

deploy "$@"
