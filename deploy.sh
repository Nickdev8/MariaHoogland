#!/usr/bin/env bash
set -euo pipefail

# -------- CONFIG --------
USER="pi"
HOST="nickesselman.nl"
SSH_TARGET="${USER}@${HOST}"

# Deploy target for static site
REMOTE_DIR="/var/www/maria.nickesselman.nl/html"
BUILD_DIR="build"             # SvelteKit’s adapter-static output

# -------- BUILD LOCALLY --------
echo "==> Installing dependencies & building"
npm ci
npm run build

# -------- PREP REMOTE --------
echo "==> Ensuring remote directory exists: ${REMOTE_DIR}"
ssh "$SSH_TARGET" "mkdir -p '${REMOTE_DIR}'"

# -------- RSYNC BUILD --------
echo "==> Syncing ./ ${BUILD_DIR}/ → ${SSH_TARGET}:${REMOTE_DIR}"
rsync -az --delete "./${BUILD_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "✅ Static deploy to ${REMOTE_DIR} complete!"
