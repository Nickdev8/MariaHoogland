#!/usr/bin/env bash
set -euo pipefail

# -------- CONFIG --------
USER="pi"
HOST="nickesselman.nl"
SSH_TARGET="${USER}@${HOST}"
APP_NAME="maria-hoogland" # Name for pm2

# Deploy target for node app
REMOTE_DIR="/var/www/mariahoogland.nl/app"
BUILD_DIR=".svelte-kit/output/server"
ECOS_FILE="ecosystem.config.cjs"

# -------- BUILD LOCALLY --------
echo "==> Installing dependencies & building"
npm ci
npm run build

# -------- PREP REMOTE --------
echo "==> Ensuring remote directory exists: ${REMOTE_DIR}"
ssh "$SSH_TARGET" "mkdir -p '${REMOTE_DIR}'"
ssh "$SSH_TARGET" "mkdir -p '${REMOTE_DIR}/${BUILD_DIR}'"

# -------- RSYNC BUILD --------
echo "==> Syncing build, package files, and ecosystem config"
rsync -az --delete "./${BUILD_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/.svelte-kit/output/server/"
rsync -az "./package.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./package-lock.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./${ECOS_FILE}" "${SSH_TARGET}:${REMOTE_DIR}/"

# -------- REMOTE SETUP --------
echo "==> Setting up remote server"
ssh "$SSH_TARGET" << EOF
  set -euo pipefail
  cd "${REMOTE_DIR}"

  # Install production dependencies
  npm ci --omit=dev

  # Start or restart the app with pm2
  if pm2 list | grep -q "${APP_NAME}"; then
    pm2 reload "${ECOS_FILE}" --env production
  else
    pm2 start "${ECOS_FILE}" --env production
  fi
  
  pm2 save
EOF

echo "✅ Node app deploy to ${REMOTE_DIR} complete!"