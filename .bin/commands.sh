#!/usr/bin/env bash

set -euo pipefail

function Help() {
   # Display Help
   echo "Commands"
   echo "  env:setup                                  Setup env"
   echo "  vault:edit                                 Edit vault file"
   echo "  vault:password:show                        Show vault password"
   echo "  vault:password:generate                    Generate vault password file from habilitations"
}

function env:setup() {
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    "${SCRIPT_DIR}/env-setup.sh" "$@"
}

function vault:edit() {
    editor=${EDITOR:-'code -w'}
    export VAULT_PASSWORD_SCRIPT="${SCRIPT_DIR}/vault-password-show.sh"
    EDITOR=$editor "${SCRIPT_DIR}/vault-edit.sh" "$@"
}

function vault:password:generate() {
  "${SCRIPT_DIR}/vault-password-generate.sh" "$@"
}

function vault:password:show() {
  "${SCRIPT_DIR}/vault-password-show.sh" "$@"
}