#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Applying Kubernetes manifests for DEV/QA/UAT environments..."
echo "kubectl apply -f k8s/"
