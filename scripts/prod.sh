#!/usr/bin/env bash
set -euo pipefail

echo "[prod] Deploying production release with manual approval gate..."
echo "argocd app sync qaops-platform-prod"
