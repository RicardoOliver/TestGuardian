#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Validating Kubernetes manifests..."
kubectl apply --dry-run=client -f k8s/

echo "[deploy] To apply for real, run: kubectl apply -f k8s/"
