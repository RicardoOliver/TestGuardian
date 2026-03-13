#!/usr/bin/env bash
set -euo pipefail

echo "[prod] Production deployment sequence"
echo "1) GitHub Actions release workflow"
echo "2) ArgoCD sync qaops-platform-prod"
echo "3) Post-deploy smoke tests"
