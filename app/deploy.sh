#!/usr/bin/env bash
set -euo pipefail

USER="pi"
HOST="nickesselman.nl"
SSH_TARGET="${USER}@${HOST}"
APP_NAME="maria-hoogland" # Name for pm2

REMOTE_DIR="/var/www/maria.nickesselman.nl/app"
BUILD_DIR="build"
ECOS_FILE="ecosystem.config.cjs"

echo "==> Installing dependencies & building"
npm ci
npm run build

echo "==> Ensuring remote directory exists: ${REMOTE_DIR}"
ssh "$SSH_TARGET" "mkdir -p '${REMOTE_DIR}'"

echo "==> Syncing build, package files, and ecosystem config"
rsync -az --delete "./${BUILD_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/build/"
rsync -az "./package.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./package-lock.json" "${SSH_TARGET}:${REMOTE_DIR}/"
rsync -az "./${ECOS_FILE}" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "==> Setting up remote server"
ssh "$SSH_TARGET" << EOF
  set -euo pipefail
  cd "${REMOTE_DIR}"

  npm ci --omit=dev

  if pm2 list | grep -q "${APP_NAME}"; then
    pm2 reload "${ECOS_FILE}" --env production
  else
    pm2 start "${ECOS_FILE}" --env production
  fi
  
  pm2 save
EOF

echo "✅ Node app deploy to ${REMOTE_DIR} complete!"
