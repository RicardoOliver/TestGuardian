#!/usr/bin/env bash
set -euo pipefail

echo "[test] Running backend unit tests..."
(cd backend && npm test)
