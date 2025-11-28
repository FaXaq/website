set -euo pipefail

readonly MODULE_DIR="${SCRIPT_DIR}/ovh/ovh-nodejs-client"

cd "${MODULE_DIR}"
pnpm --silent install
pnpm --silent cli ping "$@"
cd - >/dev/null

echo "SUCCEED"
