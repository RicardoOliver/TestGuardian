#!/usr/bin/env bash
set -euo pipefail

echo "[dev] Starting TestGuardian local stack (backend + frontend + observability + postgres)..."
docker compose -f docker/docker-compose.yml up -d

echo "[dev] Backend: http://localhost:4000"
echo "[dev] Frontend: http://localhost:3000"
echo "[dev] Prometheus: http://localhost:9090"
echo "[dev] Grafana: http://localhost:3001"
echo "[dev] Loki: http://localhost:3100"
echo "[dev] Jaeger: http://localhost:16686"
