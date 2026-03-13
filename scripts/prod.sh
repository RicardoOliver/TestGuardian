#!/usr/bin/env bash
set -euo pipefail

echo "[prod] Syncing production app via ArgoCD..."
argocd app sync qaops-platform-prod
argocd app wait qaops-platform-prod --health --timeout 600
