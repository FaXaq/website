#!/usr/bin/env bash

set -euo pipefail

function Help() {
   # Display Help
   echo "Commands"
   echo "  env:setup                                  Setup env"
   echo "  vault:edit                                 Edit vault file"
   echo "  vault:password:show                        Show vault password"
   echo "  vault:password:generate                    Generate vault password file from habilitations"
   echo "  version:current                            Get current version of app"
   echo "  version:generate                           Generate next version"
   echo "  version:generate:rc                        Generate next rc version"
   echo "  images:build                               Build images"
   echo "  release:app                                Build app and upload it to ghcr.io"
   echo "  infra:setup                                Setup a server with basic shared conf"
   echo "  infra:images:build:reverse_proxy           Build reverse proxy image"
   echo "  app:deploy                                 Deploy app"
}

function env:setup() {
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    export ENV_NAME=${1:?"Merci de préciser un environnement (ex. recette ou production)"}; shift;
    "${SCRIPT_DIR}/env-setup.sh" "$@"
}

function env:setup:local() {
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    export ENV_NAME="local"
    "${SCRIPT_DIR}/env-setup.sh" "$@"
}

function env:setup:production() {
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    export ENV_NAME="production"
    echo $ENV_NAME
    "${SCRIPT_DIR}/env-setup.sh" "$@"
}

function vault:edit() {
    editor=${EDITOR:-'cursor -w'}
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    EDITOR=$editor "${SCRIPT_DIR}/vault-edit.sh" "$@"
}

function vault:password:generate() {
  "${SCRIPT_DIR}/vault-password-generate.sh" "$@"
}

function vault:password:show() {
  "${SCRIPT_DIR}/vault-password-show.sh" "$@"
}

function version:current() {
  "${SCRIPT_DIR}/version-current.sh"
}

function version:generate() {
  "${SCRIPT_DIR}/version-generate.sh" "$@"
}

function version:generate:rc() {
  "${SCRIPT_DIR}/version-generate-rc.sh" "$@"
}

function app:deploy() {
  "${SCRIPT_DIR}/app-deploy.sh" "$@"
}

function infra:setup:initial() {
  local PRODUCT_NAME=${1:?"Merci le produit (website)"}; shift;
  local ENV_NAME=${1:?"Merci de préciser un environnement (ex. recette ou production)"}; shift;

  read -p "Do you want to setup the server with a RSA key? [Y/n]" response

  case $response in
    [yY][eE][sS]|[yY]|"")
      "$SCRIPT_DIR/get-technical-user-keyfile.sh"
      export ANSIBLE_PRIVATE_KEY_FILE="$ROOT_DIR/.bin/id_rsa_deploy.key"
      export ANSIBLE_BECOME_PASS="-"
      infra:setup "$PRODUCT_NAME" "$ENV_NAME" "$@" --user ubuntu
      rm -f "${ANSIBLE_PRIVATE_KEY_FILE}"
      ;;
    *)
      infra:setup "$PRODUCT_NAME" "$ENV_NAME" "$@" --user ubuntu --ask-pass
      return
      ;;
  esac

  "$SCRIPT_DIR/run-infra-playbook.sh" "setup.yml" "$PRODUCT_NAME" "$ENV_NAME" "$@"
}

function infra:setup() {
  local PRODUCT_NAME=${1:?"Merci le produit (website)"}; shift;
  local ENV_NAME=${1:?"Merci de préciser un environnement (ex. recette ou production)"}; shift;

  "$SCRIPT_DIR/run-infra-playbook.sh" "setup.yml" "$PRODUCT_NAME" "$ENV_NAME" "$@"
}

function infra:images:build:reverse_proxy() {
  "$SCRIPT_DIR/image-build-infra.sh" reverse_proxy "$@"
}

function images:build() {
  "${SCRIPT_DIR}/images-build.sh" "$@"
}

function release:app() {
  "${SCRIPT_DIR}/release-app.sh" "$@"
}

function release:manual() {
  "${SCRIPT_DIR}/release-manual.sh" "$@"
}

function release:candidate() {
  "${SCRIPT_DIR}/release-candidate.sh" "$@"
}

function deploy:log:decrypt() {
  "${SCRIPT_DIR}/log-decrypt.sh" "$@"
}

function deploy:log:encrypt() {
  "${SCRIPT_DIR}/log-encrypt.sh" "$@"
}