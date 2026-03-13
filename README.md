# QAOps Platform

Cloud-native platform for **QA Engineering, DevOps automation and software quality monitoring**.

## What is implemented

This repository now contains a robust functional baseline with:

- **Backend API (Node.js + Express)**
  - Environment management (standard + preview environments)
  - Pipeline monitoring endpoints
  - Test automation run ingestion
  - AI-style quality/risk analysis endpoints
- **Frontend Dashboard (Next.js App Router)**
  - Metrics cards and lifecycle view (DEV → QA → UAT → PROD)
- **CI pipeline (GitHub Actions)**
  - Backend tests + frontend production build
- **Infrastructure scaffolding**
  - Kubernetes deployment/service manifest
  - Local scripts and Make targets

## Architecture

```text
Users
   │
   ▼
Frontend Dashboard (Next.js)
   │
   ▼
API Gateway (future)
   │
   ▼
Backend Services (Express API)
   ├ Environment API
   ├ Pipeline API
   ├ Test Automation API
   └ Quality Intelligence API
```

## API Endpoints

### Health
- `GET /health`

### Environments
- `GET /api/environments`
- `GET /api/environments/preview`
- `POST /api/environments/preview`
- `PATCH /api/environments/:name/status`

### Pipelines
- `GET /api/pipelines`
- `POST /api/pipelines`

### Test Automation
- `GET /api/test-automation/runs`
- `POST /api/test-automation/runs`

### Quality Intelligence
- `GET /api/quality/dashboard`
- `POST /api/quality/risk`

## Local development

### Prerequisites
- Node.js 20+
- npm
- Docker / Kubernetes (optional for deployment manifests)

### Setup and run

```bash
make dev
```

Then run services in separate terminals:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Run tests

```bash
make test
```

### Validate k8s manifests

```bash
make deploy
```

## Quality risk scoring

Risk levels:

- LOW
- MEDIUM
- HIGH
- CRITICAL

The score is determined by pass rate, coverage, failed tests, and build stability thresholds.
