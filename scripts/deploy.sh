#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Applying Kubernetes manifests for platform components..."
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/qaops-backend-deployment.yaml
kubectl apply -f k8s/qaops-frontend-deployment.yaml
kubectl apply -f k8s/api-gateway.yaml
