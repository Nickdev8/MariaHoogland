#!/usr/bin/env bash
set -euo pipefail

# -------- CONFIG --------
USER="pi"
HOST="nickesselman.nl"
SSH_TARGET="${USER}@${HOST}"
APP_NAME="maria-hoogland" # Name for pm2

# Deploy target for node app
REMOTE_DIR="/var/www/mariahoogland.nl/app"

ECOS_FILE="ecosystem.config.cjs"

# -------- BUILD LOCALLY --------
echo "==> Installing dependencies & building"
npm ci
npm run build

# -------- PREP REMOTE --------
echo "==> Cleaning and ensuring remote directory exists: ${REMOTE_DIR}"
ssh "$SSH_TARGET" "rm -rf '${REMOTE_DIR}' && mkdir -p '${REMOTE_DIR}'"

# -------- RSYNC BUILD --------
echo "==> Syncing build, package files, and ecosystem config"
rsync -az --delete "./.svelte-kit/output/" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./package.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./package-lock.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./${ECOS_FILE}" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./.env" "${SSH_TARGET}:${REMOTE_DIR}/"

# Ensure src/lib/data directory exists on remote before rsyncing projects.json
ssh "$SSH_TARGET" "mkdir -p '${REMOTE_DIR}/src/lib/data'"
rsync -az "./src/lib/data/" "${SSH_TARGET}:${REMOTE_DIR}/src/lib/data/"

# -------- REMOTE SETUP --------
echo "==> Setting up remote server"
ssh "$SSH_TARGET" << EOF
  set -euo pipefail
  cd "${REMOTE_DIR}"

  # Clean up old node_modules and build directories
  rm -rf node_modules build

  # Install production dependencies
  npm ci --omit=dev

  # Start or restart the app with pm2
  if pm2 list | grep -q "${APP_NAME}"; then
    pm2 stop "${APP_NAME}"
    pm2 delete "${APP_NAME}"
    pm2 save
  fi
  pm2 start "${REMOTE_DIR}/${ECOS_FILE}" --env production
  
  pm2 save
EOF

echo "✅ Node app deploy to ${REMOTE_DIR} complete!"