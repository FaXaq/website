#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly PROJECT_DIR="/opt/app"

function reload_containers() {
    echo "Rechargement des conteneurs ..."
    cd /opt/app
    /opt/app/tools/docker-compose.sh up -d --force-recreate --remove-orphans
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
reload_containers "$@"
