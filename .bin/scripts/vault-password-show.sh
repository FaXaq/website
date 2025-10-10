#!/usr/bin/env bash
set -euo pipefail

# echo "Command line interface to view the vault password"
# echo "This file implements Ansible specifications third-party vault tools"
# echo "For more informations see https://docs.ansible.com/ansible/latest/vault_guide/vault_managing_passwords.html#storing-passwords-in-third-party-tools-with-vault-password-client-scripts"

## CHECK UPDATES AND RENEW

if [ ! -f "$VAULT_PASSWORD_FILE" ]; then
    echo "Veuillez télécharger le fichier de mot de passe du coffre fort et le placer dans chemin d'accès suivant : ${VAULT_PASSWORD_FILE}"
    exit 0
fi

decrypt_password() {
  ## Decrypt
  if test -f "${VAULT_PASSWORD_FILE}"; then
    gpg --quiet --batch --use-agent --decrypt "${VAULT_PASSWORD_FILE}"
  else
    #Allows to run playbooks with --vault-password-file even if password has not been yet generated
    echo "not-yet-generated"
  fi

  gpgconf --kill gpg-agent
}

decrypt_password
