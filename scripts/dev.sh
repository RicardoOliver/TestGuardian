#!/usr/bin/env bash
set -euo pipefail

echo "[dev] Installing backend dependencies..."
(cd backend && npm install)

echo "[dev] Installing frontend dependencies..."
(cd frontend && npm install)

echo "[dev] Run in separate terminals:"
echo "  1) cd backend && npm run dev"
echo "  2) cd frontend && npm run dev"
