#!/usr/bin/env bash
set -euo pipefail

# Change to /opt/app directory where compose files are located
cd /opt/app

compose_files=()

# Always use docker-compose.system.yml first if it exists
if [[ -f docker-compose.system.yml ]]; then
  compose_files+=("-f" "docker-compose.system.yml")
fi

# Add any other docker-compose.*.yml files except docker-compose.system.yml
for file in docker-compose.*.yml; do
  if [[ -f "$file" && "$file" != "docker-compose.system.yml" ]]; then
    compose_files+=("-f" "$file")
  fi
done

# Ensure we have a command to run
if [[ $# -eq 0 ]]; then
  echo "Error: No command provided to docker compose" >&2
  docker compose --help
  exit 1
fi

# Execute docker compose with files and remaining arguments
docker compose "${compose_files[@]}" "$@"