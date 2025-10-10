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

function version:current() {
  "${SCRIPT_DIR}/version-current.sh"
}

function version:generate() {
  "${SCRIPT_DIR}/version-generate.sh" "$@"
}

function version:generate:rc() {
  "${SCRIPT_DIR}/version-generate-rc.sh" "$@"
}

function images:build() {
  "${SCRIPT_DIR}/images-build.sh" "$@"
}