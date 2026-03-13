#!/usr/bin/env bash
set -euo pipefail

echo "[test] Running backend unit/integration tests..."
(cd backend && npm test)

echo "[test] Frontend smoke check (package metadata)..."
node -e "const p=require('./frontend/package.json'); if(!p.dependencies?.next) process.exit(1); console.log('frontend package ok')"
