#!/bin/bash
set -euo pipefail

# NoIDK Update Script
# Usage: ./update.sh

cd /root/hermes/noidk

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Building and deploying..."
docker compose build --no-cache backend frontend
docker compose up -d --force-recreate

echo ">>> Waiting for health..."
sleep 5

echo ">>> Verifying..."
curl -sf http://localhost:8085/api/health && echo " ✅ Backend OK" || echo " ❌ Backend FAIL"
curl -sf http://localhost:3008 >/dev/null && echo " ✅ Frontend OK" || echo " ❌ Frontend FAIL"

echo ">>> Done."
